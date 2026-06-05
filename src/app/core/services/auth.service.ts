import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthUser, LoginCredentials, LoginResponse, ResetPasswordPayload, SectionSlug } from '../models';

const TOKEN_KEY = 'tap.token';
const USER_KEY = 'tap.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _user = signal<AuthUser | null>(this.readUser());
  readonly currentUser = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly sections = computed<SectionSlug[]>(() => this._user()?.sections ?? []);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasSection(slug: SectionSlug): boolean {
    return this.sections().includes(slug);
  }

  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.api.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((res) => this.persist(res.token, res.user)),
      map((res) => res.user),
    );
  }

  // User-initiated logout: revoke server-side, then clear locally.
  logout(): void {
    this.api.post('/auth/logout', {}).subscribe({ error: () => {} });
    this.clearSession();
    this.router.navigate(['/login']);
  }

  forgotPassword(username: string): Observable<unknown> {
    return this.api.post('/auth/forgot-password', { username });
  }

  resetPassword(payload: ResetPasswordPayload): Observable<unknown> {
    return this.api.post('/auth/reset-password', payload);
  }

  // Local cleanup only — called by the error interceptor on 401 to avoid recursion.
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  private persist(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const user: AuthUser = JSON.parse(raw);
      return user;
    } catch {
      return null;
    }
  }
}