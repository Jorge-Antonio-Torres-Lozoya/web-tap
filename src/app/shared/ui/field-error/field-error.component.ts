import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

interface LengthError {
  requiredLength: number;
}
interface MinError {
  min: number;
}
interface MaxError {
  max: number;
}

// Renders client-side validator messages (once touched) plus server 422 messages.
@Component({
  selector: 'app-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (messages().length) {
      <div class="field-error">
        @for (m of messages(); track m) {
          <span>{{ m }}</span>
        }
      </div>
    }
  `,
})
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>();
  readonly serverErrors = input<string[] | null>();

  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    // Reflect live control state (value/touched/status) under OnPush.
    effect((onCleanup) => {
      const control = this.control();
      if (!control) return;
      const sub = control.events.subscribe(() => this.cdr.markForCheck());
      onCleanup(() => sub.unsubscribe());
    });
  }

  messages(): string[] {
    const out: string[] = [];
    const control = this.control();
    if (control?.touched && control.errors) {
      const errors = control.errors;
      out.push(...Object.keys(errors).map((key) => this.messageFor(key, errors)));
    }
    const server = this.serverErrors();
    if (server) out.push(...server);
    return out;
  }

  private messageFor(key: string, errors: ValidationErrors): string {
    switch (key) {
      case 'required':
        return 'Este campo es obligatorio.';
      case 'email':
        return 'Correo electrónico no válido.';
      case 'minlength': {
        const error: LengthError = errors['minlength'];
        return `Mínimo ${error.requiredLength} caracteres.`;
      }
      case 'maxlength': {
        const error: LengthError = errors['maxlength'];
        return `Máximo ${error.requiredLength} caracteres.`;
      }
      case 'min': {
        const error: MinError = errors['min'];
        return `El valor mínimo es ${error.min}.`;
      }
      case 'max': {
        const error: MaxError = errors['max'];
        return `El valor máximo es ${error.max}.`;
      }
      case 'pattern':
        return 'Formato no válido.';
      default: {
        const value: unknown = errors[key];
        return typeof value === 'string' ? value : 'Valor no válido.';
      }
    }
  }
}
