'use client'
// src/app/admin/projects/components/ProjectForm.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  PhotoIcon, 
  LinkIcon, 
  CodeBracketIcon,
  EyeIcon,
  XMarkIcon,
  PlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import ImageUpload from './ImageUpload'
import RichTextEditor from '../blog/components/RichTextEditor'
import { Project } from '@/lib/types'

const projectSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(1, 'Açıklama gereklidir').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  content: z.string().min(1, 'Proje detayları gereklidir'),
  demo_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  github_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(['draft', 'published'])
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
}

const commonTechnologies = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Express', 'Nest.js', 'Python', 'Django', 'Flask',
  'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub'
]

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(project?.image_url || '')
  const [newTechnology, setNewTechnology] = useState('')
  const [showTechSuggestions, setShowTechSuggestions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      content: project?.content || '',
      demo_url: project?.demo_url || '',
      github_url: project?.github_url || '',
      technologies: project?.technologies || [],
      featured: project?.featured || false,
      status: project?.status || 'draft'
    }
  })

  const watchedTechnologies = watch('technologies')
  const watchedTitle = watch('title')
  const watchedDescription = watch('description')
  const watchedContent = watch('content')

  // image_url is handled separately from the form

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true)
    try {
      const url = project 
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects'
      
      const method = project ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image_url: imageUrl
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/projects')
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const addTechnology = (tech: string) => {
    if (tech && !watchedTechnologies.includes(tech)) {
      setValue('technologies', [...watchedTechnologies, tech])
      setNewTechnology('')
      setShowTechSuggestions(false)
    }
  }

  const removeTechnology = (tech: string) => {
    setValue('technologies', watchedTechnologies.filter(t => t !== tech))
  }

  const handleNewTechnologySubmit = () => {
    if (newTechnology.trim()) {
      addTechnology(newTechnology.trim())
    }
  }

  const filteredSuggestions = commonTechnologies.filter(
    tech => tech.toLowerCase().includes(newTechnology.toLowerCase()) && 
    !watchedTechnologies.includes(tech)
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Proje bilgilerini ve detaylarını güncelleyin
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DocumentTextIcon className="icon-sm" />
                Proje Başlığı *
              </label>
              <input
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Örn: E-Ticaret Web Sitesi"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DocumentTextIcon className="icon-sm" />
                Kısa Açıklama *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Projenin kısa açıklaması..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <PhotoIcon className="icon-sm" />
              Proje Görseli
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              className="image-upload-container"
            />
          </div>

          {/* Rich Text Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <DocumentTextIcon className="icon-sm" />
                Proje Detayları *
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {showPreview ? (
                  <>
                    <DocumentTextIcon className="w-4 h-4 mr-1" />
                    Düzenle
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Önizle
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className="prose prose-sm max-w-none dark:prose-invert bg-gray-50 dark:bg-gray-900 p-4 rounded-md border">
                <div dangerouslySetInnerHTML={{ __html: watchedContent }} />
              </div>
            ) : (
              <RichTextEditor
                value={watchedContent}
                onChange={(value) => setValue('content', value)}
                placeholder="Proje detaylarını yazın... Teknolojiler, özellikler, zorluklar ve çözümler hakkında detaylı bilgi verin."
              />
            )}
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <LinkIcon className="icon-sm" />
                Demo URL
              </label>
              <input
                {...register('demo_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com"
              />
              {errors.demo_url && (
                <p className="text-red-500 text-sm mt-1">{errors.demo_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CodeBracketIcon className="icon-sm" />
                GitHub URL
              </label>
              <input
                {...register('github_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
              {errors.github_url && (
                <p className="text-red-500 text-sm mt-1">{errors.github_url.message}</p>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kullanılan Teknolojiler
            </label>
            
            {/* Current Technologies */}
            {watchedTechnologies && watchedTechnologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {watchedTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Technology */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => {
                    setNewTechnology(e.target.value)
                    setShowTechSuggestions(e.target.value.length > 0)
                  }}
                  onBlur={() => setTimeout(() => setShowTechSuggestions(false), 200)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Teknoloji adı yazın..."
                />
                <button
                  type="button"
                  onClick={handleNewTechnologySubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              {showTechSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-auto">
                  {filteredSuggestions.slice(0, 8).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addTechnology(tech)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Öne çıkan proje olarak göster
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>
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
                  Kaydediliyor...
                </div>
              ) : (
                project ? 'Güncelle' : 'Oluştur'
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
                  💡 Proje Detayları İpuçları
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Projenin amacını ve çözdüğü problemi açıklayın</li>
                    <li>Kullanılan teknolojileri ve neden seçildiğini belirtin</li>
                    <li>Karşılaştığınız zorlukları ve çözümlerinizi paylaşın</li>
                    <li>Projenin özelliklerini ve kullanıcı deneyimini anlatın</li>
                    <li>Gelecek planları ve geliştirme fikirlerini ekleyin</li>
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