'use client'
// src/app/admin/blog/page.tsx

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import { Blog } from '@/lib/types'

interface BlogsData {
  blogs: Blog[]
  stats: {
    total: number
    published: number
    draft: number
    views: number
  }
}

export default function BlogPage() {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter)
      }
      
      const response = await fetch(`/api/admin/blog?${params}`)
      if (!response.ok) throw new Error('Failed to fetch blogs')
      
      const data: BlogsData = await response.json()
      setBlogsData(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [filter])

  const handleAddBlog = () => {
    setEditingBlog(null)
    setIsFormOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    setIsFormOpen(true)
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(blogId)
    try {
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete blog')

      await fetchBlogs() // Refresh data
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Blog yazısı silinirken hata oluştu')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleFormSuccess = () => {
    fetchBlogs()
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list')
  }

  if (loading) {
    return (
      <div className="blog-loading-container">
        <div className="blog-loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      {/* Header */}
      <div className="blog-header">
        <div>
          <h1 className="blog-title">
            Blog Yazıları
          </h1>
          <p className="blog-subtitle">
            Blog yazılarınızı yönetin ve yayınlayın
          </p>
        </div>
        <div className="blog-header-actions">
          <button
            onClick={toggleViewMode}
            className="blog-view-toggle"
          >
            {viewMode === 'list' ? (
              <>
                <EyeSlashIcon className="blog-action-icon" />
                Grid Görünüm
              </>
            ) : (
              <>
                <EyeIcon className="blog-action-icon" />
                Liste Görünüm
              </>
            )}
          </button>
          <button
            onClick={handleAddBlog}
            className="blog-add-button"
          >
            <PlusIcon className="blog-action-icon" />
            Yeni Yazı
          </button>
        </div>
      </div>

      {/* Stats */}
      {blogsData && (
        <div className="blog-stats-grid">
          <div className="blog-stats-card">
            <div className="blog-stats-icon-wrapper blog-stats-total">
              <DocumentTextIcon className="blog-stats-icon" />
            </div>
            <div className="blog-stats-content">
              <p className="blog-stats-label">
                Toplam Yazı
              </p>
              <p className="blog-stats-value">
                {blogsData.stats.total}
              </p>
            </div>
          </div>

          <div className="blog-stats-card">
            <div className="blog-stats-icon-wrapper blog-stats-published">
              <ChartBarIcon className="blog-stats-icon" />
            </div>
            <div className="blog-stats-content">
              <p className="blog-stats-label">
                Yayınlanan
              </p>
              <p className="blog-stats-value">
                {blogsData.stats.published}
              </p>
            </div>
          </div>

          <div className="blog-stats-card">
            <div className="blog-stats-icon-wrapper blog-stats-draft">
              <CalendarIcon className="blog-stats-icon" />
            </div>
            <div className="blog-stats-content">
              <p className="blog-stats-label">
                Taslak
              </p>
              <p className="blog-stats-value">
                {blogsData.stats.draft}
              </p>
            </div>
          </div>

          <div className="blog-stats-card">
            <div className="blog-stats-icon-wrapper blog-stats-views">
              <EyeIcon className="blog-stats-icon" />
            </div>
            <div className="blog-stats-content">
              <p className="blog-stats-label">
                Toplam Görüntülenme
              </p>
              <p className="blog-stats-value">
                {blogsData.stats.views}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="blog-filter">
        <div className="blog-filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`blog-filter-button ${
              filter === 'all' ? 'blog-filter-active' : 'blog-filter-inactive'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`blog-filter-button ${
              filter === 'published' ? 'blog-filter-active' : 'blog-filter-inactive'
            }`}
          >
            Yayınlanan
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`blog-filter-button ${
              filter === 'draft' ? 'blog-filter-active' : 'blog-filter-inactive'
            }`}
          >
            Taslak
          </button>
        </div>
      </div>

      {/* Blogs List */}
      {blogsData && blogsData.blogs.length === 0 ? (
        <div className="blog-empty-container">
          <DocumentTextIcon className="blog-empty-icon" />
          <h3 className="blog-empty-title">
            Henüz blog yazısı yok
          </h3>
          <p className="blog-empty-text">
            İlk blog yazınızı ekleyerek başlayın
          </p>
          <button
            onClick={handleAddBlog}
            className="blog-add-button"
          >
            <PlusIcon className="blog-action-icon" />
            İlk Yazıyı Ekle
          </button>
        </div>
      ) : (
        <BlogList
          blogs={blogsData?.blogs || []}
          viewMode={viewMode}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          deleteLoading={deleteLoading}
        />
      )}

      {/* Blog Form Modal */}
      <BlogForm
        blog={editingBlog || undefined}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBlog(null)
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
