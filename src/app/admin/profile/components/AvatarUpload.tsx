'use client'
// src/app/admin/profile/components/AvatarUpload.tsx

import { useState, useRef } from 'react'
import { 
  UserCircleIcon, 
  CameraIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase'

interface AvatarUploadProps {
  value?: string
  onChange: (url: string) => void
  fullName?: string
  maxSize?: number // MB cinsinden
}

export default function AvatarUpload({ 
  value, 
  onChange, 
  fullName = 'User',
  maxSize = 2 // 2MB default
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const uploadAvatar = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      // Dosya boyutu kontrolü
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`)
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yüklenebilir')
      }

      // Dosya adını unique yap
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      console.log('Uploading avatar:', fileName)

      // Önce bucket kontrolü
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('Buckets list error:', bucketsError)
        throw new Error('Storage erişiminde hata: ' + bucketsError.message)
      }

      const imagesBucket = buckets?.find((bucket: { name: string }) => bucket.name === 'images')
      if (!imagesBucket) {
        throw new Error('Storage bucket "images" bulunamadı. Lütfen Supabase Dashboard\'da "images" adında public bucket oluşturun.')
      }

      // Eski avatarı sil (eğer varsa)
      if (value && value.includes('avatars/')) {
        const oldPath = value.split('/').slice(-2).join('/')
        await supabase.storage.from('images').remove([oldPath])
      }

      // Yeni avatarı yükle
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Avatar upload error:', uploadError)
        throw new Error(uploadError.message || 'Avatar yüklenirken hata oluştu')
      }

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)

      console.log('Avatar uploaded successfully:', publicUrl)
      onChange(publicUrl)

    } catch (err) {
      console.error('Avatar upload error:', err)
      setError(err instanceof Error ? err.message : 'Avatar yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    await uploadAvatar(file)
    
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAvatar = () => {
    onChange('')
    setError(null)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  // İsimden initial harfleri al
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 dark:text-gray-500">
              <div className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                {getInitials(fullName)}
              </div>
            </div>
          )}
        </div>

        {/* Upload/Camera Button */}
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {uploading ? (
            <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <CameraIcon className="avatar-camera-icon" />
          )}
        </button>

        {/* Remove Button */}
        {value && !uploading && (
          <button
            type="button"
            onClick={removeAvatar}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
          >
            <XMarkIcon className="avatar-remove-icon" />
          </button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CameraIcon className="avatar-upload-icon" />
          {uploading ? 'Yükleniyor...' : value ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        JPG, PNG veya GIF formatında, maksimum {maxSize}MB boyutunda dosya yükleyebilirsiniz.
      </p>

      {/* Error Message */}
      {error && (
        <div className="flex items-start p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-md max-w-xs">
          <ExclamationTriangleIcon className="avatar-error-icon" />
          <div>
            <p className="font-medium">Hata:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {value && !uploading && !error && (
        <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-md">
          <div className="avatar-success-icon">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          Profil fotoğrafı güncellendi
        </div>
      )}
    </div>
  )
}