'use client';

import { useState, useEffect } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { TopTicker } from '@/components/home/TopTicker';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Testimonials } from '@/components/home/Testimonials';
import { bannersApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const bannersRes = await bannersApi.getAll();
      setBanners(bannersRes.data || []);
    } catch (error) {
      console.log('API hatası - demo modu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <main>
      <TopTicker />
      <AnnouncementBar />
      <HeroBanner banners={banners} />
      <TrustBadges />
      <ProductShowcase />
      <Testimonials />
      <FeaturesSection />
    </main>
  );
}
