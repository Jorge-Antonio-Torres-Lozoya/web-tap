import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Product } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';

export interface ProductDetailData {
  product: Product;
}

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DialogShellComponent],
  template: `
    <app-dialog-shell eyebrow="/ detalle de producto" [heading]="data.product.name" (close)="ref.close()">
      <div class="dl">
        <div class="dl-row"><span class="k">Código</span><span class="v code">{{ data.product.code }}</span></div>
        <div class="dl-row"><span class="k">Nombre</span><span class="v">{{ data.product.name }}</span></div>
        <div class="dl-row"><span class="k">Marca</span><span class="v">{{ data.product.brand }}</span></div>
        <div class="dl-row"><span class="k">Precio</span><span class="v mono">\${{ data.product.price }} MXN</span></div>
        <div class="dl-row"><span class="k">Fecha de creación</span><span class="v mono">{{ data.product.created_at | date: 'dd/MM/yyyy HH:mm' }}</span></div>
      </div>

      <div dialogFooter>
        <button type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close()">Cerrar</button>
        <button type="button" class="btn btn--dark" style="flex:1" (click)="ref.close('edit')">Editar</button>
      </div>
    </app-dialog-shell>
  `,
})
export class ProductDetailComponent {
  readonly data = inject<ProductDetailData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<'edit'>>(DialogRef);
}
