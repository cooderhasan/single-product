export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  category: Category;
  variants?: ProductVariant[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  viewCount: number;
  salesCount: number;
  rating?: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  children?: Category[];
  parent?: Category;
}

export interface CartItem {
  id: string;
  product: Product;
  variantId?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood?: string;
  address: string;
  zipCode?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  customerNote?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  variantName?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: Category;
  authorName: string;
  publishedAt: string;
  viewCount: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
}

export interface Coupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  discount: number;
}
