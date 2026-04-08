'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

interface Announcement {
  id: string
  message: string
  link?: string
  bgColor: string
  textColor: string
  position: 'TOP_TICKER' | 'ANNOUNCEMENT_BAR'
  sortOrder: number
  isActive: boolean
  startDate?: string
  endDate?: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Announcements fetch error:', error)
      toast.error('Duyurular yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      if (response.ok) {
        toast.success('Duyuru başarıyla silindi')
        setAnnouncements(announcements.filter(a => a.id !== id))
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Duyuru silinirken hata oluştu')
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Duyuru Yönetimi</h1>
        <Link
          href="/duyurular/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Duyuru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duyuru
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pozisyon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Renk
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
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {announcement.message}
                    </p>
                    {announcement.link && (
                      <p className="text-xs text-blue-600 mt-1">{announcement.link}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {announcement.position === 'TOP_TICKER' ? 'Kayan Yazı' : 'Duyuru Barı'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: announcement.bgColor }}
                    />
                    <span className="text-xs text-gray-500">{announcement.bgColor}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {announcement.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/duyurular/edit/${announcement.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(announcement.id)}
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

        {announcements.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Henüz duyuru bulunmamaktadır.</p>
            <Link
              href="/duyurular/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              İlk Duyuruyu Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
