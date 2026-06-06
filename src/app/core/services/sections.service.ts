import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Section } from '../models';

@Injectable({ providedIn: 'root' })
export class SectionsService {
  private readonly api = inject(ApiService);

  // Static catalog: cache the result after the first successful load.
  private readonly cache = signal<Section[] | null>(null);

  list(): Observable<Section[]> {
    const cached = this.cache();
    if (cached) return of(cached);
    return this.api.get<Section[]>('/sections').pipe(tap((sections) => this.cache.set(sections)));
  }
}
