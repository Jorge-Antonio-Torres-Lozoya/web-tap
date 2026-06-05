import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

function run(authed: boolean): boolean | UrlTree {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AuthService, useValue: { isAuthenticated: () => authed } }],
  });
  return TestBed.runInInjectionContext(() => authGuard({} as never, {} as never)) as boolean | UrlTree;
}

describe('authGuard', () => {
  it('allows an authenticated user', () => {
    expect(run(true)).toBe(true);
  });

  it('redirects to /login otherwise', () => {
    const result = run(false);
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
