'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Banknote, 
  Copy, 
  CheckCircle, 
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const bankAccounts = [
  {
    bank: 'Garanti BBVA',
    iban: 'TR12 3456 7890 1234 5678 9012 34',
    accountName: '360 Sehpa Ticaret A.Ş.',
    branch: 'Kadıköy Şubesi',
    accountNo: '12345678',
  },
  {
    bank: 'Akbank',
    iban: 'TR98 7654 3210 9876 5432 1098 76',
    accountName: '360 Sehpa Ticaret A.Ş.',
    branch: 'İstanbul Şubesi',
    accountNo: '87654321',
  },
];

export default function BankTransferContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  
  const [copiedIban, setCopiedIban] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 saat

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(text);
    toast.success('IBAN kopyalandı');
    setTimeout(() => setCopiedIban(''), 2000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} saat ${minutes} dakika`;
  };

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h1>
          <Link
            href="/odeme"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ödeme Sayfasına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
          <p className="text-gray-600">
            Sipariş numaranız: <span className="font-semibold text-primary-600">{orderNumber}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Ödeme Süreniz</p>
              <p className="text-lg font-bold text-yellow-900">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary-600" />
            Havale / EFT Talimatları
          </h2>
          
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
              <span>Aşağıdaki banka hesaplarından birini seçin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
              <span>Sipariş tutarını havale/EFT ile gönderin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
              <span>Açıklama kısmına sipariş numaranızı ({orderNumber}) yazmayı unutmayın</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
              <span>Ödemeniz onaylandıktan sonra siparişiniz kargoya verilecektir</span>
            </li>
          </ol>
        </div>

        {/* Bank Accounts */}
        <div className="space-y-4 mb-6">
          {bankAccounts.map((account) => (
            <div key={account.iban} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{account.bank}</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">IBAN</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono">
                      {account.iban}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.iban)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                      title="Kopyala"
                    >
                      {copiedIban === account.iban ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Hesap Sahibi</p>
                    <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Şube</p>
                    <p className="text-sm font-medium text-gray-900">{account.branch}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Önemli Notlar</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Havale/EFT ücreti müşteriye aittir</li>
            <li>• Ödeme onayı 1-2 iş günü sürebilir</li>
            <li>• 48 saat içinde ödeme yapılmazsa sipariş iptal edilir</li>
            <li>• Dekontunuzu info@360sehpa.com adresine gönderebilirsiniz</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/hesabim/siparisler"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Siparişlerimi Görüntüle
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto text-center text-gray-600 hover:text-gray-700 font-medium"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
