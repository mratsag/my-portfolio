'use client'

import { useState } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { Blog } from '@/lib/types'

interface BlogCardProps {
  blog: Blog
  onEdit: (blog: Blog) => void
  onDelete: (blogId: string) => void
  onTogglePublish: (blogId: string, published: boolean) => void
  isDeleting: boolean
}

export default function BlogCard({ 
  blog, 
  onEdit, 
  onDelete, 
  onTogglePublish,
  isDeleting 
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const blogDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - blogDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return '1 gün önce'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    return `${Math.floor(diffDays / 30)} ay önce`
  }

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        isHovered ? 'shadow-md border-gray-300 dark:border-gray-600' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
              {blog.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                <span>{blog.author || 'Anonim'}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>{getTimeAgo(blog.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            blog.published
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {blog.published ? 'Yayınlandı' : 'Taslak'}
          </span>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{blog.tags.length - 3} daha
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>{blog.views || 0} görüntülenme</span>
          <span>{formatDate(blog.created_at)}</span>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTogglePublish(blog.id, !blog.published)}
              className={`p-2 rounded-md transition-colors ${
                blog.published
                  ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              title={blog.published ? 'Yayından kaldır' : 'Yayınla'}
            >
              {blog.published ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(blog)}
              className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              title="Düzenle"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete(blog.id)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sil"
            >
              {isDeleting ? (
                <div className="w-4 h-4 animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
              ) : (
                <TrashIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
