import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

// Visual chrome for dialogs opened via CDK Dialog. CDK handles focus-trap,
// scroll-lock and ARIA; this only renders the styled card.
@Component({
  selector: 'app-dialog-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog">
      <div class="dialog__top"></div>
      <div class="dialog__head">
        <div>
          @if (eyebrow()) {
            <span class="eyebrow">{{ eyebrow() }}</span>
          }
          <h3>{{ heading() }}</h3>
        </div>
        <button type="button" class="dialog__close" (click)="close.emit()" aria-label="Cerrar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="dialog__body">
        <ng-content />
      </div>
      <div class="dialog__foot">
        <ng-content select="[dialogFooter]" />
      </div>
    </div>
  `,
  styleUrl: './dialog-shell.component.scss',
})
export class DialogShellComponent {
  readonly heading = input('');
  readonly eyebrow = input<string>();
  readonly close = output<void>();
}
