import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '@env/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let http: HttpTestingController;
  const base = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists products with the page param and returns items + meta', () => {
    service.list(2).subscribe((result) => {
      expect(result.items.length).toBe(1);
      expect(result.meta.current_page).toBe(2);
    });
    const req = http.expectOne(`${base}/products?page=2`);
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      data: [{ id: '1', code: 'PRD-0001', name: 'Grúa', brand: 'CAT', price: 999, created_at: '', updated_at: '' }],
      meta: { current_page: 2, last_page: 5, per_page: 15, total: 73 },
      message: null,
    });
  });

  it('creates a product', () => {
    service.create({ name: 'Grúa', brand: 'CAT', price: 500 }).subscribe();
    const req = http.expectOne(`${base}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Grúa', brand: 'CAT', price: 500 });
    req.flush({ success: true, data: {}, message: 'ok' });
  });

  it('downloads the PDF export as a blob', () => {
    service.exportPdf().subscribe((blob) => expect(blob).toBeInstanceOf(Blob));
    const req = http.expectOne(`${base}/products/export/pdf`);
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['x']));
  });
});
