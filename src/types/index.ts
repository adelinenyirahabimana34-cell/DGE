// TypeScript types for D&G E-Commerce

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'seller';
  phone?: string;
  address?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: number;
  seller_id?: number;
  category_id?: number;
  title: string;
  description?: string;
  price: number | string;
  stock: number;
  image_url?: string;
  category_name?: string;
  seller_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id?: number;
  product_title: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  price_at_order?: number | string;
  subtotal?: number | string;
  image_url?: string;
}

export interface Order {
  id: number;
  client_id: number;
  client_name?: string;
  client_email?: string;
  total_amount: number | string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  delivery_address: string;
  phone_number: string;
  notes?: string;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface SellerSummary {
  total_orders: number;
  total_revenue: number | string;
  pending_count: number;
  confirmed_count: number;
  shipped_count: number;
  delivered_count: number;
  cancelled_count: number;
  total_products: number;
  total_stock: number;
  recent_orders: Array<{
    id: number;
    total_amount: number | string;
    status: string;
    created_at: string;
    client_name: string;
  }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
