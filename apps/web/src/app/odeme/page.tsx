'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  MapPin, 
  Package, 
  ChevronRight, 
  Truck,
  ShieldCheck,
  Lock,
  User,
  Phone,
  Home,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { ordersApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import { LocationSelector } from '@/components/ui/LocationSelector';

type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER';

interface GuestAddress {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, fetchCart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  
  const [guestAddress, setGuestAddress] = useState<GuestAddress>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestAddress(prev => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName} ${user.lastName}`,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleCreateOrder = async () => {
    if (!guestAddress.fullName || !guestAddress.email || !guestAddress.phone || !guestAddress.city || !guestAddress.district || !guestAddress.address) {
      toast.error('Lütfen tüm adres alanlarını eksiksiz doldurun');
      setStep('address');
      return;
    }

    if (!validateEmail(guestAddress.email)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    if (guestAddress.phone.replace(/\D/g, '').length < 10) {
      toast.error('Lütfen geçerli bir telefon numarası giriniz');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        guestEmail: guestAddress.email,
        guestPhone: guestAddress.phone,
        items: items.map(item => ({
          productId: item.product.id,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: guestAddress.fullName,
          phone: guestAddress.phone,
          city: guestAddress.city,
          district: guestAddress.district,
          address: guestAddress.address
        },
        billingAddress: {
          fullName: guestAddress.fullName,
          phone: guestAddress.phone,
          city: guestAddress.city,
          district: guestAddress.district,
          address: guestAddress.address
        },
        paymentMethod: paymentMethod === 'CREDIT_CARD' ? 'PAYTR' : 'BANK_TRANSFER'
      };

      const { data: order } = await ordersApi.create(orderData);
      
      // Store order data for analytics tracking
      const shippingCost = total >= 1000 ? 0 : 75;
      localStorage.setItem('lastOrder', JSON.stringify({
        total: total + shippingCost,
        tax: 0,
        shipping: shippingCost,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          quantity: item.quantity,
          category: item.product.category?.name,
        })),
      }));
      
      await clearCart();

      if (paymentMethod === 'CREDIT_CARD') {
        router.push(`/odeme/paytr?order=${order.orderNumber}`);
      } else {
        router.push(`/odeme/havale?order=${order.orderNumber}`);
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu');
      setIsLoading(false);
    }
  };

  if (count === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4 max-w-xl text-center bg-white p-12 rounded-[32px] shadow-sm border border-slate-100"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Sepetiniz Boş</h1>
          <p className="text-slate-500 mb-8">Ödeme yapabilmek için sepetinizde en az bir ürün bulunmalı.</p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-primary-600/20"
          >
            Alışverişe Başla
          </Link>
        </motion.div>
      </div>
    );
  }

  const shippingCost = total >= 1000 ? 0 : 75;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header & Back */}
        <div className="flex items-center justify-between mb-10">
          <Link 
            href="/sepet" 
            className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sepete Dön
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Güvenli Ödeme</span>
          </div>
        </div>

        {/* Improved Step Indicator */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: step === 'address' ? '50%' : '100%' }}
          />
          
          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col items-center gap-3">
              <motion.div 
                animate={{ 
                  scale: step === 'address' ? 1.1 : 1,
                  backgroundColor: step === 'address' || step === 'payment' ? '#2563eb' : '#e2e8f0'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-primary-600/20"
              >
                {step === 'payment' ? <CheckCircle2 className="w-6 h-6" /> : '1'}
              </motion.div>
              <span className={`text-sm font-black tracking-tight ${step === 'address' ? 'text-primary-600' : 'text-slate-400'}`}>Teslimat</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <motion.div 
                animate={{ 
                  scale: step === 'payment' ? 1.1 : 1,
                  backgroundColor: step === 'payment' ? '#2563eb' : '#e2e8f0'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black transition-colors"
              >
                2
              </motion.div>
              <span className={`text-sm font-black tracking-tight ${step === 'payment' ? 'text-primary-600' : 'text-slate-400'}`}>Ödeme</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'address' ? (
                <motion.div
                  key="address-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                      Teslimat Bilgileri
                    </h2>
                    {!isAuthenticated && (
                      <Link href="/giris" className="text-sm font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4">
                        Giriş Yap
                      </Link>
                    )}
                  </div>

                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Ad Soyad</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                          <input
                            type="text"
                            value={guestAddress.fullName}
                            onChange={(e) => setGuestAddress({ ...guestAddress, fullName: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                            placeholder="Adınız Soyadınız"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Telefon Numarası</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                          <input
                            type="tel"
                            value={guestAddress.phone}
                            onChange={(e) => {
                              // Sadece rakamlara izin ver
                              const val = e.target.value.replace(/\D/g, '');
                              // Maksimum 11 karakter (Türkiye telefon formatı: 05XX XXX XX XX)
                              if (val.length <= 11) {
                                setGuestAddress({ ...guestAddress, phone: val });
                              }
                            }}
                            onKeyDown={(e) => {
                              // Harf girişini engelle
                              if (e.key.length === 1 && /[^0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                            placeholder="05XX XXX XX XX"
                            maxLength={11}
                          />
                        </div>
                        {guestAddress.phone && guestAddress.phone.length < 10 && (
                          <p className="text-xs text-red-500 font-medium ml-1">Geçerli bir telefon numarası giriniz (en az 10 rakam)</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">E-posta Adresi</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          type="email"
                          value={guestAddress.email}
                          onChange={(e) => setGuestAddress({ ...guestAddress, email: e.target.value })}
                          onBlur={(e) => {
                            const email = e.target.value;
                            if (email && !validateEmail(email)) {
                              toast.error('Lütfen geçerli bir e-posta adresi giriniz');
                            }
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                          placeholder="ornek@email.com"
                        />
                      </div>
                      {guestAddress.email && !validateEmail(guestAddress.email) && (
                        <p className="text-xs text-red-500 font-medium ml-1">Geçerli bir e-posta adresi giriniz (ornek@email.com)</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <LocationSelector
                        label="Şehir"
                        type="city"
                        value={guestAddress.city}
                        onChange={(val) => setGuestAddress({ ...guestAddress, city: val, district: '' })}
                      />
                      <LocationSelector
                        label="İlçe"
                        type="district"
                        selectedCity={guestAddress.city}
                        value={guestAddress.district}
                        onChange={(val) => setGuestAddress({ ...guestAddress, district: val })}
                        placeholder={!guestAddress.city ? "Önce şehir seçin" : "İlçe seçin"}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Açık Adres</label>
                      <div className="relative group">
                        <Home className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <textarea
                          value={guestAddress.address}
                          onChange={(e) => setGuestAddress({ ...guestAddress, address: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 min-h-[120px] hover:border-slate-300 resize-none"
                          placeholder="Mahalle, Sokak, No, Daire bilgilerini giriniz..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!guestAddress.fullName || !guestAddress.phone || !guestAddress.city || !guestAddress.district || !guestAddress.address) {
                          toast.error('Lütfen tüm zorunlu alanları doldurun');
                          return;
                        }
                        if (!validateEmail(guestAddress.email)) {
                          toast.error('Lütfen geçerli bir e-posta adresi giriniz');
                          return;
                        }
                        if (guestAddress.phone.replace(/\D/g, '').length < 10) {
                          toast.error('Lütfen geçerli bir telefon numarası giriniz');
                          return;
                        }
                        setStep('payment');
                      }}
                      className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-black py-5 px-6 rounded-[20px] transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2"
                    >
                      ÖDEMEYE DEVAM ET
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="payment-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between mb-10">
                    <button 
                      onClick={() => setStep('address')}
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Adrese Dön
                    </button>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                      </div>
                      Ödeme Yöntemi
                    </h2>
                  </div>

                  <div className="grid gap-6">
                    {/* PayTR Option */}
                    <label 
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 border-2 rounded-[28px] cursor-pointer transition-all ${
                        paymentMethod === 'CREDIT_CARD' 
                          ? 'border-primary-600 bg-primary-50/30' 
                          : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        paymentMethod === 'CREDIT_CARD' ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <CreditCard className="w-7 h-7" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                          <span className="font-bold text-lg text-slate-900 tracking-tight">Kredi / Banka Kartı</span>
                          <span className="text-[10px] uppercase font-black tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded-md">Güvenli</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                          PayTR altyapısı ile peşin veya taksitli ödeme yapabilirsiniz. Kart bilgileriniz asla sunucularımızda saklanmaz.
                        </p>
                      </div>
                      {paymentMethod === 'CREDIT_CARD' && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute top-4 right-4"
                        >
                          <CheckCircle2 className="w-6 h-6 text-primary-600" />
                        </motion.div>
                      )}
                    </label>

                    {/* Bank Transfer Option */}
                    <label 
                      onClick={() => setPaymentMethod('BANK_TRANSFER')}
                      className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 border-2 rounded-[28px] cursor-pointer transition-all ${
                        paymentMethod === 'BANK_TRANSFER' 
                          ? 'border-primary-600 bg-primary-50/30' 
                          : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        paymentMethod === 'BANK_TRANSFER' ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                          <span className="font-bold text-lg text-slate-900 tracking-tight">Havale / EFT</span>
                          <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded-md">%3 İndirim</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                          Banka hesaplarımıza doğrudan transfer yaparak ödeme sağlayabilirsiniz. İşleminiz kontrol edildikten sonra onaylanır.
                        </p>
                      </div>
                      {paymentMethod === 'BANK_TRANSFER' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-800">Havale / EFT ile %3 İndirim!</p>
                            <p className="text-[10px] text-emerald-700 font-medium">Sipariş sonrası gösterilecek banka hesaplarımıza yapacağınız ödemelerde %3 ekstra indirim kazanırsınız.</p>
                          </div>
                        </motion.div>
                      )}
                      {paymentMethod === 'BANK_TRANSFER' && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute top-4 right-4"
                        >
                          <CheckCircle2 className="w-6 h-6 text-primary-600" />
                        </motion.div>
                      )}
                    </label>

                    <div className="mt-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-start gap-4">
                      <ShieldCheck className="w-6 h-6 text-primary-600 flex-shrink-0" />
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Siparişi onaylayarak <Link href="/sozlesme" className="underline font-bold">Mesafeli Satış Sözleşmesi</Link>'ni ve 
                        <Link href="/aydinlatma" className="underline font-bold"> Aydınlatma Metni</Link>'ni okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
                      </p>
                    </div>

                    <button
                      onClick={handleCreateOrder}
                      disabled={isLoading}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 px-6 rounded-[20px] transition-all hover:scale-[1.01] shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 active:scale-95"
                    >
                      {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Package className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <ShieldCheck className="w-6 h-6" />
                      )}
                      {isLoading ? 'SİPARİŞ OLUŞTURULUYOR...' : 'SİPARİŞİ ONAYLA'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom trust section */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
               <img src="https://iyzico.com/assets/images/logo/iyzico-logo.svg" alt="iyzico" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-5" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Former_Visa_%28company%29_logo.svg/1200px-Former_Visa_%28company%29_logo.svg.png" alt="Visa" className="h-4" />
            </div>
          </div>

          {/* Sticky Mini Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 sticky top-24 overflow-hidden group"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center justify-between">
                Sipariş Özeti
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                   <Package className="w-4 h-4 text-slate-400" />
                </div>
              </h3>

              {/* Products Mini List */}
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 border border-slate-100 p-1 relative overflow-hidden flex items-center justify-center">
                       <img 
                        src={item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.png'} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.png';
                        }}
                       />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold text-slate-900 truncate pr-2">{item.product.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-medium text-slate-400">{item.quantity} Adet</span>
                        <span className="text-sm font-black text-slate-900">{(Number(item.product.price) * item.quantity).toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-500 font-bold text-sm">
                  <span>Ara Toplam</span>
                  <span className="text-slate-900">{total.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold text-sm">
                  <span>Kargo</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500">Ücretsiz</span>
                  ) : (
                    <span className="text-slate-900">75,00 ₺</span>
                  )}
                </div>
                
                <div className="pt-6 relative">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-slate-400 capitalize">Ödenecek Tutar</span>
                    <span className="text-3xl font-black text-primary-600 tracking-tight">
                      {grandTotal.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right font-medium">Fiyatlara KDV Dahildir</p>
                </div>
              </div>

              {/* Security info card */}
              <div className="mt-8 bg-slate-900 rounded-[24px] p-5 text-center group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center justify-center gap-2 text-white mb-2">
                   <Lock className="w-4 h-4 text-primary-500" />
                   <span className="text-xs font-black tracking-widest uppercase">SSL SECURE</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Bilgileriniz uçtan uca şifrelenmektedir.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
