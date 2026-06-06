import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Paginated } from './api.service';
import { UserDetail, UserListItem } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  list(page: number, search = ''): Observable<Paginated<UserListItem>> {
    return this.api.getPaginated<UserListItem>('/users', { page, search: search.trim() || undefined });
  }

  get(id: string): Observable<UserDetail> {
    return this.api.get<UserDetail>(`/users/${id}`);
  }

  // Multipart (photo). FormData is built by the form (see user-form-data.util).
  create(form: FormData): Observable<UserDetail> {
    return this.api.postForm<UserDetail>('/users', form);
  }

  // Update is a POST with `_method=PUT` in the FormData (PHP multipart limitation).
  update(id: string, form: FormData): Observable<UserDetail> {
    return this.api.postForm<UserDetail>(`/users/${id}`, form);
  }

  remove(id: string): Observable<unknown> {
    return this.api.delete<unknown>(`/users/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.api.download('/users/export/pdf');
  }

  exportExcel(): Observable<Blob> {
    return this.api.download('/users/export/excel');
  }
}
