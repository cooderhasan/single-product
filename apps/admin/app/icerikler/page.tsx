'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PencilIcon,
  EyeIcon,
  PlusIcon,
  SparklesIcon,
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
  'bank_accounts': {
    name: 'Banka Hesapları',
    description: 'Havale / EFT için banka hesap bilgileri',
  },
  'product_360sehpa_testimonials': {
    name: 'Ürün Yorumları - 360 Sehpa',
    description: 'Ürün detay sayfası "Kullanıcılar Ne Diyor" bölümü',
  },
  'product_360sehpa_reasons': {
    name: '6 Neden - 360 Sehpa',
    description: 'Ürün detay sayfası "Almanız İçin 6 Neden" bölümü',
  },
  'product_360sehpa_comparison': {
    name: 'Karşılaştırma - 360 Sehpa',
    description: 'Ürün detay sayfası karşılaştırma tablosu',
  },
  'product_360sehpa_faqs': {
    name: 'SSS - 360 Sehpa',
    description: 'Ürün detay sayfası sık sorulan sorular',
  },
  'product_360sehpa_description': {
    name: 'Ürün Açıklaması - 360 Sehpa',
    description: 'Ürün detay sayfası açıklama ve özellikler',
  },
  'product_360sehpa_specs': {
    name: 'Teknik Özellikler - 360 Sehpa',
    description: 'Ürün detay sayfası teknik özellikler tablosu',
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

  const loadSampleContent = async () => {
    if (!confirm('Varsayılan örnek içerikler yüklenecek. Devam etmek istiyor musunuz?')) return

    setLoading(true)
    const samples = [
      {
        key: 'product_showcase',
        title: 'Motosiklet bakımını bir sanat haline getir; her açıdan eriş, her hareketi kontrol et, her an güven içinde ol.',
        description: '360 Derece Tam Döner Mekanizma: Motosikletini kaldırmanın ötesinde, her yöne 360 derece döndürebilirsin! Zincir yağlama, fren balata değişimi, motor bileşenlerine erişim veya lastik tamiri gibi işlerde motosikleti istediğin açıya getir – eğilmek, zorlanmak yok! Standart sehpalarda sınırlı hareket varken, bu senin zamanını ve enerjini %50\'ye varan oranda tasarruf ettirir. Bakım süren kısalır, keyfin artar!',
        image: '/images/sehpa-motor.jpg',
        buttonText: 'SATIN AL',
        buttonLink: '/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli',
        data: {
          features: [
            '360° Döner Mekanizma',
            'Kilitli Tekerlekler',
            'Dayanıklı Çelik Gövde',
            'Universal Uyum',
          ]
        }
      },
      {
        key: 'features_section',
        title: 'Neden 360 Sehpa?',
        subtitle: 'Profesyonel motosiklet bakımının adresi',
        data: {
          features: [
            { icon: 'truck', title: 'Ücretsiz Kargo', description: '1000 TL üzeri siparişlerde ücretsiz kargo' },
            { icon: 'shield', title: '2 Yıl Garanti', description: 'Tüm ürünlerimizde 2 yıl garanti' },
            { icon: 'clock', title: 'Hızlı Teslimat', description: 'Stoktan aynı gün kargo' },
            { icon: 'headphones', title: '7/24 Destek', description: 'WhatsApp üzerinden anında destek' }
          ]
        }
      }
    ]

    try {
      for (const sample of samples) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify(sample),
        })
      }
      toast.success('Örnek içerikler başarıyla yüklendi')
      fetchContents()
    } catch (error) {
      toast.error('Örnek içerikler yüklenirken hata oluştu')
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Site İçerikleri</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadSampleContent}
            className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Örnek İçerikleri Yükle
          </button>
          <Link
            href="/icerikler/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni İçerik Ekle
          </Link>
        </div>
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
