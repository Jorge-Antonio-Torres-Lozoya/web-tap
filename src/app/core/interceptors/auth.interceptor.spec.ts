import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { environment } from '@env/environment';

const API = `${environment.apiBaseUrl}/products`;

describe('authInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => mock.verify());

  it('sets Accept and omits Authorization on API requests without a token', () => {
    http.get(API).subscribe();
    const req = mock.expectOne(API);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('adds a Bearer header on API requests when a token exists', () => {
    localStorage.setItem('tap.token', 'abc');
    http.get(API).subscribe();
    const req = mock.expectOne(API);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });

  it('never attaches the token to non-API requests', () => {
    localStorage.setItem('tap.token', 'abc');
    http.get('https://fonts.example.com/x').subscribe();
    const req = mock.expectOne('https://fonts.example.com/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
