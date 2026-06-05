import { ChangeDetectionStrategy, Component } from '@angular/core';

// Placeholder — implemented in Phase 6.
@Component({
  selector: 'app-profiles-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <div>
        <h2>Gestión de Perfiles</h2>
        <p>Perfiles de acceso y secciones asignadas.</p>
      </div>
    </div>
    <div class="tablecard">
      <div class="state-block">Módulo de perfiles — en construcción (Fase 6).</div>
    </div>
  `,
})
export class ProfilesListComponent {}
