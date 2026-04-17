import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'İletişim | 360 Sehpa',
  description: 'Bize ulaşın. 0555 123 45 67 - info@360sehpa.com. Motosiklet sehpası satış ve destek hattı.',
  keywords: ['iletişim', 'motosiklet sehpası', 'destek', 'müşteri hizmetleri'],
  openGraph: {
    title: 'İletişim | 360 Sehpa',
    description: 'Bize ulaşın. 0555 123 45 67 - info@360sehpa.com',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://360sehpa.com/iletisim',
  },
  alternates: {
    canonical: 'https://360sehpa.com/iletisim',
  },
};

export default function ContactPage() {
  // ContactPage Schema
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'İletişim | 360 Sehpa',
    description: 'Bize ulaşın. 0555 123 45 67 - info@360sehpa.com',
    url: 'https://360sehpa.com/iletisim',
    mainEntity: {
      '@type': 'Organization',
      name: '360 Sehpa',
      telephone: '+90-555-123-45-67',
      email: 'info@360sehpa.com',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'TR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+90-555-123-45-67',
        contactType: 'customer service',
        availableLanguage: ['Turkish'],
        areaServed: 'TR',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactClient />
    </>
  );
}
