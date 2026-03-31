'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Tag, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const coupons = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'PERCENTAGE',
    value: 10,
    minOrderAmount: 500,
    maxDiscount: 500,
    usageLimit: 100,
    usageCount: 45,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
  },
  {
    id: '2',
    code: 'INDIRIM100',
    type: 'FIXED_AMOUNT',
    value: 100,
    minOrderAmount: 1000,
    maxDiscount: null,
    usageLimit: 50,
    usageCount: 23,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    isActive: true,
  },
  {
    id: '3',
    code: 'KARGOBEDAVA',
    type: 'FREE_SHIPPING',
    value: 0,
    minOrderAmount: 1000,
    maxDiscount: null,
    usageLimit: 200,
    usageCount: 156,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    isActive: false,
  },
];

const typeLabels: Record<string, string> = {
  PERCENTAGE: 'Yüzde İndirim',
  FIXED_AMOUNT: 'Sabit Tutar',
  FREE_SHIPPING: 'Ücretsiz Kargo',
};

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string>('');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Kupon kodu kopyalandı');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuponlar</h1>
          <p className="text-gray-500">İndirim kuponlarını yönetin</p>
        </div>
        <Link
          href="/admin/kuponlar/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kupon
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Kupon</p>
          <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">{coupons.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Pasif</p>
          <p className="text-2xl font-bold text-gray-600">{coupons.filter(c => !c.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Kullanım</p>
          <p className="text-2xl font-bold text-primary-600">
            {coupons.reduce((acc, c) => acc + c.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Değer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min. Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanım</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geçerlilik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        {copiedCode === coupon.code ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{typeLabels[coupon.type]}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {coupon.type === 'PERCENTAGE' ? `%${coupon.value}` : `${coupon.value} ₺`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.minOrderAmount.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {coupon.usageCount}/{coupon.usageLimit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{coupon.startDate}</div>
                    <div className="text-xs text-gray-400">{coupon.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
