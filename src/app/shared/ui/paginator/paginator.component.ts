import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PaginationMeta } from '@core/models';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tc-foot">
      <span class="ent">
        Mostrando <b>{{ shown() }}</b> de <b>{{ meta().total.toLocaleString('es-MX') }}</b> entradas
      </span>
      <div class="pager">
        <button type="button" [disabled]="meta().current_page <= 1" (click)="go(meta().current_page - 1)">‹</button>
        <button type="button" class="on">{{ meta().current_page }}</button>
        <span class="pp">Página {{ meta().current_page }} de {{ meta().last_page }}</span>
        <button type="button" [disabled]="meta().current_page >= meta().last_page" (click)="go(meta().current_page + 1)">›</button>
      </div>
    </div>
  `,
})
export class PaginatorComponent {
  readonly meta = input.required<PaginationMeta>();
  // Rows currently rendered (page size may be smaller on the last page).
  readonly shownCount = input<number>();
  readonly pageChange = output<number>();

  readonly shown = computed(() => this.shownCount() ?? this.meta().per_page);

  go(page: number): void {
    const { last_page } = this.meta();
    if (page >= 1 && page <= last_page) this.pageChange.emit(page);
  }
}
