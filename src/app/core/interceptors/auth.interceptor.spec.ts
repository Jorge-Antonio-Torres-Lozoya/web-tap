import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => mock.verify());

  it('always sets Accept and omits Authorization without a token', () => {
    http.get('/x').subscribe();
    const req = mock.expectOne('/x');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('adds a Bearer header when a token exists', () => {
    localStorage.setItem('tap.token', 'abc');
    http.get('/x').subscribe();
    const req = mock.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });
});
