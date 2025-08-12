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
  PlusIcon
} from '@heroicons/react/24/outline'
import ImageUpload from './ImageUpload'
import { Project } from '@/lib/types'

const projectSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(1, 'Açıklama gereklidir').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  content: z.string().optional(),
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

      const result = await response.json()
      
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
    const currentTech = watchedTechnologies || []
    if (!currentTech.includes(tech)) {
      setValue('technologies', [...currentTech, tech])
    }
    setNewTechnology('')
    setShowTechSuggestions(false)
  }

  const removeTechnology = (tech: string) => {
    const currentTech = watchedTechnologies || []
    setValue('technologies', currentTech.filter(t => t !== tech))
  }

  const handleNewTechnologySubmit = () => {
    if (newTechnology.trim()) {
      addTechnology(newTechnology.trim())
    }
  }

  const filteredSuggestions = commonTechnologies.filter(tech =>
    tech.toLowerCase().includes(newTechnology.toLowerCase()) &&
    !watchedTechnologies?.includes(tech)
  )

  return (
    <div className="project-form-container">
      <div className="project-form-card">
        <div className="project-form-header">
          <h2 className="project-form-title">
            {project ? 'Proje Düzenle' : 'Yeni Proje'}
          </h2>
          <p className="project-form-subtitle">
            {project ? 'Mevcut projeyi düzenleyin' : 'Portfolio\'nüze yeni bir proje ekleyin'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="project-form">
          {/* Basic Info */}
          <div className="form-section">
            <div className="form-field full-width">
              <label className="form-label">
                Proje Başlığı *
              </label>
              <input
                {...register('title')}
                className="form-input"
                placeholder="Örn: E-ticaret Web Sitesi"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div className="form-field full-width">
              <label className="form-label">
                Kısa Açıklama *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="form-textarea"
                placeholder="Projenizin kısa bir açıklamasını yazın..."
              />
              <div className="form-field-footer">
                <span className="char-counter">
                  {watchedDescription?.length || 0}/1000 karakter
                </span>
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-field">
            <label className="form-label">
              Proje Görseli
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              className="image-upload-container"
            />
          </div>

          {/* URLs */}
          <div className="form-section">
            <div className="form-field">
              <label className="form-label">
                <LinkIcon className="icon-sm" />
                Demo URL
              </label>
              <input
                {...register('demo_url')}
                type="url"
                className="form-input"
                placeholder="https://example.com"
              />
              {errors.demo_url && (
                <p className="form-error">{errors.demo_url.message}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <CodeBracketIcon className="icon-sm" />
                GitHub URL
              </label>
              <input
                {...register('github_url')}
                type="url"
                className="form-input"
                placeholder="https://github.com/username/repo"
              />
              {errors.github_url && (
                <p className="form-error">{errors.github_url.message}</p>
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
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="form-field full-width">
            <label className="form-label">
              Detaylı Açıklama
            </label>
            <textarea
              {...register('content')}
              rows={8}
              className="form-textarea"
              placeholder="Projeniz hakkında detaylı bilgi verin. Markdown formatını kullanabilirsiniz..."
            />
          </div>

          {/* Options */}
          <div className="form-section">
            <div className="form-field">
              <label className="form-label">
                Durum
              </label>
              <select
                {...register('status')}
                className="form-input"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label checkbox-label">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="form-checkbox"
                />
                <span>Öne çıkarılsın</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="btn-loading">
                  <div className="btn-spinner"></div>
                  Kaydediliyor...
                </div>
              ) : (
                project ? 'Güncelle' : 'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}