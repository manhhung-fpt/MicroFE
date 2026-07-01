export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  stock: number;
  rating: number;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
