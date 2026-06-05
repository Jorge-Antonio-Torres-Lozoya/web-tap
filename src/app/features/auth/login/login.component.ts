import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { parseValidationError } from '@core/utils/validation-error.util';
import { AuthCardComponent } from '../auth-card/auth-card.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, FieldErrorComponent],
  template: `
    <app-auth-card heading="Iniciar sesión" subtitle="TAP · CLJ Terminal Portuaria">
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (formError()) {
          <div class="form-alert mb-2" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></svg>
            <span>{{ formError() }}</span>
          </div>
        }

        <div class="field">
          <div class="flex items-center justify-between mb-2">
            <label class="field-label" for="username">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>
              Usuario
            </label>
          </div>
          <div class="inp-wrap">
            <input id="username" class="inp" type="email" formControlName="username" placeholder="admin@tapterminal.com" autocomplete="username" />
          </div>
          <app-field-error [control]="form.controls.username" />
        </div>

        <div class="field">
          <div class="flex items-center justify-between mb-2">
            <label class="field-label" for="password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              Contraseña
            </label>
            <a class="link-amber" routerLink="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          <div class="inp-wrap">
            <input id="password" class="inp has-icon" [type]="reveal() ? 'text' : 'password'" formControlName="password" placeholder="••••••••••" autocomplete="current-password" />
            <button type="button" class="eye" (click)="reveal.set(!reveal())" [attr.aria-label]="reveal() ? 'Ocultar contraseña' : 'Mostrar contraseña'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            </button>
          </div>
          <app-field-error [control]="form.controls.password" />
        </div>

        <div class="notice mt-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /></svg>
          <span>El acceso está restringido a personal autorizado. Toda actividad es monitoreada y registrada conforme a las políticas de seguridad.</span>
        </div>

        <button type="submit" class="btn btn--hi btn--block mt-4" [disabled]="submitting()">
          {{ submitting() ? 'Autenticando…' : 'Autenticar' }}
          @if (!submitting()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          }
        </button>
      </form>
    </app-auth-card>
  `,
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly reveal = signal(false);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.formError.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        // Invalid credentials are a form-level error (don't reveal which field).
        if (failure) {
          this.formError.set(failure.message);
        } else {
          this.toast.error('No se pudo iniciar sesión. Inténtalo de nuevo.');
        }
      },
    });
  }
}
