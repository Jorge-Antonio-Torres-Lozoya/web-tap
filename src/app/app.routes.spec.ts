import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { rootRedirect } from './app.routes';
import { AuthService } from '@core/services/auth.service';
import { SectionSlug } from '@core/models';

interface AuthStub {
  isAuthenticated: () => boolean;
  sections: () => SectionSlug[];
}

function resolve(stub: AuthStub): string {
  TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: stub }] });
  return TestBed.runInInjectionContext(() => rootRedirect());
}

describe('rootRedirect', () => {
  it('redirects to /login when there is no session', () => {
    expect(resolve({ isAuthenticated: () => false, sections: () => [] })).toBe('/login');
  });

  it('redirects to the first allowed section when authenticated', () => {
    const sections: SectionSlug[] = ['users', 'profiles'];
    expect(resolve({ isAuthenticated: () => true, sections: () => sections })).toBe('/users');
  });

  it('redirects to /unauthorized when authenticated without sections', () => {
    expect(resolve({ isAuthenticated: () => true, sections: () => [] })).toBe('/unauthorized');
  });
});
