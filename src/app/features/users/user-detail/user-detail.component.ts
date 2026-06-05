import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UserDetail } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';

export interface UserDetailData {
  user: UserDetail;
}

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DialogShellComponent],
  template: `
    <app-dialog-shell eyebrow="/ detalle de usuario" [heading]="data.user.name" (close)="ref.close()">
      <div class="detail-id">
        @if (data.user.profile_photo) {
          <img [src]="data.user.profile_photo" [alt]="data.user.name" />
        } @else {
          <div class="detail-id__avatar">{{ data.user.name.charAt(0) }}</div>
        }
        <div class="n">
          <b>{{ data.user.name }}</b>
          <small>{{ data.user.code }}</small>
        </div>
      </div>

      <div class="dl">
        <div class="dl-row"><span class="k">Usuario</span><span class="v mono">{{ data.user.username }}</span></div>
        <div class="dl-row">
          <span class="k">Teléfono</span>
          <span class="v mono">
            @if (data.user.phone) {
              {{ data.user.phone.country_code }} {{ data.user.phone.number }}
            } @else {
              — sin teléfono —
            }
          </span>
        </div>
        <div class="dl-row"><span class="k">Fecha de creación</span><span class="v mono">{{ data.user.created_at | date: 'dd/MM/yyyy HH:mm' }}</span></div>
        <div class="dl-row" style="align-items:flex-start">
          <span class="k">Perfiles</span>
          <span class="v">
            <span class="taglist">
              @for (profile of data.user.profiles; track profile.id) {
                <span class="tag hi">{{ profile.name }}</span>
              }
            </span>
          </span>
        </div>
      </div>

      <button dialogFooter type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close()">Cerrar</button>
      <button dialogFooter type="button" class="btn btn--dark" style="flex:1" (click)="ref.close('edit')">Editar</button>
    </app-dialog-shell>
  `,
  styles: `
    .detail-id { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .detail-id img,
    .detail-id__avatar { width: 58px; height: 58px; border-radius: 8px; object-fit: cover; border: 1px solid var(--line); }
    .detail-id__avatar { display: grid; place-items: center; background: var(--hi); color: var(--on-hi); font-weight: 700; font-size: 24px; }
    .detail-id .n b { font-size: 17px; display: block; }
    .detail-id .n small { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  `,
})
export class UserDetailComponent {
  readonly data = inject<UserDetailData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<'edit'>>(DialogRef);
}
