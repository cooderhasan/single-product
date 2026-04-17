import { MetadataRoute } from 'next';
import { productsApi, blogApi } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360sehpa.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar
  const staticPages = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kargo-takip`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/giris`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sepet`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Ürün sayfaları
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const response = await productsApi.getAll();
    const products = response.data?.products || response.data || [];
    
    productPages = products.map((product: any) => ({
      url: `${BASE_URL}/urun/${product.slug}`,
      lastModified: new Date(product.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap - Ürünler çekilemedi:', error);
    // Demo ürün için fallback
    productPages = [
      {
        url: `${BASE_URL}/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  }

  // Blog yazıları
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const response = await blogApi.getAll();
    const posts = response.data || [];
    
    blogPages = posts.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap - Blog yazıları çekilemedi:', error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
