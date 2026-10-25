import api from './api';
import { Order, SellerSummary } from '../types';

interface OrdersResponse {
  orders: Order[];
}

interface OrderResponse {
  order: Order;
}

interface CreateOrderData {
  items: Array<{ product_id: number; quantity: number }>;
  delivery_address: string;
  phone_number: string;
  notes?: string;
}

export const orderService = {
  create: async (data: CreateOrderData): Promise<Order> => {
    const res = await api.post<OrderResponse>('/orders', data);
    return res.data.order;
  },

  getAll: async (): Promise<Order[]> => {
    const res = await api.get<OrdersResponse>('/orders');
    return res.data.orders;
  },

  getById: async (id: number): Promise<Order> => {
    const res = await api.get<OrderResponse>(`/orders/${id}`);
    return res.data.order;
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const res = await api.put<OrderResponse>(`/orders/${id}/status`, { status });
    return res.data.order;
  },

  getSellerSummary: async (): Promise<SellerSummary> => {
    const res = await api.get<{ summary: SellerSummary }>('/seller/summary');
    return res.data.summary;
  },
};
