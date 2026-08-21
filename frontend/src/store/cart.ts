import { create } from 'zustand';
import api from '../services/api';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: any;
}

interface CartState {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart');
      if (data && data.items) {
        set({ items: data.items });
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  },
  addToCart: async (productId, quantity) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      if (data && data.items) {
        set({ items: data.items });
      }
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  },
  updateQuantity: async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      if (data && data.items) {
        set({ items: data.items });
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  },
  removeFromCart: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      if (data && data.items) {
        set({ items: data.items });
      }
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  },
  clearCart: () => set({ items: [] })
}));

export default useCartStore;
