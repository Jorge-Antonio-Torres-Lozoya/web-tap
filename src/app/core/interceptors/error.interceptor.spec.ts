import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;
  let router: Router;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => mock.verify());

  it('clears session and routes to /login on 401', () => {
    const clear = vi.spyOn(auth, 'clearSession');
    http.get('/x').subscribe({ error: () => {} });
    mock.expectOne('/x').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(clear).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('routes to /unauthorized on 403', () => {
    http.get('/x').subscribe({ error: () => {} });
    mock.expectOne('/x').flush({}, { status: 403, statusText: 'Forbidden' });
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('rethrows 422 without navigating', () => {
    let status = 0;
    http.get('/x').subscribe({ error: (e) => (status = e.status) });
    mock.expectOne('/x').flush({}, { status: 422, statusText: 'Unprocessable' });
    expect(status).toBe(422);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
