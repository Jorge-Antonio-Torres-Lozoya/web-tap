import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ProductsService } from '@core/services/products.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { ConfirmService } from '@shared/ui/confirm/confirm.service';
import { saveBlob } from '@core/utils/download-file.util';
import { Product, PaginationMeta, FIRST_PAGE } from '@core/models';
import { PaginatorComponent } from '@shared/ui/paginator/paginator.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-products-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ReactiveFormsModule, PaginatorComponent],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent implements OnInit {
  private readonly products = inject(ProductsService);
  private readonly dialog = inject(Dialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly search = signal('');
  readonly searchControl = new FormControl('', { nonNullable: true });

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.search.set(term.trim());
        this.load(FIRST_PAGE);
      });
  }

  ngOnInit(): void {
    this.load();
  }

  load(page = FIRST_PAGE): void {
    this.loading.set(true);
    this.error.set(false);
    this.products.list(page, this.search()).subscribe({
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
      .open<boolean>(ProductFormComponent, { data: { mode: 'create' }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  openEdit(product: Product): void {
    this.dialog
      .open<boolean>(ProductFormComponent, { data: { mode: 'edit', product }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((saved) => {
        if (saved) this.reload();
      });
  }

  openDetail(product: Product): void {
    this.dialog
      .open<'edit'>(ProductDetailComponent, { data: { product }, backdropClass: 'tap-backdrop' })
      .closed.subscribe((action) => {
        if (action === 'edit') this.openEdit(product);
      });
  }

  async remove(product: Product): Promise<void> {
    const confirmed = await this.confirm.confirm({
      title: 'Eliminar producto',
      highlight: `${product.code} — ${product.name}`,
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      danger: true,
    });
    if (!confirmed) return;

    this.products.remove(product.id).subscribe({
      next: () => {
        this.toast.success('Producto eliminado.');
        this.reload();
      },
      error: () => this.toast.error('No se pudo eliminar el producto.'),
    });
  }

  exportPdf(): void {
    this.toast.show('Generando PDF…', 'info');
    this.products.exportPdf().subscribe({
      next: (blob) => {
        saveBlob(blob, 'productos.pdf');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el PDF.'),
    });
  }

  exportExcel(): void {
    this.toast.show('Generando Excel…', 'info');
    this.products.exportExcel().subscribe({
      next: (blob) => {
        saveBlob(blob, 'productos.xlsx');
        this.toast.success('Descarga lista.');
      },
      error: () => this.toast.error('No se pudo descargar el Excel.'),
    });
  }

  // Reload the current page after a mutation.
  private reload(): void {
    this.load(this.meta()?.current_page ?? FIRST_PAGE);
  }
}
