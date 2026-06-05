import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { parseValidationError } from '@core/utils/validation-error.util';
import { passwordMatch } from '@core/utils/password-match.validator';
import { PASSWORD_PATTERN } from '@core/utils/password.util';
import { AuthCardComponent } from '../auth-card/auth-card.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, FieldErrorComponent],
  template: `
    <app-auth-card heading="Restablecer contraseña" subtitle="Define tu nueva contraseña">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label class="field-label" for="password">Nueva contraseña</label>
          <div class="inp-wrap">
            <input id="password" class="inp" type="password" formControlName="password" placeholder="••••••••••" autocomplete="new-password" />
          </div>
          <div class="hint">Mín. 8 caracteres, con letras y números.</div>
          <app-field-error [control]="form.controls.password" [serverErrors]="serverErrors()['password']" />
        </div>

        <div class="field">
          <label class="field-label" for="confirm">Confirmar contraseña</label>
          <div class="inp-wrap">
            <input id="confirm" class="inp" type="password" formControlName="password_confirmation" placeholder="••••••••••" autocomplete="new-password" />
          </div>
          @if (form.hasError('passwordMismatch') && form.controls.password_confirmation.touched) {
            <div class="field-error"><span>Las contraseñas no coinciden.</span></div>
          }
        </div>

        <button type="submit" class="btn btn--hi btn--block mt-2" [disabled]="submitting()">
          {{ submitting() ? 'Guardando…' : 'Restablecer contraseña' }}
        </button>
      </form>

      <a authFooter class="link-muted" routerLink="/login">← Volver al login</a>
    </app-auth-card>
  `,
})
export class ResetPasswordComponent {
  // Bound from the ?token= query param via withComponentInputBinding.
  readonly token = input('');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);
  readonly serverErrors = signal<Record<string, string[]>>({});

  readonly form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(HAS_LETTER_AND_NUMBER)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: passwordMatch('password', 'password_confirmation') },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverErrors.set({});

    const { password, password_confirmation } = this.form.getRawValue();
    this.auth.resetPassword({ token: this.token(), password, password_confirmation }).subscribe({
      next: () => {
        this.toast.success('Contraseña restablecida correctamente.');
        this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        if (failure) {
          this.serverErrors.set(failure.fields);
          this.toast.error(failure.message);
        } else {
          this.toast.error('No se pudo restablecer la contraseña.');
        }
      },
    });
  }
}
