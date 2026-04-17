import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: '360 Sehpa | Profesyonel Motosiklet Kaldırma Sehpaları',
  description:
    'Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi. Hidrolik ve manuel sehpalar, profesyonel ekipmanlar.',
  keywords: [
    'motosiklet sehpası',
    'motosiklet kaldırma',
    'hidrolik sehpa',
    'manuel sehpa',
    'motosiklet lift',
    'motosiklet bakım',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://360sehpa.com',
    siteName: '360 Sehpa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '360 Sehpa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '360 Sehpa | Profesyonel Motosiklet Kaldırma Sehpaları',
    description: 'Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://360sehpa.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  authors: [{ name: '360 Sehpa' }],
  creator: '360 Sehpa',
  publisher: '360 Sehpa',
  metadataBase: new URL('https://360sehpa.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  
  // GTM Script
  const gtmScript = gtmId ? `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  ` : '';
  
  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '360 Sehpa',
    url: 'https://360sehpa.com',
    logo: 'https://360sehpa.com/logo.png',
    description: 'Türkiye\'nin #1 motosiklet kaldırma sehpası üreticisi.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-555-123-45-67',
      contactType: 'customer service',
      availableLanguage: ['Turkish'],
    },
    sameAs: [
      'https://facebook.com/360sehpa',
      'https://instagram.com/360sehpa',
      'https://youtube.com/360sehpa',
    ],
  };

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '360 Sehpa',
    url: 'https://360sehpa.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://360sehpa.com/urunler?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="tr">
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{ __html: gtmScript }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Header />
        <main className="min-h-screen bg-white pt-16 sm:pt-[96px] lg:pt-[112px]">{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
