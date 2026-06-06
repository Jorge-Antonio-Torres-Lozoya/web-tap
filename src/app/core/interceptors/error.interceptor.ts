import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';

// Opt a request out of the global 403 -> /unauthorized redirect, so the caller
// can handle the forbidden response locally (e.g. a secondary data fetch).
export const SKIP_FORBIDDEN_REDIRECT = new HttpContextToken<boolean>(() => false);

// 401 -> session ended (expiry / single-session) → notify + login.
// 403 -> unauthorized. 422 is rethrown so forms can map field errors.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (auth.isAuthenticated()) {
          toast.error('Tu sesión finalizó (expiró o se inició en otro dispositivo). Inicia sesión de nuevo.');
        }
        auth.clearSession();
        router.navigate(['/login']);
      } else if (error.status === 403 && !req.context.get(SKIP_FORBIDDEN_REDIRECT)) {
        router.navigate(['/unauthorized']);
      }
      return throwError(() => error);
    }),
  );
};
