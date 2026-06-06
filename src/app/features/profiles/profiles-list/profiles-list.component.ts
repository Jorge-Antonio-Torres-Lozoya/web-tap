import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ProfilesService } from '@core/services/profiles.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { ConfirmService } from '@shared/ui/confirm/confirm.service';
import { saveBlob } from '@core/utils/download-file.util';
import { Profile, PaginationMeta, FIRST_PAGE } from '@core/models';
import { PaginatorComponent } from '@shared/ui/paginator/paginator.component';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';

@Component({
  selector: 'app-profiles-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, PaginatorComponent],
  templateUrl: './profiles-list.component.html',
})
export class ProfilesListComponent implements OnInit {
  private readonly profiles = inject(ProfilesService);
  private readonly dialog = inject(Dialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<Profile[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(page = FIRST_PAGE): void {
    this.loading.set(true);
    this.error.set(false);
    this.profiles.list(page).subscribe({
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
      .open<boolean>(ProfileFormComponent, { data: { mode: 'create' }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  openEdit(profile: Profile): void {
    this.dialog
      .open<boolean>(ProfileFormComponent, { data: { mode: 'edit', profile }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  openDetail(profile: Profile): void {
    this.dialog
      .open<'edit'>(ProfileDetailComponent, { data: { profile }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((action) => {
        if (action === 'edit') this.openEdit(profile);
      });
  }

  async remove(profile: Profile): Promise<void> {
    const confirmed = await this.confirm.confirm({
      title: 'Eliminar perfil',
      highlight: `${profile.code} — ${profile.name}`,
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      danger: true,
    });
    if (!confirmed) return;

    this.profiles.remove(profile.id).subscribe({
      next: () => {
        this.toast.success('Perfil eliminado.');
        this.reload();
      },
      error: () => this.toast.error('No se pudo eliminar el perfil.'),
    });
  }

  exportPdf(): void {
    this.toast.show('Generando PDF…', 'info');
    this.profiles.exportPdf().subscribe({
      next: (blob) => {
        saveBlob(blob, 'perfiles.pdf');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el PDF.'),
    });
  }

  exportExcel(): void {
    this.toast.show('Generando Excel…', 'info');
    this.profiles.exportExcel().subscribe({
      next: (blob) => {
        saveBlob(blob, 'perfiles.xlsx');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el Excel.'),
    });
  }

  private reload(): void {
    this.load(this.meta()?.current_page ?? FIRST_PAGE);
  }
}
