import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// Demo blog yazıları
const blogPosts = {
  'motosiklet-bakim-ipuclari': {
    title: 'Motosiklet Bakım İpuçları',
    content: `
      <h2>Motosikletinizi Yazın Başında Hazırlayın</h2>
      <p>Yaz mevsimi yaklaşırken motosikletinizi kış boyunca biriken toz ve kirlerden arındırmak için temel bir bakım yapmanız gerekir. İlk olarak zincirinizi temizleyin ve uygun zincir yağı ile yağlayın.</p>
      
      <h3>Lastik Kontrolü</h3>
      <p>Lastik basınçlarınızı kontrol edin. Düşük hava basıncı hem güvenliğinizi hem de yakıt ekonominizi etkiler. Üretici tavsiyelerine göre lastik basıncını ayarlayın.</p>
      
      <h3>Fren Sistemleri</h3>
      <p>Fren hidrolik sıvı seviyesini kontrol edin. Renk koyulaşmışsa değiştirin. Fren balatalarını kontrol edin, aşınma sınırının altındaysa değiştirin.</p>
      
      <h3>Motor Yağı</h3>
      <p>Motor yağı seviyesini kontrol edin. Gerekirse yağ değişimi yapın. Kirli yağ motorunuzun ömrünü kısaltır.</p>
      
      <h2>Sehpa Kullanım Önerileri</h2>
      <p>Motosikletinizi sehpaya yerleştirirken dikkat edilmesi gereken en önemli nokta, sehpanın düz bir zeminde olmasıdır. Eğimli zeminlerde kullanım güvenli değildir.</p>
      
      <p>Motosikletinizi sehpaya almadan önce mutlaka el frenini çekin. Aracın vitesini boşa alın. Sehpanın kilitleme mekanizmasının tamamen oturduğundan emin olun.</p>
    `,
    excerpt: 'Motosikletinizin ömrünü uzatacak bakım ipuçları ve püf noktaları.',
    publishedAt: '2024-03-15',
    authorName: '360 Sehpa Ekibi',
  },
  'hidrolik-sehpa-nasil-kullanilir': {
    title: 'Hidrolik Sehpa Nasıl Kullanılır?',
    content: `
      <h2>Hidrolik Sehpa Kullanım Kılavuzu</h2>
      <p>Hidrolik motosiklet sehpaları, motosikletinizi güvenli ve kolay şekilde kaldırmanızı sağlayan profesyonel ekipmanlardır. Doğru kullanım hem güvenliğiniz hem de ekipmanın ömrü açısından çok önemlidir.</p>
      
      <h3>Kullanım Adımları</h3>
      <ol>
        <li><strong>Düz Zemin:</strong> Sehpayı tamamen düz bir zemine yerleştirin.</li>
        <li><strong>Motor Konumlandırma:</strong> Motosikletinizi sehpanın önüne getirin.</li>
        <li><strong>Kilit Kontrolü:</strong> Sehpanın kilidi açık konumda olduğundan emin olun.</li>
        <li><strong>Ped Yerleştirme:</strong> Kauçuk pedleri motosikletinizin altına uygun şekilde yerleştirin.</li>
        <li><strong>Pompalama:</strong> Hidrolik pompayı yavaşça pompalayın.</li>
        <li><strong>Kilit:</strong> Motosiklet kaldırıldıktan sonra kilitleyin.</li>
      </ol>
      
      <h3>Güvenlik Önlemleri</h3>
      <ul>
        <li>Her zaman emniyet kemerini kullanın</li>
        <li>Motosikletin el frenini çekmeyi unutmayın</li>
        <li>Vitesi boşa alın</li>
        <li>Sehpanın maksimum taşıma kapasitesine dikkat edin</li>
        <li>Çocukların yakınında kullanmayın</li>
      </ul>
      
      <h2>Bakım Önerileri</h2>
      <p>Hidrolik sistemin düzenli bakımı çok önemlidir. Hidrolik sıvı seviyesini kontrol edin. Pompa mekanizmasını temiz tutun. Kauçuk pedlerde aşınma varsa değiştirin.</p>
    `,
    excerpt: 'Hidrolik motosiklet sehpasının doğru kullanımı ve güvenlik önlemleri.',
    publishedAt: '2024-03-10',
    authorName: '360 Sehpa Ekibi',
  },
  'en-iyi-motosiklet-sehpalari': {
    title: '2024 En İyi Motosiklet Sehpaları',
    content: `
      <h2>2024 Yılının En İyi Sehpaları</h2>
      <p>Motosikletiniz için en uygun sehpayı seçmek zor olabilir. Bu yazımızda 2024 yılının en çok tercih edilen modellerini karşılaştırdık.</p>
      
      <h3>1. Hidrolik Sehpa Pro Model</h3>
      <p>600kg taşıma kapasitesi, çift piston sistemi ve otomatik kilit mekanizması ile profesyonel kullanıcılar için ideal.</p>
      
      <h3>2. Manuel Sehpa Ekonomik</h3>
      <p>Bütçe dostu bu model 400kg kapasiteye sahip. Ayarlanabilir yükseklik ve sağlam yapısı ile ev kullanıcıları için mükemmel.</p>
      
      <h3>3. Hidrolik Sehpa Super Pro</h3>
      <p>800kg kapasite, gelişmiş güvenlik özellikleri ve uzun ömürlü yapısı ile işletmeler için tavsiye edilir.</p>
      
      <h2>Seçerken Dikkat Edilmesi Gerekenler</h2>
      <ul>
        <li><strong>Kapasite:</strong> Motosikletinizin ağırlığına uygun kapasite seçin</li>
        <li><strong>Malzeme:</strong> Sağlam çelik yapı tercih edin</li>
        <li><strong>Kolaylık:</strong> Kurulum ve kullanım kolaylığına dikkat edin</li>
      </ul>
    `,
    excerpt: 'Yılın en çok tercih edilen motosiklet kaldırma sehpaları karşılaştırması.',
    publishedAt: '2024-03-05',
    authorName: '360 Sehpa Ekibi',
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts];
  
  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-primary-100 hover:text-white mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Bloga Dön
            </Link>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-primary-100 mb-2">{post.excerpt}</p>
            <div className="text-sm text-primary-200">
              {new Date(post.publishedAt).toLocaleDateString('tr-TR')} • {post.authorName}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article 
            className="prose prose-lg max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}
