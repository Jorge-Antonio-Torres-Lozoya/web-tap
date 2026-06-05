import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { parseValidationError } from '@core/utils/validation-error.util';
import { AuthCardComponent } from '../auth-card/auth-card.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, FieldErrorComponent],
  template: `
    <app-auth-card title="Recuperar contraseña" subtitle="Te enviaremos un enlace por correo">
      @if (sent()) {
        <div class="notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span>Si el correo existe, enviamos las instrucciones para restablecer tu contraseña.</span>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label class="field-label" for="username">Usuario (correo)</label>
            <div class="inp-wrap">
              <input id="username" class="inp" type="email" formControlName="username" placeholder="admin@tapterminal.com" autocomplete="username" />
            </div>
            <app-field-error [control]="form.controls.username" [serverErrors]="serverErrors()['username']" />
          </div>

          <button type="submit" class="btn btn--hi btn--block mt-2" [disabled]="submitting()">
            {{ submitting() ? 'Enviando…' : 'Enviar instrucciones' }}
          </button>
        </form>
      }

      <a authFooter class="link-muted" routerLink="/login">← Volver al login</a>
    </app-auth-card>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);
  readonly sent = signal(false);
  readonly serverErrors = signal<Record<string, string[]>>({});

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverErrors.set({});

    this.auth.forgotPassword(this.form.controls.username.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
        this.toast.success('Se enviaron las instrucciones a tu correo.');
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        if (failure) this.serverErrors.set(failure.fields);
        else this.toast.error('No se pudo procesar la solicitud.');
      },
    });
  }
}
