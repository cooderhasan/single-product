'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

type BannerPosition = 'HOME_HERO' | 'HOME_MIDDLE' | 'HOME_BOTTOM' | 'CATEGORY_PAGE' | 'PRODUCT_PAGE'

interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  link?: string
  buttonText?: string
  position: BannerPosition
  sortOrder: number
  isActive: boolean
  startDate?: string
  endDate?: string
}

const positionLabels: Record<BannerPosition, string> = {
  HOME_HERO: 'Ana Sayfa Hero',
  HOME_MIDDLE: 'Ana Sayfa Orta',
  HOME_BOTTOM: 'Ana Sayfa Alt',
  CATEGORY_PAGE: 'Kategori Sayfası',
  PRODUCT_PAGE: 'Ürün Sayfası',
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/banners`)
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Banners fetch error:', error)
      toast.error('Bannerlar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu banner\'ı silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      if (response.ok) {
        toast.success('Banner başarıyla silindi')
        setBanners(banners.filter(b => b.id !== id))
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Banner silinirken hata oluştu')
    }
  }

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Banner Yönetimi</h1>
        <Link
          href="/banners/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Banner
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Banner ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görsel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pozisyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sıralama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-16 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-24 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Yok</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {banner.title}
                      </div>
                      {banner.subtitle && (
                        <div className="text-sm text-gray-500">
                          {banner.subtitle}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {positionLabels[banner.position]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {banner.sortOrder}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {banner.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/banners/edit/${banner.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBanners.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Henüz banner bulunmamaktadır.</p>
            <Link
              href="/banners/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              İlk Banner\'ı Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
