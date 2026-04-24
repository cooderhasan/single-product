'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, PlusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { SingleImageUpload } from '@/components/ui/SingleImageUpload'

export default function NewContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Specialized state types
  const [features, setFeatures] = useState<string[]>([])
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [contactInfo, setContactInfo] = useState<any>({
    phone: '',
    email: '',
    address: '',
    workingHours: ''
  })
  const [reviews, setReviews] = useState<any[]>([])
  const [testimonialStats, setTestimonialStats] = useState<any>({
    totalReviews: 127,
    satisfaction: 98
  })
  const [reasons, setReasons] = useState<any[]>([])
  const [comparisonRows, setComparisonRows] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [specs, setSpecs] = useState<any[]>([])
  const [homeFeatures, setHomeFeatures] = useState<any[]>([])
  
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/site-content`, {
        method: 'POST',
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
              : formData.key === 'product_360sehpa_testimonials'
                ? { reviews, stats: testimonialStats }
                : formData.key === 'product_360sehpa_reasons'
                  ? { items: reasons }
                  : formData.key === 'product_360sehpa_comparison'
                    ? { rows: comparisonRows }
                    : formData.key === 'product_360sehpa_faqs'
                      ? { faqs }
                      : formData.key === 'product_360sehpa_specs'
                        ? { specs }
                        : formData.key === 'features_section'
                          ? { features: homeFeatures }
                          : { features },
        }),
      })

      if (response.ok) {
        toast.success('İçerik başarıyla oluşturuldu')
        router.push('/icerikler')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'İçerik oluşturulamadı')
      }
    } catch (error: any) {
      toast.error(error.message || 'İçerik oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Yeni Site İçeriği</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İçerik Anahtarı (Key) *
              </label>
              <input
                type="text"
                required
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: product_360sehpa_reasons"
              />
              <p className="mt-1 text-xs text-gray-500">Sistem taraflı eşleşme için benzersiz bir anahtar (key) girin.</p>
            </div>

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
                Görsel
              </label>
              <SingleImageUpload
                image={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="İçerik Görseli"
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

            {/* Özellikler - Basit liste */}
            {![
              'bank_accounts', 
              'contact_info', 
              'product_360sehpa_testimonials', 
              'product_360sehpa_reasons', 
              'product_360sehpa_comparison', 
              'product_360sehpa_faqs', 
              'product_360sehpa_specs',
              'features_section'
            ].includes(formData.key) && (
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

            {/* Banka Hesapları */}
            {formData.key === 'bank_accounts' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banka Hesap Listesi</h3>
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
                      <input
                        type="text"
                        value={account.bank}
                        onChange={(e) => {
                          const newAccs = [...bankAccounts];
                          newAccs[index].bank = e.target.value;
                          setBankAccounts(newAccs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Banka Adı"
                      />
                      <input
                        type="text"
                        value={account.accountName}
                        onChange={(e) => {
                          const newAccs = [...bankAccounts];
                          newAccs[index].accountName = e.target.value;
                          setBankAccounts(newAccs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Hesap Sahibi"
                      />
                      <input
                        type="text"
                        value={account.iban}
                        onChange={(e) => {
                          const newAccs = [...bankAccounts];
                          newAccs[index].iban = e.target.value;
                          setBankAccounts(newAccs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg col-span-2 font-mono"
                        placeholder="IBAN"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setBankAccounts([...bankAccounts, { bank: '', accountName: '', iban: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Hesap Ekle
                </button>
              </div>
            )}

            {/* İletişim Bilgileri */}
            {formData.key === 'contact_info' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Detayları</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Telefon"
                  />
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="E-posta"
                  />
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg col-span-2"
                    placeholder="Adres"
                  />
                </div>
              </div>
            )}

            {/* 6 Neden */}
            {formData.key === 'product_360sehpa_reasons' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">6 Neden (Maddeler)</h3>
                {reasons.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                    <button
                      type="button"
                      onClick={() => setReasons(reasons.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={item.icon || ''}
                        onChange={(e) => {
                          const newItems = [...reasons];
                          newItems[index].icon = e.target.value;
                          setReasons(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg md:col-span-2"
                        placeholder="İkon (Emoji)"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...reasons];
                          newItems[index].title = e.target.value;
                          setReasons(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Başlık"
                      />
                      <input
                        type="text"
                        value={item.desc || ''}
                        onChange={(e) => {
                          const newItems = [...reasons];
                          newItems[index].desc = e.target.value;
                          setReasons(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Açıklama"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setReasons([...reasons, { icon: '', title: '', desc: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Madde Ekle
                </button>
              </div>
            )}

            {/* Karşılaştırma Tablosu */}
            {formData.key === 'product_360sehpa_comparison' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Karşılaştırma Tablosu</h3>
                {comparisonRows.map((row, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                    <button
                      type="button"
                      onClick={() => setComparisonRows(comparisonRows.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={row.feature || ''}
                        onChange={(e) => {
                          const newRows = [...comparisonRows];
                          newRows[index].feature = e.target.value;
                          setComparisonRows(newRows);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Özellik"
                      />
                      <input
                        type="text"
                        value={row.ours || ''}
                        onChange={(e) => {
                          const newRows = [...comparisonRows];
                          newRows[index].ours = e.target.value;
                          setComparisonRows(newRows);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="360 Sehpa"
                      />
                      <input
                        type="text"
                        value={row.theirs || ''}
                        onChange={(e) => {
                          const newRows = [...comparisonRows];
                          newRows[index].theirs = e.target.value;
                          setComparisonRows(newRows);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Diğerleri"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setComparisonRows([...comparisonRows, { feature: '', ours: '', theirs: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Satır Ekle
                </button>
              </div>
            )}

            {/* SSS */}
            {formData.key === 'product_360sehpa_faqs' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sık Sorulan Sorular</h3>
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].question = e.target.value;
                          setFaqs(newFaqs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Soru"
                      />
                      <textarea
                        value={faq.answer || ''}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].answer = e.target.value;
                          setFaqs(newFaqs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Yanıt"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Soru Ekle
                </button>
              </div>
            )}

            {/* Teknik Özellikler */}
            {formData.key === 'product_360sehpa_specs' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
                {specs.map((spec, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={spec.label || ''}
                        onChange={(e) => {
                          const newSpecs = [...specs];
                          newSpecs[index].label = e.target.value;
                          setSpecs(newSpecs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Etiket (Örn: Malzeme)"
                      />
                      <input
                        type="text"
                        value={spec.value || ''}
                        onChange={(e) => {
                          const newSpecs = [...specs];
                          newSpecs[index].value = e.target.value;
                          setSpecs(newSpecs);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Değer (Örn: Çelik)"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Özellik Ekle
                </button>
              </div>
            )}

            {/* Ana Sayfa Özellikler */}
            {formData.key === 'features_section' && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ana Sayfa Özellikler</h3>
                {homeFeatures.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                    <button
                      type="button"
                      onClick={() => setHomeFeatures(homeFeatures.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={item.icon || ''}
                        onChange={(e) => {
                          const newItems = [...homeFeatures];
                          newItems[index].icon = e.target.value;
                          setHomeFeatures(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg md:col-span-2"
                        placeholder="İkon (Emoji veya Lucide adı)"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...homeFeatures];
                          newItems[index].title = e.target.value;
                          setHomeFeatures(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Başlık"
                      />
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => {
                          const newItems = [...homeFeatures];
                          newItems[index].description = e.target.value;
                          setHomeFeatures(newItems);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Açıklama"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setHomeFeatures([...homeFeatures, { icon: '', title: '', description: '' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" /> Yeni Özellik Ekle
                </button>
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
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
