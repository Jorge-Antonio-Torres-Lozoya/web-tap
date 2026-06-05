import { AbstractControl, ValidationErrors } from '@angular/forms';

// Flags `integer` when the value is present but not a whole number.
export function integerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') return null;
  return Number.isInteger(value) ? null : { integer: true };
}
