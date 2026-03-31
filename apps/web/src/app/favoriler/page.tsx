'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, router]);

  const fetchFavorites = async () => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik demo veri
      setFavorites([
        {
          id: '1',
          slug: 'hidrolik-motosiklet-sehpasi-pro',
          sku: 'HYD-PRO-001',
          name: 'Hidrolik Motosiklet Sehpası Pro',
          description: 'Profesyonel hidrolik pompalı motosiklet kaldırma sehpası.',
          price: 8999,
          comparePrice: 10999,
          stock: 50,
          stockStatus: 'IN_STOCK',
          isActive: true,
          isFeatured: true,
          images: [],
          category: { id: '1', slug: 'hidrolik-sehpalar', name: 'Hidrolik Sehpalar' },
          viewCount: 0,
          salesCount: 0,
          reviewCount: 156,
          createdAt: '',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      // API entegrasyonu burada yapılacak
      setFavorites(favorites.filter(f => f.id !== productId));
      toast.success('Favorilerden kaldırıldı');
    } catch {
      toast.error('Bir hata oluştu');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1);
      toast.success('Sepete eklendi');
    } catch {
      toast.error('Ürün eklenirken bir hata oluştu');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
          <p className="text-gray-600">Beğendiğiniz ürünleri görüntüleyin</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Favoriler yükleniyor...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz Favori Ürününüz Yok</h2>
            <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyin!</p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5" />
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                {/* Image */}
                <Link href={`/urun/${product.slug}`} className="block relative aspect-square bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  </div>
                  
                  {/* Discount Badge */}
                  {product.comparePrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      %{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)} İndirim
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <div className="text-xs text-primary-600 font-medium mb-1">
                    {product.category.name}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/urun/${product.slug}`} className="hover:text-primary-600 transition-colors">
                      {product.name}
                    </Link>
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary-600">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.comparePrice.toLocaleString('tr-TR')} ₺
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
