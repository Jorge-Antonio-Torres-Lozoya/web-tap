import { Environment } from './environment.model';

// Development environment (ng serve). Backend allows CORS from http://localhost:4200.
export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',
};
