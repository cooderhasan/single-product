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
  Plus,
  Truck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { Address } from '@/types';
import toast from 'react-hot-toast';

type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, fetchCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris?redirect=/odeme');
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [isAuthenticated, router, fetchCart]);

  const fetchAddresses = async () => {
    try {
      // API'den adresleri çek
      const demoAddresses: Address[] = [
        {
          id: '1',
          title: 'Ev',
          fullName: user?.firstName + ' ' + user?.lastName || 'Kullanıcı',
          phone: '0555 123 45 67',
          city: 'İstanbul',
          district: 'Kadıköy',
          neighborhood: 'Caferağa',
          address: 'Örnek Sokak No:5 D:3',
          zipCode: '34710',
          isDefault: true,
        },
      ];
      setAddresses(demoAddresses);
      setSelectedAddress(demoAddresses[0]?.id || '');
    } catch {
      toast.error('Adresler yüklenemedi');
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Lütfen bir teslimat adresi seçin');
      return;
    }

    setIsLoading(true);

    try {
      // Sipariş oluştur API çağrısı
      const orderNumber = 'SP-' + Date.now();
      
      // API entegrasyonu burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (paymentMethod === 'CREDIT_CARD') {
        // PayTR ödeme sayfasına yönlendir
        router.push(`/odeme/paytr?order=${orderNumber}`);
      } else {
        // Havale/EFT sayfasına yönlendir
        router.push(`/odeme/havale?order=${orderNumber}`);
      }
    } catch {
      toast.error('Sipariş oluşturulurken bir hata oluştu');
      setIsLoading(false);
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

  const selectedAddressData = addresses.find(a => a.id === selectedAddress);
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
              /* Address Selection */
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Teslimat Adresi
                  </h2>
                  <Link
                    href="/hesabim/adresler"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Yeni Adres Ekle
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Henüz adres eklenmemiş</p>
                    <Link
                      href="/hesabim/adresler"
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adres Ekle
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{address.title}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.fullName}</p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600">
                            {address.address}, {address.neighborhood}, {address.district}, {address.city}
                          </p>
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => setStep('payment')}
                      disabled={!selectedAddress}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Devam Et
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Payment Method Selection */
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Ödeme Yöntemi
                </h2>

                <div className="space-y-4">
                  {/* Credit Card */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CREDIT_CARD"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Kredi Kartı</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Güvenli ödeme ile kredi/banka kartınızla ödeyin
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-5 bg-blue-600 rounded"></div>
                      <div className="w-8 h-5 bg-red-500 rounded"></div>
                      <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">Havale / EFT</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Banka havalesi veya EFT ile ödeme yapın
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
                <Lock className="w-4 h-4 text-green-600" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Güvenli Ödeme</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
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

              {selectedAddressData && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Teslimat Adresi</h3>
                  <p className="text-sm text-gray-600">
                    {selectedAddressData.fullName}<br />
                    {selectedAddressData.address}<br />
                    {selectedAddressData.district}, {selectedAddressData.city}
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
