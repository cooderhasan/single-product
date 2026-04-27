import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productsApi } from '@/lib/api';
import ProductClient from './ProductClient';

// Removed hardcoded staticProducts - products are now fetched from database

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data: product } = await productsApi.getBySlug(params.slug);
    
    return {
      title: `${product.name} | 360 Sehpa`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Ürün Bulunamadı',
    };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product;
  
  // API'den ürünü al
  try {
    const response = await productsApi.getBySlug(params.slug);
    product = response.data;
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Transform API product data for the client component
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  
  // Debug: Log images from API
  console.log('Product images from API:', JSON.stringify(product.images));
  
  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => {
        // API'den gelen image verisi string veya { url: string } formatında olabilir
        let url = '';
        if (typeof img === 'string') {
          url = img;
        } else if (img && typeof img === 'object') {
          url = img.url || img.path || img.src || '';
        }
        
        let fullUrl = '';
        if (url) {
          if (url.startsWith('http')) {
            fullUrl = url;
          } else if (url.startsWith('//')) {
            fullUrl = `https:${url}`;
          } else {
            fullUrl = `${apiBase}${url.startsWith('/') ? url : `/${url}`}`;
          }
        }
        
        console.log(`Image URL: "${url}" -> Full: "${fullUrl}"`);
        return { 
          url: fullUrl,
          alt: typeof img === 'string' ? product.name : (img?.alt || img?.title || product.name)
        };
      }).filter((img: any) => img.url) // Boş URL'leri filtrele
    : [{ url: '', alt: product.name }];
  
  console.log('Final images for ProductClient:', JSON.stringify(images));
  
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    images,
    category: product.category?.name || 'Ürün',
    rating: product.rating || 4.5,
    reviewCount: product.reviewCount || 0,
    features: product.description ? product.description.split('.').filter((s: string) => s.trim()).slice(0, 6) : [
      'Profesyonel kalite',
      'Dayanıklı malzeme',
      'Hızlı teslimat',
    ],
    specifications: [
      { label: 'SKU', value: product.sku || '-' },
      { label: 'Stok', value: product.stock > 0 ? 'Stokta var' : 'Stokta yok' },
      { label: 'Kategori', value: product.category?.name || '-' },
    ],
  };

  return <ProductClient product={productData} />;
}
