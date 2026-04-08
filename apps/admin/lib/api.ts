const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/v1/products`)
  if (!response.ok) throw new Error('Ürünler yüklenirken hata oluştu')
  return response.json()
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`)
  if (!response.ok) throw new Error('Ürün yüklenirken hata oluştu')
  return response.json()
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await fetch(`${API_URL}/api/v1/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Ürün oluşturulurken hata oluştu')
  return response.json()
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Ürün güncellenirken hata oluştu')
  return response.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Ürün silinirken hata oluştu')
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/v1/categories`)
  if (!response.ok) throw new Error('Kategoriler yüklenirken hata oluştu')
  return response.json()
}

import { Product, ProductFormData, Category } from '@/types/product'
