import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Adds Accept + Bearer. Content-Type is left to HttpClient (multipart needs the boundary).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;
  const setHeaders: Record<string, string> = { Accept: 'application/json' };
  if (token) setHeaders['Authorization'] = `Bearer ${token}`;
  return next(req.clone({ setHeaders }));
};
