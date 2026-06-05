import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UsersService } from '@core/services/users.service';
import { ProfilesService } from '@core/services/profiles.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { parseValidationError } from '@core/utils/validation-error.util';
import { passwordMatch } from '@core/utils/password-match.validator';
import { PASSWORD_PATTERN } from '@core/utils/password.util';
import { UserDetail } from '@core/models';
import { DialogShellComponent } from '@shared/ui/dialog/dialog-shell.component';
import { FieldErrorComponent } from '@shared/ui/field-error/field-error.component';
import { ImageDropzoneComponent } from '@shared/ui/image-dropzone/image-dropzone.component';
import { MultiSelectComponent, MultiOption } from '@shared/ui/multi-select/multi-select.component';
import { buildUserFormData } from './user-form-data.util';

export interface UserFormData {
  mode: 'create' | 'edit';
  user?: UserDetail;
}

// Phone is optional, but a number requires a valid country code.
function phoneConsistency(group: AbstractControl): ValidationErrors | null {
  const number = group.get('phoneNumber')?.value;
  const country = group.get('phoneCountry')?.value;
  if (!number) return null;
  return typeof country === 'string' && /^\+\d{1,4}$/.test(country) ? null : { phoneIncomplete: true };
}

@Component({
  selector: 'app-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DialogShellComponent,
    FieldErrorComponent,
    ImageDropzoneComponent,
    MultiSelectComponent,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  readonly data = inject<UserFormData>(DIALOG_DATA);
  readonly ref = inject<DialogRef<boolean>>(DialogRef);

  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UsersService);
  private readonly profiles = inject(ProfilesService);
  private readonly toast = inject(ToastService);

  readonly isCreate = this.data.mode === 'create';
  readonly submitting = signal(false);
  readonly serverErrors = signal<Record<string, string[]>>({});
  readonly profileOptions = signal<MultiOption[]>([]);

  readonly form = this.fb.group(
    {
      name: this.fb.nonNullable.control(this.data.user?.name ?? '', [Validators.required, Validators.maxLength(255)]),
      username: this.fb.nonNullable.control(this.data.user?.username ?? '', [Validators.required, Validators.email]),
      phoneCountry: this.fb.nonNullable.control(this.data.user?.phone?.country_code ?? '+52'),
      phoneNumber: this.fb.nonNullable.control(this.data.user?.phone?.number ?? ''),
      photo: this.fb.control<File | null>(null, this.isCreate ? [Validators.required] : []),
      password: this.fb.nonNullable.control(
        '',
        this.isCreate
          ? [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]
          : [Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)],
      ),
      passwordConfirmation: this.fb.nonNullable.control(''),
      profileIds: this.fb.nonNullable.control<string[]>(this.data.user?.profiles.map((p) => p.id) ?? [], [
        Validators.required,
      ]),
    },
    { validators: [passwordMatch('password', 'passwordConfirmation'), phoneConsistency] },
  );

  ngOnInit(): void {
    this.profiles.list(1).subscribe({
      next: (result) =>
        this.profileOptions.set(
          result.items.map((profile) => ({ value: profile.id, label: profile.name, sublabel: profile.code })),
        ),
      error: () => this.toast.error('No se pudieron cargar los perfiles.'),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverErrors.set({});

    const formData = buildUserFormData(this.form.getRawValue(), this.data.mode);
    const user = this.data.user;
    const request = !this.isCreate && user ? this.users.update(user.id, formData) : this.users.create(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isCreate ? 'Usuario creado correctamente.' : 'Usuario actualizado correctamente.');
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const failure = parseValidationError(error);
        if (failure) this.serverErrors.set(failure.fields);
        else this.toast.error('No se pudo guardar el usuario.');
      },
    });
  }
}
