// Uniform API envelopes

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export const FIRST_PAGE = 1;

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message: string | null;
}

// Laravel 422 payload: no `success`, field -> messages.
export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}