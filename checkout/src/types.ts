export interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
