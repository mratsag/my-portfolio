'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Blog } from '@/lib/types'

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${blogId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog yazısı bulunamadı')
          } else {
            throw new Error('Blog yazısı yüklenirken hata oluştu')
          }
          return
        }

        const data = await response.json()
        setBlog(data.blog)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

  const handleDelete = async () => {
    if (!blog || !confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Blog yazısı silinemedi')

      router.push('/admin/blog')
    } catch (err) {
      console.error('Error deleting blog:', err)
      alert('Blog yazısı silinirken hata oluştu')
      setDeleting(false)
    }
  }

  const getTimeText = (date: string) => {
    const daysAgo = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (daysAgo === 0) return 'Bugün'
    if (daysAgo === 1) return '1 gün önce'
    if (daysAgo < 7) return `${daysAgo} gün önce`
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} hafta önce`
    return `${Math.floor(daysAgo / 30)} ay önce`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {error || 'Blog Yazısı Bulunamadı'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Görüntülemek istediğiniz blog yazısı bulunamadı.'}
        </p>
        <button
          onClick={() => router.push('/admin/blog')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Blog Yazılarına Dön
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
              Blog Yazısı Detayı
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {blog.title}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/admin/blog/${blogId}/edit`)}
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

      {/* Blog Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Blog Header */}
        <div className={`border-l-4 ${
          blog.published 
            ? 'border-l-green-500 dark:border-l-green-400' 
            : 'border-l-yellow-500 dark:border-l-yellow-400'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {blog.title}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    blog.published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {blog.published ? 'Yayınlandı' : 'Taslak'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span>{blog.author || 'Anonim'}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{getTimeText(blog.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    <span>{blog.views || 0} görüntülenme</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {blog.excerpt}
                </p>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-4 flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Body */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          {/* Meta Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>
                Oluşturulma: {formatDistanceToNow(new Date(blog.created_at), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </div>
              <div>
                Blog ID: {blog.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bu blog yazısını düzenlemek veya silmek için yukarıdaki butonları kullanın.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/blog')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Listeye Dön
            </button>
            <button
              onClick={() => router.push(`/admin/blog/${blogId}/edit`)}
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
