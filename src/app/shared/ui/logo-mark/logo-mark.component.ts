import { ChangeDetectionStrategy, Component } from '@angular/core';

// Brand reach-stacker mark, for dark surfaces (sidebar, auth banner).
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="18" width="9" height="9" stroke="#FFC400" stroke-width="1.6" />
      <rect x="3" y="9" width="9" height="9" stroke="#FFC400" stroke-width="1.6" />
      <path d="M14 27V13l8-4v18" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" />
      <rect x="17" y="12" width="9" height="6" fill="#FFC400" />
      <path d="M3 28h26" stroke="#fff" stroke-width="1.6" />
    </svg>
  `,
  styles: `
    :host { display: inline-grid; place-items: center; }
    svg { width: 100%; height: 100%; }
  `,
})
export class LogoMarkComponent {}
