import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '@env/environment';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;
  const base = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('unwraps the data envelope on get()', () => {
    api.get<{ id: string }>('/products/1').subscribe((d) => expect(d).toEqual({ id: '1' }));
    const req = http.expectOne(`${base}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: '1' }, message: null });
  });

  it('returns items + meta on getPaginated()', () => {
    api.getPaginated<{ id: string }>('/products').subscribe((r) => {
      expect(r.items.length).toBe(1);
      expect(r.meta.total).toBe(1);
    });
    http.expectOne(`${base}/products`).flush({
      success: true,
      data: [{ id: '1' }],
      meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
      message: null,
    });
  });

  it('requests a blob on download()', () => {
    api.download('/products/export/pdf').subscribe((b) => expect(b).toBeInstanceOf(Blob));
    const req = http.expectOne(`${base}/products/export/pdf`);
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['x']));
  });
});
