import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';
import { cartApi } from '@/lib/api';

interface CartState extends Cart {
  sessionId: string;
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (coupon: any) => void;
  removeCoupon: () => void;
}

const generateSessionId = () => {
  return 'sess_' + Math.random().toString(36).substring(2, 15);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      count: 0,
      sessionId: '',
      isLoading: false,
      error: null,

      fetchCart: async () => {
        const state = get();
        let sessionId = state.sessionId;

        if (!sessionId && typeof window !== 'undefined') {
          sessionId = generateSessionId();
          set({ sessionId });
        }

        try {
          set({ isLoading: true, error: null });
          const { data } = await cartApi.get(sessionId);
          set({
            items: data.items || [],
            total: data.total || 0,
            count: data.count || 0,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Sepet yüklenemedi';
          set({ isLoading: false, error: errorMessage });
          // Sepet boşsa bile varsayılan değerleri ayarla
          set({
            items: [],
            total: 0,
            count: 0,
          });
        }
      },

      addItem: async (productId, quantity, variantId) => {
        let { sessionId } = get();
        
        // Session ID yoksa oluştur
        if (!sessionId && typeof window !== 'undefined') {
          sessionId = generateSessionId();
          set({ sessionId });
        }
        
        try {
          set({ isLoading: true, error: null });
          await cartApi.add({ productId, quantity, variantId }, sessionId);
          await get().fetchCart();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ürün eklenemedi';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      updateItem: async (itemId, quantity) => {
        try {
          set({ isLoading: true });
          await cartApi.update(itemId, { quantity });
          await get().fetchCart();
        } catch (error) {
          set({ isLoading: false, error: 'Miktar güncellenemedi' });
        }
      },

      removeItem: async (itemId) => {
        try {
          set({ isLoading: true });
          await cartApi.remove(itemId);
          await get().fetchCart();
        } catch (error) {
          set({ isLoading: false, error: 'Ürün kaldırılamadı' });
        }
      },

      clearCart: async () => {
        const { sessionId } = get();
        try {
          await cartApi.clear(sessionId);
          set({ items: [], total: 0, count: 0 });
        } catch (error) {
          set({ error: 'Sepet temizlenemedi' });
        }
      },

      applyCoupon: (coupon) => {
        set((state) => ({
          ...state,
          coupon,
          discount: coupon.discount,
        }));
      },

      removeCoupon: () => {
        set((state) => ({
          ...state,
          coupon: null,
          discount: 0,
        }));
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);
