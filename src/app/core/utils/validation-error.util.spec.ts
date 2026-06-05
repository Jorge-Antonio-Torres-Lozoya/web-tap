import { describe, it, expect } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { parseValidationError } from './validation-error.util';

describe('parseValidationError', () => {
  it('returns null for non-422 errors', () => {
    expect(parseValidationError(new HttpErrorResponse({ status: 500 }))).toBeNull();
  });

  it('extracts the message and per-field errors from a 422 body', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: { message: 'Datos no válidos.', errors: { name: ['requerido'], price: ['máximo 999'] } },
    });
    const failure = parseValidationError(error);
    expect(failure?.message).toBe('Datos no válidos.');
    expect(failure?.fields['name']).toEqual(['requerido']);
    expect(failure?.fields['price']).toEqual(['máximo 999']);
  });

  it('returns empty fields for a malformed body', () => {
    const error = new HttpErrorResponse({ status: 422, error: 'oops' });
    expect(parseValidationError(error)?.fields).toEqual({});
  });
});
