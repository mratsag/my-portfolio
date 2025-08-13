'use client'
// src/app/admin/blog/components/BlogForm.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  XMarkIcon,
  DocumentTextIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Blog } from '@/lib/types'
import RichTextEditor from './RichTextEditor'
import TagManager from './TagManager'

const blogSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(200, 'Başlık en fazla 200 karakter olabilir'),
  excerpt: z.string().max(500, 'Özet en fazla 500 karakter olabilir').optional(),
  content: z.string().min(1, 'İçerik gereklidir'),
  author: z.string().max(100, 'Yazar adı en fazla 100 karakter olabilir').optional(),
  tags: z.array(z.string()).max(10, 'En fazla 10 etiket ekleyebilirsiniz').optional(),
  published: z.boolean()
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogFormProps {
  blog?: Blog
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BlogForm({ 
  blog, 
  isOpen, 
  onClose, 
  onSuccess 
}: BlogFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || '',
      excerpt: blog?.excerpt || '',
      content: blog?.content || '',
      author: blog?.author || '',
      tags: blog?.tags || [],
      published: blog?.published || false
    }
  })

  const watchedContent = watch('content')
  const watchedTitle = watch('title')

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true)
    try {
      const url = blog 
        ? `/api/admin/blog/${blog.id}`
        : '/api/admin/blog'
      
      const method = blog ? 'PUT' : 'POST'
      
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

  const handleContentChange = (content: string) => {
    setValue('content', content)
  }

  const handleTagsChange = (tags: string[]) => {
    setValue('tags', tags)
  }

  if (!isOpen) return null

  return (
    <div className="blog-form-overlay">
      <div className="blog-form-container">
        {/* Header */}
        <div className="blog-form-header">
          <div className="blog-form-header-content">
            <div className="blog-form-icon-wrapper">
              <DocumentTextIcon className="blog-form-icon" />
            </div>
            <div>
              <h2 className="blog-form-title">
                {blog ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
              </h2>
              <p className="blog-form-subtitle">
                {blog ? 'Mevcut blog yazısını düzenleyin' : 'Yeni bir blog yazısı oluşturun'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="blog-form-close"
          >
            <XMarkIcon className="blog-form-close-icon" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
          <div className="blog-form-grid">
            {/* Title */}
            <div className="blog-form-field">
              <label className="blog-form-label">
                Başlık *
              </label>
              <input
                {...register('title')}
                className="blog-form-input"
                placeholder="Blog yazısının başlığını girin..."
              />
              {errors.title && (
                <p className="blog-form-error">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="blog-form-field">
              <label className="blog-form-label">
                Yazar
              </label>
              <input
                {...register('author')}
                className="blog-form-input"
                placeholder="Yazar adını girin..."
              />
              {errors.author && (
                <p className="blog-form-error">{errors.author.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="blog-form-field blog-form-field-full">
              <label className="blog-form-label">
                Özet
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="blog-form-textarea"
                placeholder="Blog yazısının kısa özetini girin..."
              />
              {errors.excerpt && (
                <p className="blog-form-error">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Published */}
            <div className="blog-form-field">
              <label className="blog-form-label">
                Yayın Durumu
              </label>
              <div className="blog-form-checkbox">
                <input
                  {...register('published')}
                  type="checkbox"
                  className="blog-form-checkbox-input"
                />
                <span className="blog-form-checkbox-label">
                  Yazıyı yayınla
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="blog-form-field">
            <div className="blog-form-content-header">
              <label className="blog-form-label">
                İçerik *
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="blog-form-preview-toggle"
              >
                {showPreview ? (
                  <>
                    <EyeSlashIcon className="blog-form-preview-icon" />
                    Düzenleme Modu
                  </>
                ) : (
                  <>
                    <EyeIcon className="blog-form-preview-icon" />
                    Önizleme
                  </>
                )}
              </button>
            </div>
            
            {showPreview ? (
              <div className="blog-form-preview">
                <h1 className="blog-form-preview-title">{watchedTitle}</h1>
                <div 
                  className="blog-form-preview-content"
                  dangerouslySetInnerHTML={{ __html: watchedContent }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={watchedContent}
                onChange={handleContentChange}
                placeholder="Blog yazısının içeriğini girin..."
              />
            )}
            
            {errors.content && (
              <p className="blog-form-error">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="blog-form-field">
            <label className="blog-form-label">
              Etiketler
            </label>
            <TagManager
              tags={watch('tags') || []}
              onChange={handleTagsChange}
              maxTags={10}
            />
            {errors.tags && (
              <p className="blog-form-error">{errors.tags.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="blog-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="blog-form-cancel"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="blog-form-save"
            >
              {loading ? (
                <div className="blog-form-loading"></div>
              ) : (
                <CheckIcon className="blog-form-save-icon" />
              )}
              {loading ? 'Kaydediliyor...' : (blog ? 'Güncelle' : 'Yayınla')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
