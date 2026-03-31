import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}
