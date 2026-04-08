export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  category?: Category
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
  options: VariantOption[]
}

export interface VariantOption {
  name: string
  value: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
}

export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  categoryId: string
}
