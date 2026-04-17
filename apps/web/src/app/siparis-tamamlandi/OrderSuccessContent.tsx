'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { trackPurchase } from '@/components/analytics/dataLayer';

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track purchase conversion
  useEffect(() => {
    if (orderNumber) {
      // Get order details from localStorage (set during checkout)
      const orderData = localStorage.getItem('lastOrder');
      if (orderData) {
        try {
          const parsed = JSON.parse(orderData);
          trackPurchase({
            transaction_id: orderNumber,
            value: parsed.total || 0,
            tax: parsed.tax || 0,
            shipping: parsed.shipping || 0,
            currency: 'TRY',
            items: parsed.items || [],
          });
          // Clear after tracking
          localStorage.removeItem('lastOrder');
        } catch (e) {
          console.error('Purchase tracking error:', e);
        }
      }
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Siparişiniz Alındı!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Siparişiniz başarıyla oluşturuldu. Teşekkür ederiz!
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Sipariş Numaranız</p>
              <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-primary-50 rounded-lg p-4">
              <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-primary-900">Sipariş Takibi</h3>
              <p className="text-sm text-primary-700">
                Siparişlerim sayfasından takip edebilirsiniz
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900">E-posta Bildirimi</h3>
              <p className="text-sm text-slate-700">
                Sipariş detayları e-postanıza gönderildi
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hesabim/siparisler"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Siparişlerimi Görüntüle
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto text-center text-gray-600 hover:text-gray-700 font-medium py-3 px-6"
            >
              Alışverişe Devam Et
            </Link>
          </div>

          {/* Auto Redirect */}
          <p className="text-sm text-gray-500 mt-6">
            {countdown > 0 ? (
              <>Siparişler sayfasına {countdown} saniye içinde yönlendirileceksiniz...</>
            ) : (
              <Link href="/hesabim/siparisler" className="text-primary-600 hover:underline">
                Yönlendiriliyor...
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
