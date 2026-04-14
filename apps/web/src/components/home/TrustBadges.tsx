import { ShieldCheck, Truck, Award, Lock } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, alt: 'Güvenli Alışveriş' },
  { icon: Truck, alt: 'Hızlı Kargo' },
  { icon: Award, alt: 'Memnuniyet Garantisi' },
  { icon: Lock, alt: 'SSL Güvenlik' },
];

export function TrustBadges() {
  return (
    <div className="bg-primary-900 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-white/90 group cursor-default"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                <badge.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium tracking-wide">{badge.alt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
