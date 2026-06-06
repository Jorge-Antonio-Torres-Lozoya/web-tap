import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AuthService } from '@core/services/auth.service';
import { ProfilesService } from '@core/services/profiles.service';
import { SectionsService } from '@core/services/sections.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { apiMessage, parseValidationError } from '@core/utils/validation-error.util';
import { Profile, ProfilePayload, isSectionSlug } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';
import { MultiSelectComponent, MultiOption } from '@shared/ui/multi-select/multi-select.component';

export interface ProfileFormData {
  mode: 'create' | 'edit';
  profile?: Profile;
}

@Component({
  selector: 'app-profile-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DialogShellComponent, FieldErrorComponent, MultiSelectComponent],
  template: `
    <app-dialog-shell
      [eyebrow]="isCreate ? '/ alta de registro' : '/ edición'"
      [heading]="isCreate ? 'Nuevo perfil' : 'Editar perfil'"
      (close)="ref.close()"
    >
      <form class="form" [formGroup]="form" (ngSubmit)="save()">
        @if (formError()) {
          <div class="form-alert mb-2" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></svg>
            <span>{{ formError() }}</span>
          </div>
        }

        @if (data.profile; as profile) {
          <div class="field">
            <label class="flab">Código</label>
            <div class="ro-code">{{ profile.code }}<span class="tg">SOLO LECTURA</span></div>
          </div>
        }

        <div class="field">
          <label class="flab" for="name">Nombre <span class="req">*</span></label>
          <input id="name" class="inp" formControlName="name" placeholder="Ventas" />
          <app-field-error [control]="form.controls.name" [serverErrors]="serverErrors()['name']" />
        </div>

        <div class="field">
          <label class="flab">Secciones <span class="req">*</span></label>
          @if (sectionsLoading()) {
            <div class="state-block" style="padding:14px">Cargando secciones…</div>
          } @else {
            <app-multi-select
              formControlName="sections"
              [options]="sectionOptions()"
              lockedTitle="No puedes otorgar una sección que no tienes."
            />
          }
          <div class="hint">
            Selecciona al menos una sección.
            @if (hasLockedSections()) {
              Las secciones bloqueadas requieren que tú las tengas asignadas.
            }
          </div>
          <app-field-error [control]="form.controls.sections" [serverErrors]="serverErrors()['sections']" />
        </div>
      </form>

      <button dialogFooter type="button" class="btn btn--ghost" style="flex:1" (click)="ref.close()">Cancelar</button>
      <button dialogFooter type="button" class="btn btn--hi btn--uc" style="flex:1.3" [disabled]="submitting()" (click)="save()">
        {{ submitting() ? 'Guardando…' : 'Guardar' }}
      </button>
    </app-dialog-shell>
  `,
})
export class ProfileFormComponent implements OnInit {
  readonly data = inject<ProfileFormData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<boolean>>(DialogRef);

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly profiles = inject(ProfilesService);
  private readonly sections = inject(SectionsService);
  private readonly toast = inject(ToastService);

  readonly isCreate = this.data.mode === 'create';
  readonly submitting = signal(false);
  readonly serverErrors = signal<Record<string, string[]>>({});
  readonly formError = signal<string | null>(null);
  readonly sectionOptions = signal<MultiOption[]>([]);
  readonly sectionsLoading = signal(true);
  readonly hasLockedSections = computed(() => this.sectionOptions().some((opt) => opt.disabled));

  // Profiles return sections as objects; the form works with slugs.
  readonly form = this.fb.group({
    name: this.fb.nonNullable.control(this.data.profile?.name ?? '', [Validators.required, Validators.maxLength(255)]),
    sections: this.fb.nonNullable.control<string[]>(
      this.data.profile?.sections.map((section) => section.slug) ?? [],
      [Validators.required],
    ),
  });

  ngOnInit(): void {
    this.sections.list().subscribe({
      next: (sections) => {
        // Lock sections the current user doesn't have → can't grant privileges they lack.
        this.sectionOptions.set(
          sections.map((section) => ({
            value: section.slug,
            label: section.name,
            sublabel: section.code,
            disabled: !this.auth.hasSection(section.slug),
          })),
        );
        this.sectionsLoading.set(false);
      },
      error: () => {
        this.sectionsLoading.set(false);
        this.toast.error('No se pudieron cargar las secciones.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: ProfilePayload = { name: value.name, sections: value.sections.filter(isSectionSlug) };

    this.submitting.set(true);
    this.serverErrors.set({});
    this.formError.set(null);

    const profile = this.data.profile;
    const request = !this.isCreate && profile ? this.profiles.update(profile.id, payload) : this.profiles.create(payload);

    request.subscribe({
      next: () => {
        this.toast.success(this.isCreate ? 'Perfil creado correctamente.' : 'Perfil actualizado correctamente.');
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        if (failure && Object.keys(failure.fields).length) {
          this.serverErrors.set(failure.fields);
        } else {
          // Business-rule rejection (e.g. last-admin protection) → show it inside the modal.
          this.formError.set(apiMessage(error) ?? 'No se pudo guardar el perfil.');
        }
      },
    });
  }
}
