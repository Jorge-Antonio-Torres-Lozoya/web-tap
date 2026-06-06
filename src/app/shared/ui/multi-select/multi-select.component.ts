import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface MultiOption {
  value: string;
  label: string;
  sublabel?: string;
  // Locked options keep their current state and cannot be toggled (e.g. a
  // section the current user can't grant). Prevents privilege escalation in the UI.
  disabled?: boolean;
}

@Component({
  selector: 'app-multi-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectComponent), multi: true },
  ],
  template: `
    <div class="ms">
      @for (opt of options(); track opt.value) {
        <label
          class="opt"
          [class.sel]="isSelected(opt.value)"
          [class.opt--locked]="opt.disabled"
          [attr.title]="opt.disabled ? lockedTitle() : null"
        >
          <input
            type="checkbox"
            class="sr-only"
            [checked]="isSelected(opt.value)"
            [disabled]="disabled() || !!opt.disabled"
            (change)="toggle(opt.value)"
          />
          <span class="box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span class="otx">
            <b>{{ opt.label }}</b>
            @if (opt.sublabel) {
              <small>{{ opt.sublabel }}</small>
            }
          </span>
          @if (opt.disabled) {
            <span class="opt__lock">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
          }
        </label>
      }
    </div>
  `,
})
export class MultiSelectComponent implements ControlValueAccessor {
  readonly options = input.required<MultiOption[]>();
  // Tooltip shown when hovering a locked option.
  readonly lockedTitle = input('');

  protected readonly disabled = signal(false);
  private readonly selected = signal<string[]>([]);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  isSelected(value: string): boolean {
    return this.selected().includes(value);
  }

  toggle(value: string): void {
    const option = this.options().find((opt) => opt.value === value);
    if (this.disabled() || option?.disabled) return;

    const next = this.isSelected(value)
      ? this.selected().filter((v) => v !== value)
      : [...this.selected(), value];
    this.selected.set(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(value: string[] | null): void {
    this.selected.set(value ?? []);
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
