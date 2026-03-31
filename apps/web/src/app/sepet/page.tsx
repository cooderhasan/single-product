'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

export default function CartPage() {
  const router = useRouter();
  const { items, total, count, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 mb-8">Sepetinizde ürün bulunmuyor. Ürünleri keşfedin!</p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Alışveriş Sepeti ({count} ürün)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                {/* Product Image */}
                <Link href={`/urun/${item.product.slug}`} className="w-24 h-24 flex-shrink-0">
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/urun/${item.product.slug}`}
                    className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.category?.name}
                  </p>
                  <div className="text-primary-600 font-bold mt-2">
                    {Number(item.product.price).toLocaleString('tr-TR')} ₺
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Kaldır"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 border-x min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Alışverişe Devam Et
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{total.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span className="text-primary-600">{total.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              <button
                onClick={() => router.push(isAuthenticated ? '/odeme' : '/giris')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticated ? 'Ödemeye Geç' : 'Giriş Yap ve Devam Et'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                1000 TL üzeri alışverişlerde kargo ücretsizdir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
