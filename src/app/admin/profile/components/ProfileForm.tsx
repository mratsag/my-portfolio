'use client'
// src/app/admin/profile/components/ProfileForm.tsx

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  UserIcon,
  BriefcaseIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import AvatarUpload from './AvatarUpload'
import { Profile } from '@/lib/types'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Ad soyad gereklidir').max(100, 'Ad soyad en fazla 100 karakter olabilir'),
  title: z.string().max(100, 'Ünvan en fazla 100 karakter olabilir').optional(),
  bio: z.string().max(1000, 'Biyografi en fazla 1000 karakter olabilir').optional(),
  location: z.string().max(100, 'Konum en fazla 100 karakter olabilir').optional(),
  phone: z.string().max(20, 'Telefon en fazla 20 karakter olabilir').optional(),
  website: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  linkedin: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  github: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  instagram: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal(''))
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData?: Profile
  onSuccess?: () => void
}

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      title: initialData?.title || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      linkedin: initialData?.linkedin || '',
      github: initialData?.github || '',
      instagram: initialData?.instagram || ''
    }
  })

  const watchedFullName = watch('full_name')

  useEffect(() => {
    if (initialData) {
      setValue('full_name', initialData.full_name || '')
      setValue('title', initialData.title || '')
      setValue('bio', initialData.bio || '')
      setValue('location', initialData.location || '')
      setValue('phone', initialData.phone || '')
      setValue('website', initialData.website || '')
      setValue('linkedin', initialData.linkedin || '')
      setValue('github', initialData.github || '')
      setValue('instagram', initialData.instagram || '')
      setAvatarUrl(initialData.avatar_url || '')
    }
  }, [initialData, setValue])

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    setSuccess(false)
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          avatar_url: avatarUrl
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      const result = await response.json()
      setSuccess(true)
      
      // Avatar URL'ini güncelle
      if (result.profile?.avatar_url) {
        setAvatarUrl(result.profile.avatar_url)
      }
      
      if (onSuccess) {
        onSuccess()
      }
      
      // Success mesajını 3 saniye sonra kaldır
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (error) {
      console.error('Profile update error:', error)
      alert(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profil Bilgileri
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kişisel bilgilerinizi ve iletişim bilgilerinizi güncelleyin
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Profil başarıyla güncellendi!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload
              value={avatarUrl}
              fullName={watchedFullName || 'User'}
              onChange={setAvatarUrl}
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <UserIcon className="form-icon" />
                Ad Soyad *
              </label>
              <input
                {...register('full_name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: Murat Sağ"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BriefcaseIcon className="form-icon" />
                Ünvan / Pozisyon
              </label>
              <input
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: Software Developer"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPinIcon className="form-icon" />
                Konum
              </label>
              <input
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: Karabük, Türkiye"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <PhoneIcon className="form-icon" />
                Telefon
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: +90 555 123 45 67"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <EnvelopeIcon className="form-icon" />
                Email
              </label>
              <input
                value={initialData?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                placeholder="Email değiştirilemez"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email adresi güvenlik nedeniyle değiştirilemez
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DocumentTextIcon className="form-icon" />
              Hakkımda / Biyografi
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bu bilgi portfolio sitenizde görüntülenecektir.
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sosyal Medya & İletişim
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <GlobeAltIcon className="form-icon" />
                Website
              </label>
                <input
                  {...register('website')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="social-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  LinkedIn
                </label>
                <input
                  {...register('linkedin')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin && (
                  <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="social-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  GitHub
                </label>
                <input
                  {...register('github')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://github.com/username"
                />
                {errors.github && (
                  <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="social-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.070-4.85.070-3.204 0-3.584-.012-4.849-.070-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  Instagram
                </label>
                <input
                  {...register('instagram')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://instagram.com/username"
                />
                {errors.instagram && (
                  <p className="text-red-500 text-sm mt-1">{errors.instagram.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !isDirty}
              
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  💡 İpuçları
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Profil fotoğrafınız profesyonel olmalıdır</li>
                    <li>Biyografi bölümünü kısa ve öz tutun</li>
                    <li>Sosyal medya linklerinizi eksiksiz doldurun</li>
                    <li>İletişim bilgilerinizi güncel tutun</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}