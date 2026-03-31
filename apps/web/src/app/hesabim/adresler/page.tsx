'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Edit2, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Address } from '@/types';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, router]);

  const fetchAddresses = async () => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik demo veri
      setAddresses([
        {
          id: '1',
          title: 'Ev',
          fullName: 'Ahmet Yılmaz',
          phone: '0555 123 45 67',
          city: 'İstanbul',
          district: 'Kadıköy',
          neighborhood: 'Caferağa',
          address: 'Örnek Sokak No:5 D:3',
          zipCode: '34710',
          isDefault: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    
    try {
      // API entegrasyonu burada yapılacak
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Adres silindi');
    } catch {
      toast.error('Bir hata oluştu');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // API entegrasyonu burada yapılacak
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
      toast.success('Varsayılan adres güncellendi');
    } catch {
      toast.error('Bir hata oluştu');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
            <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Adres Ekle
          </button>
        </div>

        {showForm && (
          <AddressForm
            address={editingAddress}
            onClose={() => setShowForm(false)}
            onSave={(address) => {
              if (editingAddress) {
                setAddresses(addresses.map(a => a.id === address.id ? address : a));
              } else {
                setAddresses([...addresses, { ...address, id: Date.now().toString() }]);
              }
              setShowForm(false);
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Adresler yükleniyor...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz Adres Eklenmemiş</h2>
            <p className="text-gray-600 mb-6">Teslimat adresi ekleyerek sipariş vermeye başlayabilirsiniz.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adres Ekle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-colors ${
                  address.isDefault ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">{address.title}</span>
                    {address.isDefault && (
                      <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                  <p>{address.neighborhood}, {address.district}</p>
                  <p>{address.city} {address.zipCode}</p>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Varsayılan olarak ayarla
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Address Form Component
interface AddressFormProps {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

function AddressForm({ address, onClose, onSave }: AddressFormProps) {
  const [formData, setFormData] = useState({
    title: address?.title || '',
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    city: address?.city || '',
    district: address?.district || '',
    neighborhood: address?.neighborhood || '',
    address: address?.address || '',
    zipCode: address?.zipCode || '',
    isDefault: address?.isDefault || false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API entegrasyonu burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave({
        ...formData,
        id: address?.id || Date.now().toString(),
      } as Address);
      toast.success(address ? 'Adres güncellendi' : 'Adres eklendi');
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {address ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres Başlığı</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ev, İş, vb."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0555 123 45 67"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Seçiniz</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mahalle</label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="Sokak, bina no, daire no"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">Varsayılan adres olarak ayarla</span>
        </label>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-700 font-medium"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
