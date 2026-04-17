'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function EditContentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [features, setFeatures] = useState<string[]>([])
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [contactInfo, setContactInfo] = useState<any>({
    phone: '',
    email: '',
    address: '',
    workingHours: ''
  })
  const [newFeature, setNewFeature] = useState('')
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    sortOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchContent()
  }, [id])

  const fetchContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const content = data.find((c: any) => c.id === id)
        if (content) {
          setFormData({
            key: content.key || '',
            title: content.title || '',
            subtitle: content.subtitle || '',
            description: content.description || '',
            image: content.image || '',
            buttonText: content.buttonText || '',
            buttonLink: content.buttonLink || '',
            sortOrder: content.sortOrder || 0,
            isActive: content.isActive,
          })
          setFeatures(content.data?.features || [])
          setBankAccounts(content.data?.bankAccounts || [])
          setContactInfo(content.data?.contactInfo || {
            phone: '',
            email: '',
            address: '',
            workingHours: ''
          })
        }
      }
    } catch (error) {
      console.error('Content fetch error:', error)
      toast.error('İçerik bilgileri yüklenirken hata oluştu')
    } finally {
      setFetching(false)
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          ...formData,
          data: formData.key === 'bank_accounts' 
            ? { bankAccounts } 
            : formData.key === 'contact_info'
              ? { contactInfo }
              : { features },
        }),
      })

      if (response.ok) {
        toast.success('İçerik başarıyla güncellendi')
        router.push('/icerikler')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'İçerik güncellenemedi')
      }
    } catch (error: any) {
      toast.error(error.message || 'İçerik güncellenirken hata oluştu')
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
          href="/icerikler"
          className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Site İçeriği Düzenle</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buton Metni
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buton Linki
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Aktif</span>
              </label>
            </div>

            {/* Özellikler - Sadece bank_accounts veya contact_info DEĞİLSE göster */}
            {formData.key !== 'bank_accounts' && formData.key !== 'contact_info' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özellikler
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Yeni özellik ekle..."
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banka Hesapları - Sadece bank_accounts olduğunda göster */}
            {formData.key === 'bank_accounts' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Banka Hesap Listesi
                </label>
                <div className="space-y-6">
                  {bankAccounts.map((account, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                      <button
                        type="button"
                        onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Banka Adı</label>
                          <input
                            type="text"
                            value={account.bank}
                            onChange={(e) => {
                              const newAccounts = [...bankAccounts];
                              newAccounts[index].bank = e.target.value;
                              setBankAccounts(newAccounts);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                            placeholder="Ziraat Bankası"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Hesap Sahibi</label>
                          <input
                            type="text"
                            value={account.accountName}
                            onChange={(e) => {
                              const newAccounts = [...bankAccounts];
                              newAccounts[index].accountName = e.target.value;
                              setBankAccounts(newAccounts);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 mb-1">IBAN</label>
                          <input
                            type="text"
                            value={account.iban}
                            onChange={(e) => {
                              const newAccounts = [...bankAccounts];
                              newAccounts[index].iban = e.target.value;
                              setBankAccounts(newAccounts);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white font-mono"
                            placeholder="TR00 0000..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Şube</label>
                          <input
                            type="text"
                            value={account.branch}
                            onChange={(e) => {
                              const newAccounts = [...bankAccounts];
                              newAccounts[index].branch = e.target.value;
                              setBankAccounts(newAccounts);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Hesap No</label>
                          <input
                            type="text"
                            value={account.accountNo}
                            onChange={(e) => {
                              const newAccounts = [...bankAccounts];
                              newAccounts[index].accountNo = e.target.value;
                              setBankAccounts(newAccounts);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBankAccounts([...bankAccounts, { bank: '', iban: '', accountName: '', branch: '', accountNo: '' }])}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Yeni Hesap Ekle
                  </button>
                </div>
              </div>
            )}

            {/* İletişim Bilgileri - Sadece contact_info olduğunda göster */}
            {formData.key === 'contact_info' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Detayları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="info@360sehpa.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    <textarea
                      rows={2}
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Sanayi Mah. ..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
                    <input
                      type="text"
                      value={contactInfo.workingHours}
                      onChange={(e) => setContactInfo({ ...contactInfo, workingHours: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Pzt - Cum: 09:00 - 18:00"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/icerikler"
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
