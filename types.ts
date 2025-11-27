
export type StoreType = 'quilling' | 'gifts' | 'art';

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  themeColor: string;
  heroImage: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  razorpayKey?: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  storeId: string;
  items: CartItem[];
  shippingAddress?: string;
  paymentMethod?: 'COD' | 'Razorpay';
  email?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  joinedDate: string;
  phone?: string;
  address?: string;
  password?: string; // In a real app, never store plain text passwords
}
