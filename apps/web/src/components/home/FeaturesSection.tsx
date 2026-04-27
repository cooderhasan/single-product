'use client';

import { useEffect, useState } from 'react';
import { Truck, Shield, Clock, Headphones, Loader2 } from 'lucide-react';
import { siteContentApi } from '@/lib/api';
import { motion } from 'framer-motion';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface FeaturesContent {
  id?: string;
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

// Varsayılan özellikler (API çalışmadığında)
const defaultFeatures: Feature[] = [
  {
    icon: 'truck',
    title: 'Ücretsiz Kargo',
    description: 'Tüm siparişlerde ücretsiz kargo',
  },
  {
    icon: 'clock',
    title: 'Hızlı Teslimat',
    description: 'Stoktan aynı gün kargo',
  },
  {
    icon: 'headphones',
    title: '7/24 Destek',
    description: 'WhatsApp üzerinden anında destek',
  },
];

const iconMap: Record<string, React.ElementType> = {
  truck: Truck,
  shield: Shield,
  clock: Clock,
  headphones: Headphones,
};

export function FeaturesSection() {
  const [content, setContent] = useState<FeaturesContent>({
    title: 'Neden 360 Sehpa?',
    subtitle: 'Profesyonel motosiklet bakımının adresi',
    features: defaultFeatures,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getByKey('features_section');
        if (response.data) {
          const data = response.data;
          setContent({
            title: data.title || content.title,
            subtitle: data.subtitle || content.subtitle,
            features: data.data?.features || defaultFeatures,
          });
        }
      } catch (error) {
        console.log('API bağlantı hatası - varsayılan içerik kullanılıyor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </section>
    );
  }

  const features = content.features || defaultFeatures;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {(content.title || content.subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {content.title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
            )}
            {content.subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.subtitle}</p>
            )}
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon || ''] || Shield;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
