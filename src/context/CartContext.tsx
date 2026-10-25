import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  count: number;
  totalPrice: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = '@dg_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(CART_KEY)
      .then(str => { if (str) setItems(JSON.parse(str)); })
      .catch(() => {});
  }, []);

  // Persist cart on every change
  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const addItem = (product: Product, qty: number = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].quantity + qty;
        const maxQty = typeof product.stock === 'number' ? product.stock : 99;
        updated[idx] = { ...updated[idx], quantity: Math.min(newQty, maxQty) };
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity: qty } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + parseFloat(String(i.product.price)) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ items, count, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
