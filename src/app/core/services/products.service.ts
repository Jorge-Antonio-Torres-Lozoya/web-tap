import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Paginated } from './api.service';
import { Product, ProductPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = inject(ApiService);

  list(page: number): Observable<Paginated<Product>> {
    return this.api.getPaginated<Product>('/products', { page });
  }

  get(id: string): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.api.post<Product>('/products', payload);
  }

  update(id: string, payload: Partial<ProductPayload>): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, payload);
  }

  remove(id: string): Observable<unknown> {
    return this.api.delete<unknown>(`/products/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.api.download('/products/export/pdf');
  }

  exportExcel(): Observable<Blob> {
    return this.api.download('/products/export/excel');
  }
}
