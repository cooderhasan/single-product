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

type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'

interface Coupon {
  id: string
  code: string
  description?: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  startDate: string
  endDate?: string
  isActive: boolean
}

const typeLabels: Record<CouponType, string> = {
  PERCENTAGE: 'Yüzde İndirim',
  FIXED_AMOUNT: 'Sabit Tutar',
  FREE_SHIPPING: 'Ücretsiz Kargo',
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      }
    } catch (error) {
      console.error('Coupons fetch error:', error)
      toast.error('Kuponlar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      if (response.ok) {
        toast.success('Kupon başarıyla silindi')
        setCoupons(coupons.filter(c => c.id !== id))
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Kupon silinirken hata oluştu')
    }
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'PERCENTAGE') {
      return `%${coupon.value}`
    } else if (coupon.type === 'FIXED_AMOUNT') {
      return `₺${coupon.value}`
    }
    return 'Ücretsiz'
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
        <h1 className="text-3xl font-bold text-gray-900">Kupon Yönetimi</h1>
        <Link
          href="/coupons/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Kupon
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kupon kodu ara..."
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
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanım
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Geçerlilik
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
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                        {coupon.code}
                      </div>
                      {coupon.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {coupon.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {typeLabels[coupon.type]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatValue(coupon)}
                    {coupon.maxDiscount && (
                      <div className="text-xs text-gray-500">
                        Max: ₺{coupon.maxDiscount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.usageCount} / {coupon.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{new Date(coupon.startDate).toLocaleDateString('tr-TR')}</div>
                    {coupon.endDate && (
                      <div className="text-xs text-gray-400">
                        - {new Date(coupon.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/coupons/edit/${coupon.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon.id)}
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

        {filteredCoupons.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Henüz kupon bulunmamaktadır.</p>
            <Link
              href="/coupons/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              İlk Kuponu Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
