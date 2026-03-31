'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: '1',
    name: 'Motosiklet Sehpaları',
    slug: 'motosiklet-sehpalari',
    productCount: 12,
    sortOrder: 1,
    isActive: true,
    children: [
      { id: '1-1', name: 'Hidrolik Sehpalar', slug: 'hidrolik-sehpalar', productCount: 5, sortOrder: 1, isActive: true },
      { id: '1-2', name: 'Manuel Sehpalar', slug: 'manuel-sehpalar', productCount: 4, sortOrder: 2, isActive: true },
    ],
  },
  {
    id: '2',
    name: 'Aksesuarlar',
    slug: 'aksesuarlar',
    productCount: 8,
    sortOrder: 2,
    isActive: true,
    children: [],
  },
  {
    id: '3',
    name: 'Yedek Parçalar',
    slug: 'yedek-parcalar',
    productCount: 15,
    sortOrder: 3,
    isActive: true,
    children: [],
  },
];

export default function CategoriesPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1']);

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-500">Ürün kategorilerini yönetin</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          Yeni Kategori
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Tüm Kategoriler</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between p-6 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {category.children.length > 0 && (
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className={`p-1 text-gray-400 hover:text-gray-600 transition-transform ${
                        expandedCategories.includes(category.id) ? 'rotate-90' : ''
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{category.productCount}</p>
                    <p className="text-xs text-gray-500">Ürün</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{category.sortOrder}</p>
                    <p className="text-xs text-gray-500">Sıra</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories.includes(category.id) && category.children.length > 0 && (
                <div className="bg-gray-50">
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-6 pl-16 border-t border-gray-100 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Tag className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{child.name}</p>
                          <p className="text-sm text-gray-500">/{child.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{child.productCount}</p>
                          <p className="text-xs text-gray-500">Ürün</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{child.sortOrder}</p>
                          <p className="text-xs text-gray-500">Sıra</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {child.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
