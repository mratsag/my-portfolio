'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import ExperienceForm from '../components/ExperienceForm'

export default function NewExperiencePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/experiences')
    }, 2000)
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
              Yeni bir iş deneyimi ekleyin
            </p>
          </div>
        </div>
      </div>

      {/* Experience Form */}
      <ExperienceForm 
        experience={undefined} 
        isOpen={true}
        onClose={() => router.push('/admin/experiences')}
        onSuccess={handleSuccess} 
      />
    </div>
  )
}
