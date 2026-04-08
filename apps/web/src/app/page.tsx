'use client';

import { useState, useEffect } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { TopTicker } from '@/components/home/TopTicker';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Testimonials } from '@/components/home/Testimonials';
import { bannersApi, productsApi, categoriesApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, productsRes, categoriesRes] = await Promise.allSettled([
        bannersApi.getAll(),
        productsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      if (bannersRes.status === 'fulfilled') {
        setBanners(bannersRes.value.data || []);
      }
      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data?.products || productsRes.value.data || []);
      }
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value.data || []);
      }
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
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} />
      <Testimonials />
      <FeaturesSection />
    </main>
  );
}
