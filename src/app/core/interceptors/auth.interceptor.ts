import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '@env/environment';

// Attaches Accept + Bearer ONLY to our API, so the token never leaks to third
// parties. Content-Type is left to HttpClient (multipart needs the boundary).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl)) return next(req);

  const token = inject(AuthService).token;
  const setHeaders: Record<string, string> = { Accept: 'application/json' };
  if (token) setHeaders['Authorization'] = `Bearer ${token}`;
  return next(req.clone({ setHeaders }));
};
