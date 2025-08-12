'use client'
// src/app/admin/projects/components/ImageUpload.tsx

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  maxSize?: number // MB cinsinden
  accept?: Record<string, string[]>
}

export default function ImageUpload({ 
  value, 
  onChange, 
  className = '',
  maxSize = 5, // 5MB default
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  }
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      // FormData oluştur
      const formData = new FormData()
      formData.append('file', file)

      // Session token'ı al
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Oturum bulunamadı')
      }

      // API route'a yükle
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Dosya yüklenirken hata oluştu')
      }

      const { url } = await response.json()
      
      setPreview(url)
      onChange(url)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Yükleme sırasında hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Dosya boyutu kontrolü
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`)
      return
    }

    await uploadImage(file)
  }, [maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading
  })

  const removeImage = () => {
    setPreview(null)
    onChange('')
    setError(null)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Dosya boyutu kontrolü
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`)
      return
    }

    await uploadImage(file)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {preview && (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Yükleniyor...
                </p>
              </div>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 text-gray-400">
                  {isDragActive ? (
                    <ArrowUpTrayIcon className="w-full h-full" />
                  ) : (
                    <PhotoIcon className="w-full h-full" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive ? 'Dosyayı bırakın' : 'Görsel yükleyin'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dosyayı sürükleyip bırakın veya tıklayarak seçin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    PNG, JPG, GIF, WebP (Maks. {maxSize}MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Manual File Input */}
      {!preview && !uploading && (
        <div className="text-center">
          <input
            type="file"
            id="manual-upload"
            accept={Object.values(accept).flat().join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="manual-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
          >
            <PhotoIcon className="w-4 h-4 mr-2" />
            Dosya Seç
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {preview && !uploading && (
        <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-md">
          <div className="w-5 h-5 mr-2 flex-shrink-0">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          Görsel başarıyla yüklendi
        </div>
      )}
    </div>
  )
}