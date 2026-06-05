import { describe, it, expect } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';

function setup(login: () => Observable<unknown>): LoginComponent {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AuthService, useValue: { login } }],
  });
  const fixture = TestBed.createComponent(LoginComponent);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('LoginComponent', () => {
  it('does not call login when the form is invalid', () => {
    let called = false;
    const component = setup(() => {
      called = true;
      return of(undefined);
    });
    component.submit();
    expect(called).toBe(false);
  });

  it('shows a form-level error on invalid credentials (not under a field)', () => {
    const component = setup(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 422,
            error: { message: 'Las credenciales proporcionadas son incorrectas.', errors: { username: ['x'] } },
          }),
      ),
    );
    component.form.setValue({ username: 'admin@tapterminal.com', password: 'secret' });
    component.submit();
    expect(component.formError()).toBe('Las credenciales proporcionadas son incorrectas.');
  });
});
