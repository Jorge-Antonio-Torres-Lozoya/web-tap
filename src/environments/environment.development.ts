// Development environment (ng serve). Backend allows CORS from http://localhost:4200.
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',
} as const;
