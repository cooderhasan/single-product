'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react';

export default function OrderFailedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ödeme Başarısız
          </h1>
          
          <p className="text-gray-600 mb-6">
            Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Sipariş Numarası</p>
              <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Olası Nedenler
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Yetersiz bakiye</li>
              <li>• Yanlış kart bilgileri</li>
              <li>• Banka onayı reddedildi</li>
              <li>• Güvenlik doğrulaması başarısız</li>
              <li>• Bağlantı sorunu</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/odeme"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </Link>
            <Link
              href="/iletisim"
              className="w-full sm:w-auto text-center text-gray-600 hover:text-gray-700 font-medium py-3 px-6"
            >
              Destek Al
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
