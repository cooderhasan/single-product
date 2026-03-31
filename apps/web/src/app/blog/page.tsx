import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog | 360 Sehpa',
  description: 'Motosiklet bakım ipuçları, sehpa kullanımı ve daha fazlası.',
};

export default async function BlogPage() {
  let posts = [];
  
  try {
    const res = await blogApi.getAll();
    posts = res.data || [];
  } catch (error) {
    console.log('API hatası - demo modu');
  }

  // Demo yazılar
  if (posts.length === 0) {
    posts = [
      {
        id: '1',
        slug: 'motosiklet-bakim-ipuclari',
        title: 'Motosiklet Bakım İpuçları',
        excerpt: 'Motosikletinizin ömrünü uzatacak bakım ipuçları ve püf noktaları.',
        featuredImage: '/images/blog-1.jpg',
        publishedAt: '2024-03-15',
        authorName: 'Admin',
      },
      {
        id: '2',
        slug: 'hidrolik-sehpa-nasil-kullanilir',
        title: 'Hidrolik Sehpa Nasıl Kullanılır?',
        excerpt: 'Hidrolik motosiklet sehpasının doğru kullanımı ve güvenlik önlemleri.',
        featuredImage: '/images/blog-2.jpg',
        publishedAt: '2024-03-10',
        authorName: 'Admin',
      },
      {
        id: '3',
        slug: 'en-iyi-motosiklet-sehpalari',
        title: '2024 En İyi Motosiklet Sehpaları',
        excerpt: 'Yılın en çok tercih edilen motosiklet kaldırma sehpaları karşılaştırması.',
        featuredImage: '/images/blog-3.jpg',
        publishedAt: '2024-03-05',
        authorName: 'Admin',
      },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-primary-100">
            Motosiklet bakım ipuçları ve güncel haberler
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-video bg-gray-200 relative">
                  {post.featuredImage ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200" />
                  )}
                </div>
              </Link>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR')} • {post.authorName}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
