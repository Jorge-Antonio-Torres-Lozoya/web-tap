import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Profile } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';

export interface ProfileDetailData {
  profile: Profile;
}

@Component({
  selector: 'app-profile-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DialogShellComponent],
  template: `
    <app-dialog-shell eyebrow="/ detalle de perfil" [heading]="data.profile.name" (close)="ref.close()">
      <div class="dl">
        <div class="dl-row"><span class="k">Código de perfil</span><span class="v code">{{ data.profile.code }}</span></div>
        <div class="dl-row"><span class="k">Nombre</span><span class="v">{{ data.profile.name }}</span></div>
        <div class="dl-row"><span class="k">Fecha de creación</span><span class="v mono">{{ data.profile.created_at | date: 'dd/MM/yyyy HH:mm' }}</span></div>
        <div class="dl-row" style="align-items:flex-start">
          <span class="k">Secciones</span>
          <span class="v">
            <span class="taglist">
              @for (section of data.profile.sections; track section.slug) {
                <span class="tag hi">{{ section.name }}</span>
              }
            </span>
          </span>
        </div>
      </div>

      <button dialogFooter type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close()">Cerrar</button>
      <button dialogFooter type="button" class="btn btn--dark" style="flex:1" (click)="ref.close('edit')">Editar</button>
    </app-dialog-shell>
  `,
})
export class ProfileDetailComponent {
  readonly data = inject<ProfileDetailData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<'edit'>>(DialogRef);
}
