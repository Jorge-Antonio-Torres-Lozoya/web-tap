import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogShellComponent } from '../dialog/dialog-shell.component';

export interface ConfirmData {
  title: string;
  message: string;
  // Optional entity shown in bold (e.g. "PRD-0003 — Grúa hidráulica").
  highlight?: string;
  confirmText?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogShellComponent],
  template: `
    <app-dialog-shell eyebrow="/ confirmar" [heading]="data.title" (close)="ref.close(false)">
      <p class="confirm-text">
        @if (data.highlight) {
          <strong>{{ data.highlight }}</strong>
        }
        <span>{{ data.message }}</span>
      </p>

      <button dialogFooter type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close(false)">Cancelar</button>
      <button
        dialogFooter
        type="button"
        class="btn"
        style="flex:1"
        [class.btn--danger]="data.danger"
        [class.btn--dark]="!data.danger"
        (click)="ref.close(true)"
      >
        {{ data.confirmText ?? 'Confirmar' }}
      </button>
    </app-dialog-shell>
  `,
  styles: `
    .confirm-text { font-size: 14px; line-height: 1.55; }
    .confirm-text strong { display: block; margin-bottom: 6px; color: var(--ink); }
    .confirm-text span { color: var(--ink-2); }
  `,
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<boolean>>(DialogRef);
}
