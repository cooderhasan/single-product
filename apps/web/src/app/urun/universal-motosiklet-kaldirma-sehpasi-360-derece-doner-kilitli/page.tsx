import type { Metadata } from 'next';
import ProductClient from './product-client';

export const metadata: Metadata = {
  title: 'Universal Motosiklet Kaldırma Sehpası | 360° Döner & Kilitli Paddock',
  description: 'Motosikletinizi güvenle kaldırıp 360° döndürebileceğiniz kilit mekanizmalı profesyonel paddock standı. 14 gün ücretsiz iade, 2 yıl tam garanti ile hızlı kargo!',
  openGraph: {
    title: 'Universal Motosiklet Kaldırma Sehpası 360° Döner',
    description: 'Dar garajlarda manevra yapmak artık çok kolay. Türkiye\'nin ilk ve tek kilit mekanizmalı hareketli sehpası.',
    images: [{ url: '/product-page-test.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'tr_TR'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Motosiklet Kaldırma Sehpası | 360° Döner',
    description: 'Motosikletinizi güvenle kaldırıp 360° döndürebileceğiniz kilit mekanizmalı profesyonel paddock standı. 14 gün ücretsiz iade!',
    images: ['/product-page-test.png'],
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Universal Motosiklet Kaldırma Sehpası 360° Döner',
    image: 'https://cooderhasan.com/product-page-test.png',
    description: 'Motosikletinizi güvenle kaldırıp 360° döndürebileceğiniz kilit mekanizmalı profesyonel paddock standı.',
    brand: {
      '@type': 'Brand',
      name: 'Motovitrin'
    },
    offers: {
      '@type': 'Offer',
      url: 'https://cooderhasan.com/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli',
      priceCurrency: 'TRY',
      price: '3722',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Motovitrin'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient />
    </>
  );
}
