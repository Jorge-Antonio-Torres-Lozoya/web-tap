import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../models';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

// Central HttpClient wrapper. Unwraps the `data` envelope; the auth/error
// interceptors handle headers and 401/403/422.
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.url(path), { params: this.params(params) })
      .pipe(map((res) => res.data));
  }

  getPaginated<T>(path: string, params?: QueryParams): Observable<Paginated<T>> {
    return this.http
      .get<PaginatedResponse<T>>(this.url(path), { params: this.params(params) })
      .pipe(map((res) => ({ items: res.data, meta: res.meta })));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(this.url(path), body).pipe(map((res) => res.data));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(this.url(path), body).pipe(map((res) => res.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(this.url(path)).pipe(map((res) => res.data));
  }

  // Multipart. Used for user create and update (update sends _method=PUT).
  postForm<T>(path: string, form: FormData): Observable<T> {
    return this.http.post<ApiResponse<T>>(this.url(path), form).pipe(map((res) => res.data));
  }

  // Binary export (PDF/Excel).
  download(path: string, params?: QueryParams): Observable<Blob> {
    return this.http.get(this.url(path), { params: this.params(params), responseType: 'blob' });
  }

  private url(path: string): string {
    return `${this.base}${path}`;
  }

  private params(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
