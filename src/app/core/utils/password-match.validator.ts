import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Group-level validator: flags `passwordMismatch` when the two fields differ.
export function passwordMatch(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmation = group.get(confirmKey)?.value;
    return password === confirmation ? null : { passwordMismatch: true };
  };
}
