import { HttpErrorResponse } from '@angular/common/http';

export interface ValidationFailure {
  message: string;
  fields: Record<string, string[]>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Parses a Laravel 422 response into a general message + per-field messages.
// Returns null for non-422 errors so callers can fall back to a generic message.
export function parseValidationError(error: HttpErrorResponse): ValidationFailure | null {
  if (error.status !== 422) return null;

  const body: unknown = error.error;
  if (!isRecord(body)) return { message: 'Datos no válidos.', fields: {} };

  const rawMessage = body['message'];
  const message = typeof rawMessage === 'string' ? rawMessage : 'Datos no válidos.';

  const fields: Record<string, string[]> = {};
  const rawErrors = body['errors'];
  if (isRecord(rawErrors)) {
    for (const key of Object.keys(rawErrors)) {
      const messages = rawErrors[key];
      if (Array.isArray(messages)) {
        fields[key] = messages.filter((item): item is string => typeof item === 'string');
      }
    }
  }

  return { message, fields };
}
