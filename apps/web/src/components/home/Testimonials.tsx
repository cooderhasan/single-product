'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  location?: string;
  title: string;
  content: string;
  rating: number;
  image?: string;
}

// Varsayılan yorumlar (API çalışmadığında)
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Onur T.',
    location: 'Ankara',
    title: 'Profesyonel servis konforu evde.',
    content: 'CF Moto\'mu bu sehpayla kaldırıyorum, bakım yapmak tam bir zevk. Dönüş mekanizması o kadar akıcı ki tek elle bile çevriliyor. Artık arkadaşlarım da benden ödünç istiyor :)',
    rating: 5,
  },
  {
    id: '2',
    name: 'Serkan D.',
    location: 'İzmir',
    title: 'Kendin yap kültürüne yakışan ürün.',
    content: 'Motoruna kendi eliyle dokunan herkesin garajında bu sehpa olmalı. Sağlamlık, denge, pratiklik hepsi bir arada. Üstelik montaj derdi yok, kutudan çıkarınca direkt kullanıyorsun.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Levent A.',
    location: 'Antalya',
    title: 'Uzun süredir böyle sağlam bir ürün görmedim.',
    content: 'Bakım işlerini yıllardır kendim yapıyorum, birçok sehpa denedim. 360 Sehpa diğerlerinden bariz fark yaratıyor: Gövdesi tok, dönüş mekanizması yumuşak ama sağlam. Ne kayma var, ne dengesizlik. Kısacası motoru sabitliyor, sana sadece işini yapmak kalıyor.',
    rating: 5,
  },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsApi.getAll();
        if (response.data && Array.isArray(response.data)) {
          setTestimonials(response.data);
        }
      } catch (error) {
        console.log('API bağlantı hatası - varsayılan yorumlar kullanılıyor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Müşterilerimiz Ne Diyor
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Binlerce motosiklet tutkununun güvendiği 360 Sehpa ile tanışın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Yıldızlar */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Tırnak işareti */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary-200" />
              </div>

              {/* Başlık */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                &ldquo;{testimonial.title}&rdquo;
              </h3>

              {/* İçerik */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {testimonial.content}
              </p>

              {/* Yazar */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-900">
                  {testimonial.name} {testimonial.location && `/ ${testimonial.location}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
