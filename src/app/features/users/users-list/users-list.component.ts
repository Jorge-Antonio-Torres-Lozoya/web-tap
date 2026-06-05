import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { UsersService } from '@core/services/users.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { ConfirmService } from '@shared/ui/confirm/confirm.service';
import { saveBlob } from '@core/utils/download-file.util';
import { UserDetail, UserListItem, PaginationMeta } from '@core/models';
import { PaginatorComponent } from '@shared/ui/paginator/paginator.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-users-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, PaginatorComponent],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  private readonly users = inject(UsersService);
  private readonly dialog = inject(Dialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<UserListItem[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number): void {
    this.loading.set(true);
    this.error.set(false);
    this.users.list(page).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.meta.set(result.meta);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.dialog
      .open<boolean>(UserFormComponent, { data: { mode: 'create' }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  // Detail and edit need the full user, so fetch it first.
  openDetail(item: UserListItem): void {
    this.users.get(item.id).subscribe({
      next: (user) =>
        this.dialog
          .open<'edit'>(UserDetailComponent, { data: { user }, backdropClass: 'tap-backdrop' })
          .closed.subscribe((action) => {
            if (action === 'edit') this.openEdit(user);
          }),
      error: () => this.toast.error('No se pudo cargar el usuario.'),
    });
  }

  edit(item: UserListItem): void {
    this.users.get(item.id).subscribe({
      next: (user) => this.openEdit(user),
      error: () => this.toast.error('No se pudo cargar el usuario.'),
    });
  }

  async remove(item: UserListItem): Promise<void> {
    const confirmed = await this.confirm.confirm({
      title: 'Eliminar usuario',
      message: `¿Eliminar ${item.code} — ${item.name}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      danger: true,
    });
    if (!confirmed) return;

    this.users.remove(item.id).subscribe({
      next: () => {
        this.toast.success('Usuario eliminado.');
        this.reload();
      },
      error: () => this.toast.error('No se pudo eliminar el usuario.'),
    });
  }

  exportPdf(): void {
    this.toast.show('Generando PDF…', 'info');
    this.users.exportPdf().subscribe({
      next: (blob) => {
        saveBlob(blob, 'usuarios.pdf');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el PDF.'),
    });
  }

  exportExcel(): void {
    this.toast.show('Generando Excel…', 'info');
    this.users.exportExcel().subscribe({
      next: (blob) => {
        saveBlob(blob, 'usuarios.xlsx');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el Excel.'),
    });
  }

  private openEdit(user: UserDetail): void {
    this.dialog
      .open<boolean>(UserFormComponent, { data: { mode: 'edit', user }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  private reload(): void {
    this.load(this.meta()?.current_page ?? 1);
  }
}
