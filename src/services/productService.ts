import api from './api';
import { Product, Category } from '../types';

interface ProductsResponse {
  products: Product[];
}

interface ProductResponse {
  product: Product;
}

interface CategoriesResponse {
  categories: Category[];
}

export const productService = {
  getAll: async (params?: { search?: string; category?: string | number }): Promise<Product[]> => {
    const res = await api.get<ProductsResponse>('/products', { params });
    return res.data.products;
  },

  getById: async (id: number): Promise<Product> => {
    const res = await api.get<ProductResponse>(`/products/${id}`);
    return res.data.product;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<CategoriesResponse>('/products/categories');
    return res.data.categories;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post<ProductResponse>('/products', data);
    return res.data.product;
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    const res = await api.put<ProductResponse>(`/products/${id}`, data);
    return res.data.product;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getSellerProducts: async (sellerId: number): Promise<Product[]> => {
    const res = await api.get<ProductsResponse>('/products', { params: { seller_id: sellerId } });
    return res.data.products;
  },
};
