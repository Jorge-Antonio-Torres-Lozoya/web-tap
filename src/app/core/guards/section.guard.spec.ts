import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { sectionGuard } from './section.guard';
import { AuthService } from '../services/auth.service';
import { SectionSlug } from '../models';

@Component({ template: '' })
class BlankComponent {}

async function urlAfterVisiting(granted: SectionSlug[], section: SectionSlug): Promise<string> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'unauthorized', component: BlankComponent },
        { path: 'p', component: BlankComponent, canActivate: [sectionGuard], data: { section } },
      ]),
      { provide: AuthService, useValue: { hasSection: (s: SectionSlug) => granted.includes(s) } },
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl('/p');
  return TestBed.inject(Router).url;
}

describe('sectionGuard', () => {
  it('allows access when the section is granted', async () => {
    expect(await urlAfterVisiting(['products', 'users'], 'users')).toBe('/p');
  });

  it('redirects to /unauthorized when not granted', async () => {
    expect(await urlAfterVisiting(['products'], 'profiles')).toBe('/unauthorized');
  });
});
