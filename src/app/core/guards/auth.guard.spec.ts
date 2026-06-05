import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({ template: '' })
class BlankComponent {}

async function urlAfterVisitingHome(authenticated: boolean): Promise<string> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'login', component: BlankComponent },
        { path: 'home', component: BlankComponent, canActivate: [authGuard] },
      ]),
      { provide: AuthService, useValue: { isAuthenticated: () => authenticated } },
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl('/home');
  return TestBed.inject(Router).url;
}

describe('authGuard', () => {
  it('allows navigation when authenticated', async () => {
    expect(await urlAfterVisitingHome(true)).toBe('/home');
  });

  it('redirects to /login when not authenticated', async () => {
    expect(await urlAfterVisitingHome(false)).toBe('/login');
  });
});
