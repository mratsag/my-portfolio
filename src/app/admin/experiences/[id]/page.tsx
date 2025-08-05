'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { Experience } from '@/lib/types'

export default function ExperienceDetailPage() {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const experienceId = params.id as string

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/admin/experiences/${experienceId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Deneyim bulunamadı')
          } else {
            throw new Error('Deneyim yüklenirken hata oluştu')
          }
          return
        }

        const data = await response.json()
        setExperience(data.experience)
      } catch (err) {
        console.error('Error fetching experience:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    if (experienceId) {
      fetchExperience()
    }
  }, [experienceId])

  const handleDelete = async () => {
    if (!experience || !confirm('Bu deneyimi silmek istediğinizden emin misiniz?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Deneyim silinemedi')

      router.push('/admin/experiences')
    } catch (err) {
      console.error('Error deleting experience:', err)
      alert('Deneyim silinirken hata oluştu')
      setDeleting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const years = end.getFullYear() - start.getFullYear()
    const months = end.getMonth() - start.getMonth()
    
    let totalMonths = years * 12 + months
    if (end.getDate() < start.getDate()) {
      totalMonths--
    }
    
    const yearsResult = Math.floor(totalMonths / 12)
    const monthsResult = totalMonths % 12
    
    if (yearsResult > 0 && monthsResult > 0) {
      return `${yearsResult} yıl ${monthsResult} ay`
    } else if (yearsResult > 0) {
      return `${yearsResult} yıl`
    } else if (monthsResult > 0) {
      return `${monthsResult} ay`
    } else {
      return '1 ay'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {error || 'Deneyim Bulunamadı'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Görüntülemek istediğiniz deneyim bulunamadı.'}
        </p>
        <button
          onClick={() => router.push('/admin/experiences')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Deneyimlere Dön
        </button>
      </div>
    )
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
              Deneyim Detayı
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {experience.title} - {experience.company}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/admin/experiences/${experienceId}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Düzenle
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <TrashIcon className="w-4 h-4 mr-2" />
            )}
            Sil
          </button>
        </div>
      </div>

      {/* Experience Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Experience Header */}
        <div className={`border-l-4 ${
          experience.current 
            ? 'border-l-green-500 dark:border-l-green-400' 
            : 'border-l-blue-500 dark:border-l-blue-400'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {experience.title}
                  </h2>
                  {experience.current && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Devam Ediyor
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{experience.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{experience.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      {formatDate(experience.start_date)} - {experience.current ? 'Devam Ediyor' : formatDate(experience.end_date!)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>
                      {getDuration(experience.start_date, experience.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Description */}
          {experience.description && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Açıklama
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div 
                  className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: experience.description }}
                />
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>
                Oluşturulma: {formatDistanceToNow(new Date(experience.created_at), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </div>
              <div>
                Deneyim ID: {experience.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bu deneyimi düzenlemek veya silmek için yukarıdaki butonları kullanın.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/experiences')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Listeye Dön
            </button>
            <button
              onClick={() => router.push(`/admin/experiences/${experienceId}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 