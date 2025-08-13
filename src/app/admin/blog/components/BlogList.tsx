'use client'
// src/app/admin/blog/components/BlogList.tsx

import { 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Blog } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface BlogListProps {
  blogs: Blog[]
  viewMode: 'list' | 'grid'
  onEdit: (blog: Blog) => void
  onDelete: (blogId: string) => void
  deleteLoading: string | null
}

export default function BlogList({ 
  blogs, 
  viewMode, 
  onEdit, 
  onDelete, 
  deleteLoading 
}: BlogListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (viewMode === 'grid') {
    return (
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-card-header">
              <div className="blog-card-title-section">
                <h3 className="blog-card-title">
                  {blog.title}
                </h3>
                <div className="blog-card-meta">
                  <div className="blog-card-meta-item">
                    <CalendarIcon className="blog-meta-icon" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <div className="blog-card-meta-item">
                    <UserIcon className="blog-meta-icon" />
                    <span>{blog.author || 'Anonim'}</span>
                  </div>
                </div>
              </div>
              
              <div className="blog-card-actions">
                <button
                  onClick={() => onEdit(blog)}
                  className="blog-action-button blog-edit-button"
                  title="Düzenle"
                >
                  <PencilIcon className="blog-action-icon" />
                </button>
                <button
                  onClick={() => onDelete(blog.id)}
                  disabled={deleteLoading === blog.id}
                  className="blog-action-button blog-delete-button"
                  title="Sil"
                >
                  {deleteLoading === blog.id ? (
                    <div className="blog-loading-spinner"></div>
                  ) : (
                    <TrashIcon className="blog-action-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="blog-card-content">
              {blog.excerpt && (
                <p className="blog-card-excerpt">
                  {truncateText(blog.excerpt, 150)}
                </p>
              )}
              
              {blog.content && (
                <p className="blog-card-content-text">
                  {truncateText(blog.content.replace(/<[^>]*>/g, ''), 200)}
                </p>
              )}

              <div className="blog-card-tags">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags">
                    <TagIcon className="blog-tag-icon" />
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="blog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="blog-card-footer">
              <div className="blog-card-status">
                <span className="blog-status-badge blog-status-published">
                  Yayınlandı
                </span>
              </div>
              
              <div className="blog-card-stats">
                <div className="blog-stat-item">
                  <EyeIcon className="blog-stat-icon" />
                  <span>{blog.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="blog-table-container">
      <table className="blog-table">
        <thead>
          <tr>
            <th className="blog-table-header">Başlık</th>
            <th className="blog-table-header">Yazar</th>
            <th className="blog-table-header">Durum</th>
            <th className="blog-table-header">Tarih</th>
            <th className="blog-table-header">Görüntülenme</th>
            <th className="blog-table-header">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="blog-table-row">
              <td className="blog-table-cell">
                <div className="blog-cell-content">
                  <h4 className="blog-cell-title">
                    {blog.title}
                  </h4>
                  {blog.excerpt && (
                    <p className="blog-cell-excerpt">
                      {truncateText(blog.excerpt, 100)}
                    </p>
                  )}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-cell-tags">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blog-cell-tag">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="blog-cell-tag-more">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="blog-table-cell">
                <div className="blog-cell-author">
                  <UserIcon className="blog-cell-icon" />
                  <span>{blog.author || 'Anonim'}</span>
                </div>
              </td>
              <td className="blog-table-cell">
                <span className="blog-status-badge blog-status-published">
                  Yayınlandı
                </span>
              </td>
              <td className="blog-table-cell">
                <div className="blog-cell-date">
                  <CalendarIcon className="blog-cell-icon" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              </td>
              <td className="blog-table-cell">
                <div className="blog-cell-views">
                  <EyeIcon className="blog-cell-icon" />
                  <span>{blog.views || 0}</span>
                </div>
              </td>
              <td className="blog-table-cell">
                <div className="blog-cell-actions">
                  <button
                    onClick={() => onEdit(blog)}
                    className="blog-action-button blog-edit-button"
                    title="Düzenle"
                  >
                    <PencilIcon className="blog-action-icon" />
                  </button>
                  <button
                    onClick={() => onDelete(blog.id)}
                    disabled={deleteLoading === blog.id}
                    className="blog-action-button blog-delete-button"
                    title="Sil"
                  >
                    {deleteLoading === blog.id ? (
                      <div className="blog-loading-spinner"></div>
                    ) : (
                      <TrashIcon className="blog-action-icon" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
