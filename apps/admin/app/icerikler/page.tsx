'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

interface SiteContent {
  id: string
  key: string
  title?: string
  subtitle?: string
  description?: string
  image?: string
  buttonText?: string
  buttonLink?: string
  isActive: boolean
  sortOrder: number
}

const contentLabels: Record<string, { name: string; description: string }> = {
  'product_showcase': {
    name: 'Ürün Vitrini',
    description: 'Ana sayfa ürün vitrini bölümü',
  },
  'features_section': {
    name: 'Özellikler Bölümü',
    description: 'Ürün özellikleri listesi',
  },
  'trust_badges': {
    name: 'Güven Rozetleri',
    description: 'Güven ve kalite rozetleri',
  },
  'about_section': {
    name: 'Hakkımızda Bölümü',
    description: 'Ana sayfa hakkımızda alanı',
  },
  'contact_info': {
    name: 'İletişim Bilgileri',
    description: 'İletişim sayfası bilgileri',
  },
}

export default function SiteContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Contents fetch error:', error)
      toast.error('İçerikler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success('Durum güncellendi')
        fetchContents()
      } else {
        throw new Error('Güncelleme başarısız')
      }
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu')
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Site İçerikleri</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => {
          const label = contentLabels[content.key] || { name: content.key, description: '' }
          return (
            <div key={content.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{label.name}</h3>
                  <p className="text-sm text-gray-500">{label.description}</p>
                  <code className="text-xs text-gray-400 mt-1 block">{content.key}</code>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    content.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {content.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {content.image && (
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}

              {content.title && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Başlık:</span>
                  <p className="text-sm font-medium text-gray-900">{content.title}</p>
                </div>
              )}

              {content.subtitle && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Alt Başlık:</span>
                  <p className="text-sm text-gray-700">{content.subtitle}</p>
                </div>
              )}

              {content.description && (
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Açıklama:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{content.description}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => handleToggleActive(content.id, content.isActive)}
                  className={`text-sm font-medium ${
                    content.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {content.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Görüntüle"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <Link
                    href={`/icerikler/edit/${content.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Düzenle"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {contents.length === 0 && (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz site içeriği bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
