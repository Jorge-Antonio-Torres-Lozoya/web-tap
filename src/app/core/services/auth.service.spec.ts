import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthUser } from '../models';
import { environment } from '@env/environment';

const USER: AuthUser = {
  id: '1',
  code: 'USR-0001',
  name: 'Admin',
  username: 'a@b.com',
  sections: ['products', 'users'],
};

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('persists token + user and exposes session signals on login', () => {
    auth.login({ username: 'a@b.com', password: 'x' }).subscribe();
    http
      .expectOne(`${environment.apiBaseUrl}/auth/login`)
      .flush({ success: true, data: { token: 'tok', user: USER }, message: null });

    expect(auth.token).toBe('tok');
    expect(auth.currentUser()).toEqual(USER);
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.sections()).toEqual(['products', 'users']);
    expect(auth.hasSection('users')).toBe(true);
    expect(auth.hasSection('profiles')).toBe(false);
  });

  it('clearSession wipes token + user', () => {
    localStorage.setItem('tap.token', 't');
    auth.clearSession();
    expect(auth.token).toBeNull();
    expect(auth.isAuthenticated()).toBe(false);
  });
});
