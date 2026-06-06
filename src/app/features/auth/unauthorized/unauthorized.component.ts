import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ua">
      <div class="ua__card">
        <div class="ua__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <h1>Sin acceso</h1>
        @if (hasSections) {
          <p>No tienes permisos para acceder a esta sección. Contacta a un administrador si crees que es un error.</p>
          <div class="ua__actions">
            <button type="button" class="btn btn--ghost" (click)="logout()">Cerrar sesión</button>
            <button type="button" class="btn btn--dark" (click)="home()">Ir al inicio</button>
          </div>
        } @else {
          <p>Tu cuenta no tiene ninguna sección asignada. Pide a un administrador que te asigne un perfil con acceso para poder usar el sistema.</p>
          <div class="ua__actions">
            <button type="button" class="btn btn--dark" (click)="logout()">Cerrar sesión</button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // No sections at all → "Ir al inicio" would loop back here, so we hide it.
  readonly hasSections = this.auth.sections().length > 0;

  home(): void {
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.auth.logout();
  }
}
