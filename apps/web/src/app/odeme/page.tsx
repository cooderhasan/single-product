'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Home
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER';

interface GuestAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  
  const [guestAddress, setGuestAddress] = useState<GuestAddress>({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    address: '',
  });

  useEffect(() => {
    if (isAuthenticated && user && !guestAddress.fullName) {
      setGuestAddress(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: prev.phone || '', // User phone from API if exists, otherwise fallback
        email: user.email // optional standard metadata
      }));
    }
  }, [isAuthenticated, user, guestAddress.fullName]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCreateOrder = async () => {
    if (!guestAddress.fullName || !guestAddress.phone || !guestAddress.city || !guestAddress.district || !guestAddress.address) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);

    try {
      const orderNumber = 'SP-' + Date.now();
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (paymentMethod === 'CREDIT_CARD') {
        router.push(`/odeme/paytr?order=${orderNumber}`);
      } else {
        router.push(`/odeme/havale?order=${orderNumber}`);
      }
    } catch {
      toast.error('Sipariş oluşturulurken bir hata oluştu');
      setIsLoading(false);
    }
  };

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Ödeme yapmak için sepetinizde ürün bulunmalı.</p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = total >= 1000 ? 0 : 75;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Adres</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Ödeme</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 'address' ? (
              /* Address Form */
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Teslimat Bilgileri
                  </h2>
                  
                  {!isAuthenticated ? (
                    <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      Zaten üye misiniz?
                      <Link href={`/giris`} className="font-semibold underline hover:text-blue-800">
                        Giriş Yap
                      </Link>
                    </div>
                  ) : (
                    <div className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">
                      Hesabınızdan bilgilerinizi otomatik çektik.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={guestAddress.fullName}
                          onChange={(e) => setGuestAddress({ ...guestAddress, fullName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Ad Soyad"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={guestAddress.phone}
                          onChange={(e) => setGuestAddress({ ...guestAddress, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="05XX XXX XX XX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.city}
                        onChange={(e) => setGuestAddress({ ...guestAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Şehir"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.district}
                        onChange={(e) => setGuestAddress({ ...guestAddress, district: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="İlçe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açık Adres *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={guestAddress.address}
                        onChange={(e) => setGuestAddress({ ...guestAddress, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        placeholder="Mahalle, Sokak, Bina No, Daire No"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!guestAddress.fullName || !guestAddress.phone || !guestAddress.city || !guestAddress.district || !guestAddress.address) {
                        toast.error('Lütfen tüm alanları doldurun');
                        return;
                      }
                      setStep('payment');
                    }}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Devam Et
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Method Selection */
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Ödeme Yöntemi
                </h2>

                <div className="space-y-4">
                  {/* Credit Card / PayTR */}
                  <label
                    className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="mt-1">
                      <input
                        type="radio"
                        name="payment"
                        value="CREDIT_CARD"
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        checked={paymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex sm:items-center flex-col sm:flex-row justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className={`w-5 h-5 ${paymentMethod === 'CREDIT_CARD' ? 'text-primary-600' : 'text-gray-500'}`} />
                          <span className="font-semibold text-gray-900">Kredi / Banka Kartı</span>
                        </div>
                        <span className="inline-flex text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded max-w-max border border-gray-200">
                          PayTR Altyapısı
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        PayTR güvencesiyle tüm kredi ve banka kartlarınızla peşin veya taksitli ödeme yapabilirsiniz.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="mt-1">
                      <input
                        type="radio"
                        name="payment"
                        value="BANK_TRANSFER"
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <Banknote className={`w-5 h-5 ${paymentMethod === 'BANK_TRANSFER' ? 'text-primary-600' : 'text-gray-500'}`} />
                        <span className="font-semibold text-gray-900">Havale / EFT</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Siparişi onayladıktan sonra size verilecek olan IBAN numarasına gönderim yapabilirsiniz.
                      </p>
                    </div>
                  </label>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => setStep('address')}
                      className="text-gray-600 hover:text-gray-700 font-medium"
                    >
                      ← Geri
                    </button>
                    <button
                      onClick={handleCreateOrder}
                      disabled={isLoading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      {isLoading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-600" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Güvenli Ödeme</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary-600" />
                <span>Hızlı Kargo</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

              {/* Products */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} adet</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {(Number(item.product.price) * item.quantity).toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{total.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')} ₺`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span className="text-primary-600">{grandTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {step === 'payment' && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Teslimat Adresi</h3>
                  <p className="text-sm text-gray-600">
                    {guestAddress.fullName}<br />
                    {guestAddress.phone}<br />
                    {guestAddress.address}<br />
                    {guestAddress.district}, {guestAddress.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
