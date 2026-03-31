import Link from 'next/link';
import Image from 'next/image';
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
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="group relative h-64 rounded-xl overflow-hidden"
    >
      <Image
        src={category.image || '/images/category-placeholder.jpg'}
        alt={category.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
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
