import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogShellComponent } from '../dialog/dialog-shell.component';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogShellComponent],
  template: `
    <app-dialog-shell eyebrow="/ confirmar" [title]="data.title" (close)="ref.close(false)">
      <p>{{ data.message }}</p>
      <div dialogFooter>
        <button type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close(false)">Cancelar</button>
        <button
          type="button"
          class="btn"
          style="flex:1"
          [class.btn--danger]="data.danger"
          [class.btn--dark]="!data.danger"
          (click)="ref.close(true)"
        >
          {{ data.confirmText ?? 'Confirmar' }}
        </button>
      </div>
    </app-dialog-shell>
  `,
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<boolean>>(DialogRef);
}
