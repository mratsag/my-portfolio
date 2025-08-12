'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import ExperienceForm from '../../components/ExperienceForm'
import { Experience } from '@/lib/types'

export default function EditExperiencePage() {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/experiences')
    }, 2000)
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
          {error || 'Düzenlemek istediğiniz deneyim bulunamadı.'}
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
              Deneyimi Düzenle
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {experience.title} - {experience.company}
            </p>
          </div>
        </div>
      </div>

      {/* Experience Form */}
      <ExperienceForm experience={experience} onSuccess={handleSuccess} />
    </div>
  )
}
