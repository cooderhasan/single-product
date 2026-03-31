import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/giris';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getRelated: (id: string, categoryId: string) =>
    api.get(`/products/${id}/related`, { params: { categoryId } }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

export const cartApi = {
  get: (sessionId?: string) => api.get('/cart', { params: { sessionId } }),
  add: (data: any, sessionId?: string) =>
    api.post('/cart/items', data, { params: { sessionId } }),
  update: (itemId: string, data: any) =>
    api.put(`/cart/items/${itemId}`, data),
  remove: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clear: (sessionId?: string) => api.delete('/cart', { params: { sessionId } }),
  merge: (sessionId: string) => api.post('/cart/merge', {}, { params: { sessionId } }),
};

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

export const paymentsApi = {
  initializePaytr: (orderNumber: string) =>
    api.post('/payments/paytr/initialize', { orderNumber }),
};

export const couponsApi = {
  validate: (code: string, orderAmount: number) =>
    api.post('/coupons/validate', { code, orderAmount }),
};

export const blogApi = {
  getAll: (params?: any) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getCategories: () => api.get('/blog/categories'),
};

export const bannersApi = {
  getAll: (position?: string) => api.get('/banners', { params: { position } }),
  getByPosition: (position: string) => api.get(`/banners/position/${position}`),
};
