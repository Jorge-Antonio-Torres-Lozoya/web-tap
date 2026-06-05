import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ProductsService } from '@core/services/products.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { parseValidationError } from '@core/utils/validation-error.util';
import { integerValidator } from '@core/utils/integer.validator';
import { Product, ProductPayload } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';

export interface ProductFormData {
  mode: 'create' | 'edit';
  product?: Product;
}

@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DialogShellComponent, FieldErrorComponent],
  template: `
    <app-dialog-shell [eyebrow]="isEdit ? '/ edición' : '/ alta de registro'" [heading]="isEdit ? 'Editar producto' : 'Nuevo producto'" (close)="ref.close()">
      <form class="form" [formGroup]="form" (ngSubmit)="save()">
        <div class="field">
          <label class="flab">Código (auto-generado)</label>
          <div class="ro-code">
            {{ data.product?.code ?? 'PRD-—— · se asigna al guardar' }}
            <span class="tg">SOLO LECTURA</span>
          </div>
        </div>

        <div class="field">
          <label class="flab" for="name">Nombre <span class="req">*</span></label>
          <input id="name" class="inp" formControlName="name" placeholder="Grúa hidráulica" />
          <app-field-error [control]="form.controls.name" [serverErrors]="serverErrors()['name']" />
        </div>

        <div class="field">
          <label class="flab" for="brand">Marca <span class="req">*</span></label>
          <input id="brand" class="inp" formControlName="brand" placeholder="Caterpillar" />
          <app-field-error [control]="form.controls.brand" [serverErrors]="serverErrors()['brand']" />
        </div>

        <div class="field">
          <label class="flab" for="price">Precio <span class="req">*</span></label>
          <input id="price" class="inp mono" type="number" min="1" max="999" formControlName="price" placeholder="500" />
          <div class="hint">Entero entre 1 y 999 (máx. 3 dígitos).</div>
          <app-field-error [control]="form.controls.price" [serverErrors]="serverErrors()['price']" />
        </div>
      </form>

      <div dialogFooter>
        <button type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close()">Cancelar</button>
        <button type="button" class="btn btn--hi btn--uc" style="flex:1.3" [disabled]="submitting()" (click)="save()">
          {{ submitting() ? 'Guardando…' : 'Guardar' }}
        </button>
      </div>
    </app-dialog-shell>
  `,
})
export class ProductFormComponent {
  readonly data = inject<ProductFormData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<boolean>>(DialogRef);

  private readonly fb = inject(FormBuilder);
  private readonly products = inject(ProductsService);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);
  readonly serverErrors = signal<Record<string, string[]>>({});

  readonly isEdit = this.data.mode === 'edit';

  readonly form = this.fb.group({
    name: this.fb.nonNullable.control(this.data.product?.name ?? '', [Validators.required, Validators.maxLength(255)]),
    brand: this.fb.nonNullable.control(this.data.product?.brand ?? '', [Validators.required, Validators.maxLength(255)]),
    price: this.fb.control<number | null>(this.data.product?.price ?? null, [
      Validators.required,
      Validators.min(1),
      Validators.max(999),
      integerValidator,
    ]),
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.price === null) return;

    const payload: ProductPayload = { name: value.name, brand: value.brand, price: value.price };
    this.submitting.set(true);
    this.serverErrors.set({});

    const request =
      this.isEdit && this.data.product
        ? this.products.update(this.data.product.id, payload)
        : this.products.create(payload);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        if (failure) this.serverErrors.set(failure.fields);
        else this.toast.error('No se pudo guardar el producto.');
      },
    });
  }
}
