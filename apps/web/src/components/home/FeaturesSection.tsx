import { Truck, Shield, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Ücretsiz Kargo',
    description: '1000 TL üzeri siparişlerde ücretsiz kargo',
  },
  {
    icon: Shield,
    title: '2 Yıl Garanti',
    description: 'Tüm ürünlerimizde 2 yıl garanti',
  },
  {
    icon: Clock,
    title: 'Hızlı Teslimat',
    description: 'Stoktan aynı gün kargo',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'WhatsApp üzerinden anında destek',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
