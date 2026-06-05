import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmData, ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialog = inject(Dialog);

  async confirm(data: ConfirmData): Promise<boolean> {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      data,
      backdropClass: 'tap-backdrop',
    });
    return (await firstValueFrom(ref.closed)) === true;
  }
}
