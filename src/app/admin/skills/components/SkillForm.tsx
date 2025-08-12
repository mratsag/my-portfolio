// src/app/admin/skills/components/SkillForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  XMarkIcon,
  PlusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Skill } from '@/lib/types'

const skillSchema = z.object({
  name: z.string().min(1, 'Yetenek adı gereklidir').max(50, 'Yetenek adı en fazla 50 karakter olabilir'),
  category: z.string().min(1, 'Kategori gereklidir').max(30, 'Kategori en fazla 30 karakter olabilir'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
})

type SkillFormData = z.infer<typeof skillSchema>

interface SkillFormProps {
  skill?: Skill
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  existingCategories: string[]
}

const skillLevels = [
  { value: 'beginner', label: 'Başlangıç', color: 'bg-red-500', percentage: 25 },
  { value: 'intermediate', label: 'Orta', color: 'bg-yellow-500', percentage: 50 },
  { value: 'advanced', label: 'İleri', color: 'bg-blue-500', percentage: 75 },
  { value: 'expert', label: 'Uzman', color: 'bg-green-500', percentage: 100 }
] as const

const commonSkillCategories = [
  'Frontend',
  'Backend', 
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Tools',
  'Programming Languages',
  'Frameworks',
  'Cloud Services'
]

export default function SkillForm({ 
  skill, 
  isOpen, 
  onClose, 
  onSuccess,
  existingCategories 
}: SkillFormProps) {
  const [loading, setLoading] = useState(false)
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || '',
      level: skill?.level || 'intermediate'
    }
  })

  const watchedCategory = watch('category')
  const watchedLevel = watch('level')

  const onSubmit = async (data: SkillFormData) => {
    setLoading(true)
    try {
      const url = skill 
        ? `/api/admin/skills/${skill.id}`
        : '/api/admin/skills'
      
      const method = skill ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      reset()
      onSuccess()
      onClose()
      
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    setValue('category', category)
    setShowCategorySuggestions(false)
  }

  const availableCategories = [
    ...new Set([
      ...commonSkillCategories,
      ...existingCategories
    ])
  ].filter(cat => 
    cat.toLowerCase().includes(watchedCategory.toLowerCase())
  ).slice(0, 8)

  const selectedLevelData = skillLevels.find(level => level.value === watchedLevel)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {skill ? 'Yetenek Düzenle' : 'Yeni Yetenek'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {skill ? 'Mevcut yeteneği düzenleyin' : 'Yeni bir yetenek ekleyin'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yetenek Adı *
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: React.js, Python, Photoshop"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori *
              </label>
              <input
                {...register('category')}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: Frontend, Backend, Design"
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}

              {/* Category Suggestions */}
              {showCategorySuggestions && availableCategories.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Seviye *
              </label>
              <div className="space-y-2">
                {skillLevels.map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      {...register('level')}
                      type="radio"
                      value={level.value}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {level.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {level.percentage}%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${level.color}`}
                          style={{ width: `${level.percentage}%` }}
                        />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.level && (
                <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
              )}
            </div>

            {/* Preview */}
            {watchedLevel && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Önizleme
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {watch('name') || 'Yetenek Adı'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedLevelData?.label}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${selectedLevelData?.color}`}
                    style={{ width: `${selectedLevelData?.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
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
                    Kaydediliyor...
                  </div>
                ) : (
                  skill ? 'Güncelle' : 'Ekle'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}