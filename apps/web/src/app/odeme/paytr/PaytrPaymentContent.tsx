'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { paymentsApi } from '@/lib/api';

export default function PaytrPaymentContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!orderNumber) {
      setError('Sipariş numarası bulunamadı');
      setIsLoading(false);
      return;
    }

    initializePayment();
  }, [orderNumber]);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      const { data } = await paymentsApi.initializePaytr(orderNumber!);
      setIframeUrl(data.iframeUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ödeme başlatılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Hazırlanıyor</h1>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Hatası</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/odeme'}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Ödeme Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Güvenli Ödeme</h1>
          <p className="text-gray-600">Kredi kartı bilgileriniz 256-bit SSL ile korunmaktadır</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <iframe
            src={iframeUrl}
            className="w-full min-h-[600px]"
            frameBorder="0"
            scrolling="no"
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ödeme işlemi PayTR güvencesiyle yapılmaktadır.</p>
          <p className="mt-1">Sipariş No: {orderNumber}</p>
        </div>
      </div>
    </div>
  );
}
