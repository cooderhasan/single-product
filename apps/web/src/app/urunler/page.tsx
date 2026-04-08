'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { productsApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number | null;
  images: { url: string; isMain?: boolean }[];
  category?: { name: string };
  rating?: number;
  reviewCount?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getAll();
      const data = res.data?.products || res.data || [];
      
       if (data.length === 0) {
        // Demo ürünler - görseller ProductCard'ta API URL ile birleştirilir veya placeholder gösterilir
        setProducts([
          {
            id: '1',
            slug: 'hidrolik-motosiklet-sehpasi-pro',
            name: 'Hidrolik Motosiklet Sehpası Pro',
            description: 'Profesyonel hidrolik pompalı motosiklet kaldırma sehpası. 600kg taşıma kapasitesi.',
            price: 8999,
            comparePrice: 10999,
            images: [],
            category: { name: 'Hidrolik Sehpalar' },
            rating: 4.9,
            reviewCount: 156,
          },
          {
            id: '2',
            slug: 'manuel-motosiklet-sehpasi-ekonomik',
            name: 'Manuel Motosiklet Sehpası Ekonomik',
            description: 'Ekonomik manuel kaldırma sehpası. 400kg taşıma kapasitesi.',
            price: 5499,
            comparePrice: 6999,
            images: [],
            category: { name: 'Manuel Sehpalar' },
            rating: 4.6,
            reviewCount: 89,
          },
          {
            id: '3',
            slug: 'hidrolik-sehpa-super-pro',
            name: 'Hidrolik Sehpa Super Pro',
            description: 'Tam donanımlı profesyonel model. 800kg kapasite.',
            price: 12499,
            comparePrice: 14999,
            images: [],
            category: { name: 'Hidrolik Sehpalar' },
            rating: 5.0,
            reviewCount: 203,
          },
          {
            id: '4',
            slug: 'motosiklet-sehpasi-aksesuar-seti',
            name: 'Motosiklet Sehpası Aksesuar Seti',
            description: 'Sehpa için genişletme aparatları ve koruma pedleri.',
            price: 899,
            comparePrice: 1299,
            images: [],
            category: { name: 'Aksesuarlar' },
            rating: 4.7,
            reviewCount: 45,
          },
        ]);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.log('API hatası - demo modu');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tüm Ürünler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Profesyonel motosiklet kaldırma sehpaları, hidrolik ve manuel modeller.
            2 yıl garanti, ücretsiz kargo.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
