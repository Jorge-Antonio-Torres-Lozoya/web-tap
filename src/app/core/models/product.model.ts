export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  price: number;
  created_at: string;
  updated_at: string;
}

// price: integer 1..999. code is server-generated (not sent).
export interface ProductPayload {
  name: string;
  brand: string;
  price: number;
}
