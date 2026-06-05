import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

@Component({
  selector: 'app-image-dropzone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageDropzoneComponent), multi: true },
  ],
  template: `
    <div class="dropzone" (click)="fileInput.click()" role="button" tabindex="0" (keydown.enter)="fileInput.click()">
      @if (displayUrl()) {
        <img class="dz-preview" [src]="displayUrl()" alt="Vista previa" />
        <div><b>Cambiar imagen</b></div>
      } @else {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <div><b>Subir imagen</b> · arrastra o haz clic</div>
      }
    </div>
    <input #fileInput type="file" accept="image/*" hidden [disabled]="disabled()" (change)="onPick(fileInput.files)" />
    @if (localError()) {
      <div class="field-error"><span>{{ localError() }}</span></div>
    }
  `,
  styleUrl: './image-dropzone.component.scss',
})
export class ImageDropzoneComponent implements ControlValueAccessor {
  // Existing photo URL when editing (no new file selected yet).
  readonly previewUrl = input<string | null>(null);

  protected readonly disabled = signal(false);
  protected readonly localError = signal<string | null>(null);
  private readonly objectUrl = signal<string | null>(null);

  protected readonly displayUrl = computed(() => this.objectUrl() ?? this.previewUrl());

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    inject(DestroyRef).onDestroy(() => this.revoke());
  }

  onPick(files: FileList | null): void {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.fail('El archivo debe ser una imagen.');
      return;
    }
    if (file.size > MAX_BYTES) {
      this.fail('La imagen no debe superar 2 MB.');
      return;
    }

    this.revoke();
    this.objectUrl.set(URL.createObjectURL(file));
    this.localError.set(null);
    this.onChange(file);
    this.onTouched();
  }

  writeValue(value: File | null): void {
    if (!value) {
      this.revoke();
      this.objectUrl.set(null);
    }
  }
  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  private fail(message: string): void {
    this.localError.set(message);
    this.onChange(null);
    this.onTouched();
  }

  private revoke(): void {
    const url = this.objectUrl();
    if (url) URL.revokeObjectURL(url);
  }
}
