'use client'

import { useState, useRef } from 'react'
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SingleImageUploadProps {
  image: string
  onChange: (image: string) => void
  label?: string
}

export function SingleImageUpload({ image, onChange, label }: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const getFullUrl = (u: string) => {
    if (!u) return ''
    if (u.startsWith('http')) return u
    if (u.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL || ''}${u}`
    return `${process.env.NEXT_PUBLIC_API_URL || ''}/uploads/${u}`
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Dosya tipi kontrolü
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Sadece JPEG, PNG ve WebP formatları desteklenir')
      return
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Dosya boyutu 5MB\'ı geçemez')
      return
    }

    setUploading(true)
    const token = localStorage.getItem('admin_token')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/image/banner`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Yükleme başarısız')
      }

      const data = await response.json()
      onChange(data.url)
      toast.success('Görsel başarıyla yüklendi')
    } catch (error) {
      toast.error('Görsel yüklenirken hata oluştu')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {/* Mevcut Görsel */}
      {image && (
        <div className="relative group w-full max-w-xs aspect-video rounded-lg border-2 border-gray-200 overflow-hidden">
          <img
            src={getFullUrl(image)}
            alt={label || 'Görsel'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3QgZmlsbD0iI2YzZjRmNiIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWNhM2FmIj5H8OZyc2VsPC90ZXh0Pjwvc3ZnPg=='
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
              title="Kaldır"
            >
              <XMarkIcon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Alanı */}
      {!image && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Görsel yüklemek için tıklayın veya sürükleyin
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
