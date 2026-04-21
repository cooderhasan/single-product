'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ChevronLeft,
  UserCheck
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { getImageUrl } from '@/lib/utils';

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
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Sepetiniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Şu An Boş</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Sepetinizde henüz ürün bulunmuyor. Harika fırsatları kaçırmamak için hemen alışverişe başlayın!
            </p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-primary-600/20"
            >
              Ürünleri Keşfet
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const shippingThreshold = 1000;
  const isFreeShipping = total >= shippingThreshold;
  const shippingProgress = Math.min((total / shippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Alışveriş Sepeti 
            <span className="ml-3 text-lg font-medium text-slate-400">({count} Ürün)</span>
          </h1>
          <Link
            href="/urunler"
            className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Alışverişe Devam Et
          </Link>
        </motion.div>

        {/* Free Shipping Progress */}
        {!isFreeShipping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 mb-8 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Ücretsiz kargo için <span className="font-bold">{(shippingThreshold - total).toLocaleString('tr-TR')} ₺</span> daha ekleyin!
              </p>
              <span className="text-xs font-bold text-blue-600">%{Math.round(shippingProgress)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                    {/* Image Area */}
                    <Link 
                      href={`/urun/${item.product.slug}`} 
                      className="w-full sm:w-32 h-32 flex-shrink-0 relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:border-primary-100 transition-colors"
                    >
                      <img
                        src={item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.png';
                        }}
                      />
                    </Link>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <Link
                            href={`/urun/${item.product.slug}`}
                            className="font-bold text-lg text-slate-800 hover:text-primary-600 transition-colors line-clamp-2 leading-tight pr-4"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                            aria-label="Ürünü Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {item.product.category?.name || 'Motosiklet Ekipmanları'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                          <button
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-primary-600 transition-all text-slate-500 disabled:opacity-30"
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-primary-600 transition-all text-slate-500 disabled:opacity-30"
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price Area */}
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-medium mb-0.5">Birim Fiyat: {Number(item.product.price).toLocaleString('tr-TR')} ₺</p>
                          <p className="text-2xl font-black text-primary-600">
                            {(Number(item.product.price) * item.quantity).toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:bg-primary-50 transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div 
              layout
              className="pt-6 sm:hidden"
            >
              <Link
                href="/urunler"
                className="flex items-center justify-center gap-2 text-slate-500 font-bold py-4 border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary-200 hover:text-primary-600 transition-all"
              >
                + Alışverişe Devam Et
              </Link>
            </motion.div>
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-[32px] p-8 shadow-2xl sticky top-24 text-white overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-20 blur-3xl -mr-10 -mt-10" />
              
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary-500" />
                Sipariş Özeti
              </h2>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Ara Toplam</span>
                  <span className="text-white">{total.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium pb-6 border-b border-slate-800">
                  <span>Kargo</span>
                  {isFreeShipping ? (
                    <span className="text-green-400 font-bold">Ücretsiz</span>
                  ) : (
                    <span className="text-white">75,00 ₺</span>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-lg font-bold text-slate-400">Genel Toplam</span>
                    <div className="text-right">
                      <p className="text-3xl font-black text-white tracking-tight">
                        {(total + (isFreeShipping ? 0 : 75)).toLocaleString('tr-TR')} ₺
                      </p>
                      <p className="text-xs text-primary-400 font-medium">KDV Dahil</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          router.push('/odeme');
                        } else {
                          router.push('/giris?redirect=/odeme');
                        }
                      }}
                      className="w-full bg-white hover:bg-primary-50 text-slate-900 font-black py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl active:scale-95"
                    >
                      ÖDEMEYE GEÇ
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    {!isAuthenticated && (
                      <button
                        onClick={() => router.push('/odeme?method=guest')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-95"
                      >
                        <UserCheck className="w-5 h-5" />
                        MİSAFİR OLARAK DEVAM ET
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust badges footer */}
              <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                  <div className="h-5 w-14 flex items-center justify-center">
                    <img src="/images/payment/iyzico.svg" alt="iyzico" className="h-full w-full object-contain invert" />
                  </div>
                  <div className="w-[1px] h-4 bg-slate-700" />
                  <div className="h-5 w-8 flex items-center justify-center">
                    <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-5 w-14 flex items-center justify-center">
                    <img src="/images/payment/visa.svg" alt="Visa" className="h-full w-full object-contain" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                  Güvenli ödeme altyapısı ile kart bilgileriniz 256-bit SSL sertifikası ile korunmaktadır.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
