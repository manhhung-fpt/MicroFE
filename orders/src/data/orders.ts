export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
  phone: string;
}

export const orders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    items: [
      { productId: 1, name: 'iPhone 15 Pro', price: 25990000, quantity: 1, color: '#1a1a2e' },
      { productId: 4, name: 'AirPods Pro 2nd Gen', price: 6490000, quantity: 1, color: '#f5f5f5' },
    ],
    total: 32480000,
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '0901234567',
  },
  {
    id: 'ORD-002',
    date: '2024-02-20',
    status: 'Shipped',
    items: [
      { productId: 3, name: 'MacBook Pro M3', price: 49990000, quantity: 1, color: '#2d3748' },
    ],
    total: 49990000,
    address: '456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    phone: '0901234567',
  },
  {
    id: 'ORD-003',
    date: '2024-03-01',
    status: 'Processing',
    items: [
      { productId: 7, name: 'Nike Air Max 270', price: 2890000, quantity: 1, color: '#e74c3c' },
      { productId: 8, name: 'Adidas Ultraboost 23', price: 3490000, quantity: 1, color: '#16213e' },
    ],
    total: 6380000,
    address: '789 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
    phone: '0901234567',
  },
  {
    id: 'ORD-004',
    date: '2024-03-10',
    status: 'Pending',
    items: [
      { productId: 10, name: 'Clean Code', price: 490000, quantity: 1, color: '#27ae60' },
      { productId: 11, name: 'The Pragmatic Programmer', price: 520000, quantity: 1, color: '#8e44ad' },
    ],
    total: 1010000,
    address: '321 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
    phone: '0901234567',
  },
  {
    id: 'ORD-005',
    date: '2024-01-05',
    status: 'Cancelled',
    items: [
      { productId: 2, name: 'Samsung Galaxy S24 Ultra', price: 22490000, quantity: 1, color: '#1b4332' },
    ],
    total: 22490000,
    address: '654 Điện Biên Phủ, Quận Bình Thạnh',
    phone: '0901234567',
  },
  {
    id: 'ORD-006',
    date: '2024-03-15',
    status: 'Delivered',
    items: [
      { productId: 6, name: 'Sony WH-1000XM5', price: 8990000, quantity: 1, color: '#1a1a2e' },
      { productId: 12, name: 'Design Patterns', price: 450000, quantity: 2, color: '#d35400' },
    ],
    total: 9890000,
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '0901234567',
  },
];
