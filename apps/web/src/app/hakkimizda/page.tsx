'use client';

import { useState, useEffect } from 'react';
import { siteContentApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string[];
  valuesTitle: string;
  values: { title: string; description: string }[];
  stats: { value: string; label: string }[];
}

const defaultContent: AboutContent = {
  heroTitle: 'Hakkımızda',
  heroSubtitle: '10 yıllık tecrübe, 50.000+ mutlu müşteri',
  storyTitle: 'Hikayemiz',
  storyContent: [
    '360 Sehpa, 2014 yılında İstanbul\'da kuruldu. Motosiklet tutkunları olarak, kaliteli ve güvenilir kaldırma sehpaları üretme hayaliyle yola çıktık.',
    '10 yılda Türkiye\'nin en büyük motosiklet sehpası üreticisi olduk. 50.000\'den fazla motosiklet tutkununa hizmet verdik.'
  ],
  valuesTitle: 'Değerlerimiz',
  values: [
    { title: 'Kalite', description: 'En yüksek kalite standartlarında üretim' },
    { title: 'Müşteri Odaklılık', description: 'Müşteri memnuniyeti önceliğimizdir' },
    { title: 'İnovasyon', description: 'Sürekli gelişim ve yenilik' }
  ],
  stats: [
    { value: '10+', label: 'Yıllık Tecrübe' },
    { value: '50K+', label: 'Mutlu Müşteri' },
    { value: '25+', label: 'Ürün Çeşidi' },
    { value: '81', label: 'İl\'e Kargo' }
  ]
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await siteContentApi.getByKey('about_page');
      if (response.data && response.data.data) {
        setContent({ ...defaultContent, ...response.data.data });
      }
    } catch (error) {
      console.log('Hakkımızda içeriği yüklenemedi, varsayılan kullanılıyor');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Hakkımızda | 360 Sehpa</title>
        <meta name="description" content="360 Sehpa - Türkiye'nin #1 motosiklet kaldırma sehpası üreticisi. 10 yıllık tecrübe, 50.000+ mutlu müşteri." />
        <meta property="og:title" content="Hakkımızda | 360 Sehpa" />
        <meta property="og:description" content="Türkiye'nin #1 motosiklet kaldırma sehpası üreticisi. 10 yıllık tecrübe, 50.000+ mutlu müşteri." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://360sehpa.com/hakkimizda" />
        <link rel="canonical" href="https://360sehpa.com/hakkimizda" />
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{content.heroTitle}</h1>
            <p className="text-lg text-primary-100">
              {content.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Story */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">{content.storyTitle}</h2>
              {content.storyContent.map((paragraph, index) => (
                <p key={index} className="text-gray-600 text-lg leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </section>

            {/* Values */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">{content.valuesTitle}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {content.values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                        {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                        {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
