'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Layout,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { siteContentApi } from '@/lib/api';

interface SiteContent {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  data?: any;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const keyLabels: Record<string, string> = {
  product_showcase: 'Ürün Vitrini',
  features_section: 'Özellikler Bölümü',
  about_section: 'Hakkımızda Bölümü',
  contact_section: 'İletişim Bölümü',
  hero_banner: 'Hero Banner',
  footer_info: 'Footer Bilgisi',
};

export default function SiteContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteContent>>({
    key: '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    sortOrder: 0,
    data: {},
  });

  // Fetch site contents on mount
  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await siteContentApi.getAll();
      setContents(response.data || []);
    } catch (err: any) {
      console.error('Site içerikleri yüklenirken hata:', err);
      setError('Site içerikleri yüklenemedi. Lütfen sayfayı yenileyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEdit = (content: SiteContent) => {
    setEditingId(content.id);
    setFormData({
      key: content.key,
      title: content.title,
      subtitle: content.subtitle || '',
      description: content.description || '',
      image: content.image || '',
      buttonText: content.buttonText || '',
      buttonLink: content.buttonLink || '',
      isActive: content.isActive,
      sortOrder: content.sortOrder,
      data: content.data || {},
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.key || !formData.title) {
      setError('Anahtar ve başlık alanları zorunludur');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        data: typeof formData.data === 'string' 
          ? JSON.parse(formData.data) 
          : formData.data,
      };

      if (editingId) {
        // Update existing
        await siteContentApi.update(editingId, payload);
        showSuccess('İçerik başarıyla güncellendi');
      } else {
        // Create new
        await siteContentApi.create(payload);
        showSuccess('İçerik başarıyla oluşturuldu');
      }

      // Refresh data
      await fetchContents();
      
      // Reset form
      setEditingId(null);
      setIsAddModalOpen(false);
      setFormData({
        key: '',
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
        sortOrder: 0,
        data: {},
      });
    } catch (err: any) {
      console.error('Kaydetme hatası:', err);
      setError(err.response?.data?.message || 'Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setIsLoading(true);
      await siteContentApi.delete(id);
      showSuccess('İçerik başarıyla silindi');
      await fetchContents();
    } catch (err: any) {
      console.error('Silme hatası:', err);
      setError('İçerik silinemedi. Tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (content: SiteContent) => {
    try {
      await siteContentApi.update(content.id, {
        ...content,
        isActive: !content.isActive,
      });
      showSuccess(`İçerik ${!content.isActive ? 'aktif' : 'pasif'} duruma getirildi`);
      await fetchContents();
    } catch (err: any) {
      console.error('Durum değiştirme hatası:', err);
      setError('Durum değiştirilemedi. Tekrar deneyin.');
    }
  };

  const handleDataInputChange = (value: string) => {
    setFormData({ ...formData, data: value });
  };

  if (isLoading && contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site İçerikleri</h1>
          <p className="text-gray-500">Ana sayfa ve diğer sayfaların içeriklerini yönetin</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              key: '',
              title: '',
              subtitle: '',
              description: '',
              image: '',
              buttonText: '',
              buttonLink: '',
              isActive: true,
              sortOrder: contents.length + 1,
              data: {},
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni İçerik
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam İçerik</p>
          <p className="text-2xl font-bold text-gray-900">{contents.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {contents.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Pasif</p>
          <p className="text-2xl font-bold text-gray-600">
            {contents.filter(c => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* Contents List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anahtar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Güncelleme</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{content.sortOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {keyLabels[content.key] || content.key}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">{content.key}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{content.title}</p>
                      {content.subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-1">{content.subtitle}</p>
                      )}
                    </div>
                  </td>
                   <td className="px-6 py-4">
                     {content.image ? (
                       <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                         <img 
                           src={content.image} 
                           alt="" 
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                             const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                             if (placeholder) placeholder.style.display = 'flex';
                           }}
                         />
                         <div className="absolute inset-0 items-center justify-center hidden">
                           <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                         </div>
                       </div>
                     ) : (
                       <span className="text-sm text-gray-400">-</span>
                     )}
                   </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(content)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        content.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {content.isActive ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Pasif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {content.updatedAt 
                        ? new Date(content.updatedAt).toLocaleDateString('tr-TR')
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(content)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(content.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Henüz içerik eklenmemiş</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              İlk içeriği ekle
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editingId || isAddModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'İçeriği Düzenle' : 'Yeni İçerik'}
              </h2>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setIsAddModalOpen(false);
                  setError(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anahtar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    disabled={!!editingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="ornek_icerik"
                  />
                  <p className="text-xs text-gray-500 mt-1">Benzersiz anahtar (örn: product_showcase)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/images/ornek.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                  <input
                    type="text"
                    value={formData.buttonText || ''}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton Linki</label>
                  <input
                    type="text"
                    value={formData.buttonLink || ''}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ek Veriler (JSON)
                </label>
                <textarea
                  value={typeof formData.data === 'object' ? JSON.stringify(formData.data, null, 2) : formData.data}
                  onChange={(e) => handleDataInputChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"features": ["Özellik 1", "Özellik 2"]}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  JSON formatında ek veriler (örn: özellikler listesi)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsAddModalOpen(false);
                  setError(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
