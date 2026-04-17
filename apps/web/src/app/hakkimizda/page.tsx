import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Hakkımızda | 360 Sehpa',
  description: '360 Sehpa - Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi. 10 yıllık tecrübe, 50.000+ mutlu müşteri.',
  keywords: ['hakkımızda', '360 sehpa', 'motosiklet sehpası', 'şirket', 'hikaye'],
  openGraph: {
    title: 'Hakkımızda | 360 Sehpa',
    description: 'Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi. 10 yıllık tecrübe, 50.000+ mutlu müşteri.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://360sehpa.com/hakkimizda',
  },
  alternates: {
    canonical: 'https://360sehpa.com/hakkimizda',
  },
};

export default function AboutPage() {
  // AboutPage Schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Hakkımızda | 360 Sehpa',
    description: '360 Sehpa - Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi.',
    url: 'https://360sehpa.com/hakkimizda',
    mainEntity: {
      '@type': 'Organization',
      name: '360 Sehpa',
      description: 'Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi.',
      url: 'https://360sehpa.com',
      foundingDate: '2014',
      sameAs: [
        'https://facebook.com/360sehpa',
        'https://instagram.com/360sehpa',
        'https://youtube.com/360sehpa',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-lg text-primary-100">
              10 yıllık tecrübe, 50.000+ mutlu müşteri
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Story */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Hikayemiz</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                360 Sehpa, 2014 yılında İstanbul'da kuruldu. Motosiklet tutkunları olarak, 
                kaliteli ve güvenilir kaldırma sehpaları üretme hayaliyle yola çıktık.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                10 yılda Türkiye'nin en büyük motosiklet sehpası üreticisi olduk. 
                50.000'den fazla motosiklet tutkununa hizmet verdik.
              </p>
            </section>

            {/* Values */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Değerlerimiz</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kalite</h3>
                  <p className="text-gray-600">En yüksek kalite standartlarında üretim</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Müşteri Odaklılık</h3>
                  <p className="text-gray-600">Müşteri memnuniyeti önceliğimizdir</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">İnovasyon</h3>
                  <p className="text-gray-600">Sürekli gelişim ve yenilik</p>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
                  <div className="text-gray-600">Yıllık Tecrübe</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
                  <div className="text-gray-600">Mutlu Müşteri</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
                  <div className="text-gray-600">Ürün Çeşidi</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">81</div>
                  <div className="text-gray-600">İl'e Kargo</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
