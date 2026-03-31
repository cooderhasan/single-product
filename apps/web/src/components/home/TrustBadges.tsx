import Image from 'next/image';

const badges = [
  { src: '/badges/guvenli-alisveris.svg', alt: 'Güvenli Alışveriş' },
  { src: '/badges/hizli-kargo.svg', alt: 'Hızlı Kargo' },
  { src: '/badges/memnuniyet-garantisi.svg', alt: 'Memnuniyet Garantisi' },
  { src: '/badges/ssl.svg', alt: 'SSL Güvenlik' },
];

export function TrustBadges() {
  return (
    <div className="bg-primary-900 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/90 text-sm"
            >
              <div className="w-8 h-8 relative">
                <div className="w-full h-full bg-white/20 rounded-full" />
              </div>
              <span className="hidden sm:block">{badge.alt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
