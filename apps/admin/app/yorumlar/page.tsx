'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Testimonial {
  id: string
  name: string
  location?: string
  title: string
  content: string
  rating: number
  image?: string
  isActive: boolean
  sortOrder: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/testimonials`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Testimonials fetch error:', error)
      toast.error('Yorumlar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      if (response.ok) {
        toast.success('Yorum başarıyla silindi')
        setTestimonials(testimonials.filter(t => t.id !== id))
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Yorum silinirken hata oluştu')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900">Müşteri Yorumları</h1>
        <Link
          href="/yorumlar/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Yorum
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-gray-900">{testimonial.name}</h3>
                  {testimonial.location && (
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  )}
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  testimonial.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {testimonial.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>

            <div className="mb-3">
              {renderStars(testimonial.rating)}
            </div>

            <h4 className="text-sm font-medium text-gray-900 mb-2">{testimonial.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-4">{testimonial.content}</p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <span className="text-xs text-gray-400">Sıra: {testimonial.sortOrder}</span>
              <div className="flex space-x-2">
                <Link
                  href={`/yorumlar/edit/${testimonial.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Düzenle"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sil"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz müşteri yorumu bulunmamaktadır.</p>
          <Link
            href="/yorumlar/new"
            className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            İlk Yorumu Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
