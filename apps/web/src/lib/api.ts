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

export const siteContentApi = {
  getAll: () => api.get('/site-content'),
  getByKey: (key: string) => api.get(`/site-content/${key}`),
  create: (data: any) => api.post('/site-content', data),
  update: (id: string, data: any) => api.put(`/site-content/${id}`, data),
  updateByKey: (key: string, data: any) => api.put(`/site-content/by-key/${key}`, data),
  delete: (id: string) => api.delete(`/site-content/${id}`),
};

export const testimonialsApi = {
  getAll: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/admin/all'),
  getById: (id: string) => api.get(`/testimonials/${id}`),
  create: (data: any) => api.post('/testimonials', data),
  update: (id: string, data: any) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const announcementsApi = {
  getAll: (params?: any) => api.get('/announcements', { params }),
  getAllAdmin: () => api.get('/announcements/admin/all'),
  getByPosition: (position: string) => api.get(`/announcements/position/${position}`),
  create: (data: any) => api.post('/announcements', data),
  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

export const contactApi = {
  send: (data: any) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  updateStatus: (id: string, status: string) => api.put(`/contact/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/contact/${id}`),
};
