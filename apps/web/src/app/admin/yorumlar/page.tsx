'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Star,
  Quote,
  Eye,
  EyeOff,
  User,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { testimonialsApi } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  location?: string;
  title: string;
  content: string;
  rating: number;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    location: '',
    title: '',
    content: '',
    rating: 5,
    image: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await testimonialsApi.getAllAdmin();
      setTestimonials(response.data || []);
    } catch (err: any) {
      console.error('Yorumlar yüklenirken hata:', err);
      setError('Yorumlar yüklenemedi. Lütfen sayfayı yenileyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.title || !formData.content) {
      setError('İsim, başlık ve içerik alanları zorunludur');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        rating: formData.rating || 5,
      };

      if (editingId) {
        await testimonialsApi.update(editingId, payload);
        showSuccess('Yorum başarıyla güncellendi');
      } else {
        await testimonialsApi.create(payload);
        showSuccess('Yorum başarıyla oluşturuldu');
      }

      await fetchTestimonials();
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
      name: '',
      location: '',
      title: '',
      content: '',
      rating: 5,
      image: '',
      isActive: true,
      sortOrder: testimonials.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setIsLoading(true);
      await testimonialsApi.delete(id);
      showSuccess('Yorum başarıyla silindi');
      await fetchTestimonials();
    } catch (err: any) {
      console.error('Silme hatası:', err);
      setError('Yorum silinemedi. Tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await testimonialsApi.update(testimonial.id, {
        ...testimonial,
        isActive: !testimonial.isActive,
      });
      showSuccess(`Yorum ${!testimonial.isActive ? 'aktif' : 'pasif'} duruma getirildi`);
      await fetchTestimonials();
    } catch (err: any) {
      console.error('Durum değiştirme hatası:', err);
      setError('Durum değiştirilemedi. Tekrar deneyin.');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '0';

  if (isLoading && testimonials.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Müşteri Yorumları</h1>
          <p className="text-gray-500">Müşteri değerlendirmelerini yönetin</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Yorum
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
          <p className="text-sm text-gray-500">Toplam Yorum</p>
          <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {testimonials.filter(t => t.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Ortalama Puan</p>
          <p className="text-2xl font-bold text-yellow-500">
            {averageRating}
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className={`bg-white rounded-xl shadow-sm overflow-hidden ${
              !testimonial.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-primary-200 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2">&ldquo;{testimonial.title}&rdquo;</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{testimonial.content}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sıra: {testimonial.sortOrder}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(testimonial)}
                    className={`p-2 rounded-lg transition-colors text-sm ${
                      testimonial.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={testimonial.isActive ? 'Pasif yap' : 'Aktif yap'}
                  >
                    {testimonial.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Henüz yorum eklenmemiş</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            İlk yorumu ekle
          </button>
        </div>
      )}

      {/* Edit/Add Modal */}
      {(editingId || isAddModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Yorumu Düzenle' : 'Yeni Yorum'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İsim <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ahmet Y."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="İstanbul"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yorum Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Harika bir ürün!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yorum İçeriği <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ürün hakkındaki düşünceleriniz..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puan</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (formData.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/images/musteri.jpg"
                />
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
