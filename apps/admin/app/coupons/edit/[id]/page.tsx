'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'

const typeOptions: { value: CouponType; label: string }[] = [
  { value: 'PERCENTAGE', label: 'Yüzde İndirim (%)' },
  { value: 'FIXED_AMOUNT', label: 'Sabit Tutar (₺)' },
  { value: 'FREE_SHIPPING', label: 'Ücretsiz Kargo' },
]

export default function EditCouponPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE' as CouponType,
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    usagePerUser: 1,
    startDate: '',
    endDate: '',
    isActive: true,
  })

  useEffect(() => {
    fetchCoupon()
  }, [id])

  const fetchCoupon = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const coupon = data.find((c: any) => c.id === id)
        if (coupon) {
          setFormData({
            code: coupon.code,
            description: coupon.description || '',
            type: coupon.type,
            value: Number(coupon.value),
            minOrderAmount: Number(coupon.minOrderAmount) || 0,
            maxDiscount: Number(coupon.maxDiscount) || 0,
            usageLimit: coupon.usageLimit || 0,
            usagePerUser: coupon.usagePerUser || 1,
            startDate: new Date(coupon.startDate).toISOString().slice(0, 16),
            endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : '',
            isActive: coupon.isActive,
          })
        }
      }
    } catch (error) {
      console.error('Coupon fetch error:', error)
      toast.error('Kupon bilgileri yüklenirken hata oluştu')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          ...formData,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
          endDate: formData.endDate || undefined,
        }),
      })

      if (response.ok) {
        toast.success('Kupon başarıyla güncellendi')
        router.push('/coupons')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Kupon güncellenemedi')
      }
    } catch (error: any) {
      toast.error(error.message || 'Kupon güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          href="/coupons"
          className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Kupon Düzenle</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kupon Kodu *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İndirim Tipi *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CouponType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Değer {formData.type === 'PERCENTAGE' ? '(%)' : formData.type === 'FIXED_AMOUNT' ? '(₺)' : ''}
              </label>
              <input
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                disabled={formData.type === 'FREE_SHIPPING'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Sipariş Tutarı (₺)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimum İndirim (₺)
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sınırsız"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanım Limiti
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sınırsız"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Başı Limit
              </label>
              <input
                type="number"
                min="1"
                value={formData.usagePerUser}
                onChange={(e) => setFormData({ ...formData, usagePerUser: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlangıç Tarihi *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitiş Tarihi
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Aktif</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/coupons"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
