import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Paginated } from './api.service';
import { Profile, ProfilePayload } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private readonly api = inject(ApiService);

  list(page: number): Observable<Paginated<Profile>> {
    return this.api.getPaginated<Profile>('/profiles', { page });
  }

  get(id: string): Observable<Profile> {
    return this.api.get<Profile>(`/profiles/${id}`);
  }

  create(payload: ProfilePayload): Observable<Profile> {
    return this.api.post<Profile>('/profiles', payload);
  }

  update(id: string, payload: Partial<ProfilePayload>): Observable<Profile> {
    return this.api.put<Profile>(`/profiles/${id}`, payload);
  }

  remove(id: string): Observable<unknown> {
    return this.api.delete<unknown>(`/profiles/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.api.download('/profiles/export/pdf');
  }

  exportExcel(): Observable<Blob> {
    return this.api.download('/profiles/export/excel');
  }
}
