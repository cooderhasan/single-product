import Link from 'next/link';
import { Category } from '@/types';

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const mainCategories = categories.filter((c) => !c.parent);

  if (mainCategories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            İhtiyacınıza uygun profesyonel sehpa çözümleri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  const imageUrl = category.image ? (category.image.startsWith('http') ? category.image : `${apiBase}${category.image}`) : null;

  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="group relative h-64 rounded-xl overflow-hidden"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
        {category.description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
