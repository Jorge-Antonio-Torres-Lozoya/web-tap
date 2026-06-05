import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LogoMarkComponent } from '@shared/ui/logo-mark/logo-mark.component';

// Shared chrome for the public auth screens (login / forgot / reset):
// dark backdrop + white card + brand banner + footer slot.
@Component({
  selector: 'app-auth-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoMarkComponent],
  template: `
    <div class="auth">
      <div class="auth__brandmark">TAP · CLJ · MZO</div>
      <div class="auth__status">
        ESTADO DEL TERMINAL: ACTIVO<br />
        <span class="dim">CIFRADO:</span> AES-256 GCM
      </div>

      <div class="authcard">
        <div class="authcard__top"></div>
        <div class="authcard__pad">
          <div class="authbanner">
            <div class="authbanner__lg"><app-logo-mark /></div>
            <div class="authbanner__tx">
              <b>Administración Interna</b>
              <small>Grupo TAP · Terminal Portuaria</small>
            </div>
            <div class="authbanner__bar"></div>
          </div>

          <h1>{{ title() }}</h1>
          <div class="sub">{{ subtitle() }}</div>

          <ng-content />

          <div class="authcard__foot">
            <span>v1.0 · Secure Engine</span>
            <ng-content select="[authFooter]" />
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth-card.component.scss',
})
export class AuthCardComponent {
  readonly title = input('');
  readonly subtitle = input('');
}
