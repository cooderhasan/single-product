import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getImageUrl(u: any): string {
  if (!u) return '/images/placeholder.png';
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  
  // u bir string olabilir veya { url, path, src } içeren bir obje olabilir
  let str = '';
  if (typeof u === 'string') {
    str = u;
  } else if (u && typeof u === 'object') {
    str = u.url || u.path || u.src || '';
  }
  
  if (!str) return '/images/placeholder.png';
  if (str.startsWith('http')) return str;
  if (str.startsWith('//')) return `https:${str}`;
  
  // Relative path ise API_BASE ekle
  // Bazı durumlarda path başında / olmayabilir veya /uploads/ ile başlayabilir
  if (str.startsWith('/')) return `${apiBase}${str}`;
  return `${apiBase}/uploads/${str}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateMetaTitle(title: string, siteName: string = '360 Sehpa'): string {
  return `${title} | ${siteName}`;
}

export function generateMetaDescription(description: string, maxLength: number = 160): string {
  return truncateText(description, maxLength);
}
