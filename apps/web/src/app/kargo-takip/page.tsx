import { Metadata } from 'next';
import { Truck, Search, Package, MapPin, Clock } from 'lucide-react';
import { generateMetaTitle, generateMetaDescription } from '@/lib/utils';

export const metadata: Metadata = {
  title: generateMetaTitle('Kargo Takip'),
  description: generateMetaDescription('Siparişinizin kargo durumunu takip edin. Yurtiçi Kargo, Aras Kargo, MNG Kargo ve diğer kargo firmaları ile anlık takip.'),
};

export default function KargoTakipPage() {
  const kargoFirmalari = [
    {
      name: 'Yurtiçi Kargo',
      url: 'https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula',
      phone: '444 99 99',
      color: 'bg-red-600',
    },
    {
      name: 'Aras Kargo',
      url: 'https://www.araskargo.com.tr/tr/cargo-tracking',
      phone: '444 25 52',
      color: 'bg-yellow-500',
    },
    {
      name: 'MNG Kargo',
      url: 'https://kargotakip.mngkargo.com.tr/',
      phone: '444 06 06',
      color: 'bg-orange-500',
    },
    {
      name: 'PTT Kargo',
      url: 'https://gonderitakip.ptt.gov.tr/',
      phone: '444 1 788',
      color: 'bg-yellow-400',
    },
    {
      name: 'Sürat Kargo',
      url: 'https://www.suratkargo.com.tr/kargo-takip',
      phone: '444 7 478',
      color: 'bg-blue-600',
    },
    {
      name: 'Kargoist',
      url: 'https://kargoist.com/',
      phone: '0850 480 00 00',
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kargo Takip
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Siparişinizin durumunu öğrenmek için kargo takip numaranızı ilgili kargo firmasının web sitesinde sorgulayabilirsiniz. 
            Siparişiniz kargoya verildiğinde SMS ve e-posta ile takip numarası gönderilmektedir.
          </p>
        </div>

        {/* Takip Adımları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Package, title: 'Sipariş Alındı', desc: 'Siparişiniz hazırlanıyor' },
            { icon: Truck, title: 'Kargoya Verildi', desc: 'Takip numarası gönderildi' },
            { icon: MapPin, title: 'Dağıtımda', desc: 'Kargonuz yolda' },
            { icon: Clock, title: 'Teslim Edildi', desc: 'Sipariş tamamlandı' },
          ].map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Kargo Firmaları */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-600" />
              Kargo Firmaları
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Çalıştığımız kargo firmalarının takip sayfalarına aşağıdan ulaşabilirsiniz.
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {kargoFirmalari.map((firma, index) => (
              <a
                key={index}
                href={firma.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-12 ${firma.color} rounded-full`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {firma.name}
                    </h3>
                    <p className="text-sm text-gray-500">{firma.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-primary-600 transition-colors">
                  <span className="text-sm hidden sm:block">Takip Et</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bilgi Notu */}
        <div className="mt-8 bg-primary-50 border border-primary-100 rounded-xl p-6">
          <h3 className="font-semibold text-primary-900 mb-2">Bilgilendirme</h3>
          <ul className="text-primary-800 text-sm space-y-1 list-disc list-inside">
            <li>Saat 15:00&apos;dan önce verilen siparişler aynı gün kargoya verilir.</li>
            <li>Kargo takip numaranız sipariş kargoya verildiğinde SMS ve e-posta ile gönderilir.</li>
            <li>Teslimat süresi bulunduğunuz bölgeye göre 1-3 iş günü arasındadır.</li>
            <li>Kargo teslimatı sırasında paketinizi kontrol etmenizi öneririz.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
