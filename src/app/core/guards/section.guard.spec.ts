import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, UrlTree } from '@angular/router';
import { sectionGuard } from './section.guard';
import { AuthService } from '../services/auth.service';
import { SectionSlug } from '../models';

function run(granted: SectionSlug[], required: SectionSlug): boolean | UrlTree {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AuthService, useValue: { hasSection: (s: SectionSlug) => granted.includes(s) } },
    ],
  });
  const route = { data: { section: required } } as unknown as ActivatedRouteSnapshot;
  return TestBed.runInInjectionContext(() => sectionGuard(route, {} as never)) as boolean | UrlTree;
}

describe('sectionGuard', () => {
  it('allows access when the section is granted', () => {
    expect(run(['products', 'users'], 'users')).toBe(true);
  });

  it('redirects to /unauthorized when not granted', () => {
    const result = run(['products'], 'profiles');
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/unauthorized');
  });
});
