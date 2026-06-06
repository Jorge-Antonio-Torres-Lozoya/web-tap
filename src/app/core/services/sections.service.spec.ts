import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SectionsService } from './sections.service';
import { environment } from '@env/environment';

describe('SectionsService', () => {
  let service: SectionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SectionsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('unwraps the sections catalog', () => {
    service.list().subscribe((sections) => {
      expect(sections.length).toBe(2);
      expect(sections[0].slug).toBe('products');
    });
    http.expectOne(`${environment.apiBaseUrl}/sections`).flush({
      success: true,
      data: [
        { id: '1', code: 'SEC-0001', name: 'Productos', slug: 'products' },
        { id: '2', code: 'SEC-0002', name: 'Usuarios', slug: 'users' },
      ],
      message: null,
    });
  });
});
