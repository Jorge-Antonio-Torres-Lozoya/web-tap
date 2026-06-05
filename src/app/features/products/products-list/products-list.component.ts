import { ChangeDetectionStrategy, Component } from '@angular/core';

// Placeholder — implemented in Phase 4.
@Component({
  selector: 'app-products-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <div>
        <h2>Gestión de Productos</h2>
        <p>Catálogo de productos y precios del sistema.</p>
      </div>
    </div>
    <div class="tablecard">
      <div class="state-block">Módulo de productos — en construcción (Fase 4).</div>
    </div>
  `,
})
export class ProductsListComponent {}
