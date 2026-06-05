import { ChangeDetectionStrategy, Component } from '@angular/core';

// Placeholder — implemented in Phase 5.
@Component({
  selector: 'app-users-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <div>
        <h2>Gestión de Usuarios</h2>
        <p>Administración de personal y accesos al sistema.</p>
      </div>
    </div>
    <div class="tablecard">
      <div class="state-block">Módulo de usuarios — en construcción (Fase 5).</div>
    </div>
  `,
})
export class UsersListComponent {}
