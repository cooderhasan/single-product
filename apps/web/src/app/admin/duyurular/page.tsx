'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Megaphone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { announcementsApi } from '@/lib/api';

interface Announcement {
  id: string;
  message: string;
  link?: string;
  bgColor: string;
  textColor: string;
  position: 'TOP_TICKER' | 'ANNOUNCEMENT_BAR';
  startDate?: string;
  endDate?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const colorOptions = [
  { value: 'primary-600', label: 'Ana Renk (600)' },
  { value: 'primary-700', label: 'Ana Renk (700)' },
  { value: 'green-600', label: 'Yeşil' },
  { value: 'red-600', label: 'Kırmızı' },
  { value: 'blue-600', label: 'Mavi' },
  { value: 'purple-600', label: 'Mor' },
  { value: 'orange-600', label: 'Turuncu' },
  { value: 'gray-800', label: 'Koyu Gri' },
];

const textColorOptions = [
  { value: 'white', label: 'Beyaz' },
  { value: 'black', label: 'Siyah' },
  { value: 'gray-100', label: 'Açık Gri' },
  { value: 'yellow-300', label: 'Sarı' },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    message: '',
    link: '',
    bgColor: 'primary-600',
    textColor: 'white',
    position: 'ANNOUNCEMENT_BAR',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await announcementsApi.getAllAdmin();
      setAnnouncements(response.data || []);
    } catch (err: any) {
      console.error('Duyurular yüklenirken hata:', err);
      setError('Duyurular yüklenemedi. Lütfen sayfayı yenileyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      ...announcement,
      startDate: announcement.startDate ? announcement.startDate.split('T')[0] : '',
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : '',
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.message) {
      setError('Mesaj alanı zorunludur');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };

      if (editingId) {
        await announcementsApi.update(editingId, payload);
        showSuccess('Duyuru başarıyla güncellendi');
      } else {
        await announcementsApi.create(payload);
        showSuccess('Duyuru başarıyla oluşturuldu');
      }

      await fetchAnnouncements();
      setEditingId(null);
      setIsAddModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Kaydetme hatası:', err);
      setError(err.response?.data?.message || 'Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      message: '',
      link: '',
      bgColor: 'primary-600',
      textColor: 'white',
      position: 'ANNOUNCEMENT_BAR',
      isActive: true,
      sortOrder: announcements.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setIsLoading(true);
      await announcementsApi.delete(id);
      showSuccess('Duyuru başarıyla silindi');
      await fetchAnnouncements();
    } catch (err: any) {
      console.error('Silme hatası:', err);
      setError('Duyuru silinemedi. Tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await announcementsApi.update(announcement.id, {
        ...announcement,
        isActive: !announcement.isActive,
      });
      showSuccess(`Duyuru ${!announcement.isActive ? 'aktif' : 'pasif'} duruma getirildi`);
      await fetchAnnouncements();
    } catch (err: any) {
      console.error('Durum değiştirme hatası:', err);
      setError('Durum değiştirilemedi. Tekrar deneyin.');
    }
  };

  const tickerAnnouncements = announcements.filter(a => a.position === 'TOP_TICKER');
  const barAnnouncements = announcements.filter(a => a.position === 'ANNOUNCEMENT_BAR');

  if (isLoading && announcements.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-500">Site duyurularını ve kayan yazıları yönetin</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Duyuru
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
          <p className="text-sm text-gray-500">Toplam Duyuru</p>
          <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {announcements.filter(a => a.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Kayan Yazı</p>
          <p className="text-2xl font-bold text-blue-600">
            {tickerAnnouncements.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Sabit Bar</p>
          <p className="text-2xl font-bold text-purple-600">
            {barAnnouncements.length}
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mesaj</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pozisyon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className={`hover:bg-gray-50 ${!announcement.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{announcement.message}</p>
                      {announcement.link && (
                        <p className="text-xs text-primary-600">{announcement.link}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      announcement.position === 'TOP_TICKER' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {announcement.position === 'TOP_TICKER' ? 'Kayan Yazı' : 'Sabit Bar'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-${announcement.bgColor}`} />
                      <span className="text-sm text-gray-600">{announcement.bgColor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{announcement.sortOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(announcement)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        announcement.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {announcement.isActive ? (
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
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(announcement.id)}
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

        {announcements.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Henüz duyuru eklenmemiş</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              İlk duyuruyu ekle
            </button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Önizleme</h2>
        
        {/* Ticker Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Kayan Yazı</p>
          <div className="bg-primary-600 text-white py-3 overflow-hidden rounded-lg">
            <div className="flex whitespace-nowrap animate-marquee">
              {tickerAnnouncements.filter(a => a.isActive).map((item, index) => (
                <span key={index} className="text-sm font-medium px-12 flex items-center">
                  <span className="mr-2">★</span>
                  {item.message}
                </span>
              ))}
              {tickerAnnouncements.filter(a => a.isActive).length === 0 && (
                <span className="text-sm font-medium px-12">Aktif kayan yazı bulunmuyor</span>
              )}
            </div>
          </div>
        </div>

        {/* Bar Preview */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Sabit Duyuru Barı</p>
          {barAnnouncements.filter(a => a.isActive).map((item, index) => (
            <div key={index} className={`bg-${item.bgColor} text-${item.textColor} py-2 text-center rounded-lg`}>
              <p className="text-sm font-semibold tracking-wide">{item.message}</p>
            </div>
          ))}
          {barAnnouncements.filter(a => a.isActive).length === 0 && (
            <div className="bg-gray-100 text-gray-500 py-2 text-center rounded-lg">
              <p className="text-sm">Aktif duyuru barı bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {(editingId || isAddModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Duyuru mesajınız..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/kampanya/indirim"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="ANNOUNCEMENT_BAR">Sabit Bar</option>
                    <option value="TOP_TICKER">Kayan Yazı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arka Plan Rengi</label>
                  <select
                    value={formData.bgColor}
                    onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Rengi</label>
                  <select
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {textColorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
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

              {/* Preview */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Önizleme</p>
                <div className="bg-gray-100 text-white py-2 text-center rounded-lg">
                  <p className="text-sm font-semibold tracking-wide">
                    {formData.message || 'Duyuru mesajı...'}
                  </p>
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
