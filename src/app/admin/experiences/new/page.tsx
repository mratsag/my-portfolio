'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const experienceSchema = z.object({
  title: z.string().min(1, 'Pozisyon adı gereklidir').max(100, 'Pozisyon adı en fazla 100 karakter olabilir'),
  company: z.string().min(1, 'Şirket adı gereklidir').max(100, 'Şirket adı en fazla 100 karakter olabilir'),
  location: z.string().min(1, 'Konum gereklidir').max(100, 'Konum en fazla 100 karakter olabilir'),
  start_date: z.string().min(1, 'Başlangıç tarihi gereklidir'),
  end_date: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(2000, 'Açıklama en fazla 2000 karakter olabilir').optional()
})

type ExperienceFormData = z.infer<typeof experienceSchema>

export default function NewExperiencePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      current: false
    }
  })

  const watchedCurrent = watch('current')

  const onSubmit = async (data: ExperienceFormData) => {
    setLoading(true)
    setSuccess(false)
    
    try {
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      setSuccess(true)
      
      // 2 saniye sonra deneyimler sayfasına yönlendir
      setTimeout(() => {
        router.push('/admin/experiences')
      }, 2000)
      
    } catch (error) {
      console.error('Experience creation error:', error)
      alert(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Yeni Deneyim Ekle
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              İş deneyiminizi ekleyin
            </p>
          </div>
        </div>
      </div>

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
                Deneyim başarıyla eklendi! Deneyimler sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BriefcaseIcon className="form-icon" />
                Pozisyon *
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
                Şirket *
              </label>
              <input
                {...register('company')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: ABC Teknoloji"
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPinIcon className="form-icon" />
                Konum *
              </label>
              <input
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: İstanbul, Türkiye"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="form-icon" />
                Başlangıç Tarihi *
              </label>
              <input
                {...register('start_date')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="form-icon" />
                Bitiş Tarihi
              </label>
              <input
                {...register('end_date')}
                type="date"
                disabled={watchedCurrent}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Current Position */}
          <div className="flex items-center">
            <input
              {...register('current')}
              type="checkbox"
              id="current"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="current" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Bu pozisyonda hala çalışıyorum
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DocumentTextIcon className="form-icon" />
              Açıklama
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Bu pozisyonda yaptığınız işleri ve sorumluluklarınızı açıklayın..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bu bilgi portfolio sitenizde görüntülenecektir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ekleniyor...
                </div>
              ) : (
                'Deneyim Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
