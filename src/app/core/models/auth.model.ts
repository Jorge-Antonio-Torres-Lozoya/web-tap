import { SectionSlug } from './section.model';

export interface AuthUser {
  id: string;
  code: string;
  name: string;
  username: string;
  sections: SectionSlug[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}
