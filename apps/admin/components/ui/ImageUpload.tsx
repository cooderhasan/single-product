'use client'

import { useState, useRef } from 'react'
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Maksimum görsel kontrolü
    if (images.length + files.length > maxImages) {
      toast.error(`En fazla ${maxImages} görsel yükleyebilirsiniz`)
      return
    }

    // Dosya tipi kontrolü
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    const invalidFiles = Array.from(files).filter(f => !validTypes.includes(f.type))
    if (invalidFiles.length > 0) {
      toast.error('Sadece JPEG, PNG ve WebP formatları desteklenir')
      return
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024
    const oversizedFiles = Array.from(files).filter(f => f.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast.error('Dosya boyutu 5MB\'ı geçemez')
      return
    }

    setUploading(true)
    const token = localStorage.getItem('admin_token')

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/images`, {
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
      onChange([...images, ...data.urls])
      toast.success(`${files.length} görsel başarıyla yüklendi`)
    } catch (error) {
      toast.error('Görseller yüklenirken hata oluştu')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
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

  const setMainImage = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [mainImage] = newImages.splice(index, 1)
    newImages.unshift(mainImage)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Mevcut Görseller */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((url, index) => {
            // API URL'sini ekle (local uploads için)
            const getFullUrl = (u: string) => {
              if (!u) return '';
              if (u.startsWith('http')) return u;
              if (u.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL || ''}${u}`;
              // Eğer sadece dosya adıysa uploads klasöründen geldiğini varsay
              return `${process.env.NEXT_PUBLIC_API_URL || ''}/uploads/${u}`;
            };
            const fullUrl = typeof url === 'string' ? getFullUrl(url) : getFullUrl((url as any)?.url);
            return (
              <div
                key={index}
                className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${
                  index === 0 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                }`}
              >
                <img
                  src={fullUrl}
                  alt={`Ürün görseli ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3QgZmlsbD0iI2YzZjRmNiIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWNhM2FmIj5H8OZyc2VsPC90ZXh0Pjwvc3ZnPg=='
                  }}
                />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMainImage(index)}
                    className="p-2 bg-white rounded-full hover:bg-blue-100 transition-colors"
                    title="Ana görsel yap"
                  >
                    <PhotoIcon className="h-4 w-4 text-blue-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                  title="Kaldır"
                >
                  <XMarkIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>

              {/* Ana Görsel Etiketi */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                  Ana Görsel
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}

      {/* Upload Alanı */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-sm text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Görsel yüklemek için tıklayın veya sürükleyin
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP (max 5MB) - {images.length}/{maxImages}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bilgi */}
      <p className="text-xs text-gray-500">
        * İlk görsel ürün kartında ana görsel olarak gösterilir.
      </p>
    </div>
  )
}
