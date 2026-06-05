import { Environment } from './environment.model';

// Production environment (default). Replaced by environment.development.ts in dev builds.
export const environment: Environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8000/api/v1',
};
