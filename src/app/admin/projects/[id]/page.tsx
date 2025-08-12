'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LinkIcon,
  CodeBracketIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Project } from '@/lib/types'

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Proje bulunamadı')
          } else {
            throw new Error('Proje yüklenirken hata oluştu')
          }
          return
        }

        const data = await response.json()
        setProject(data.project)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleDelete = async () => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Proje silinirken hata oluştu')

      router.push('/admin/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Proje silinirken hata oluştu')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleFeatured = async () => {
    if (!project) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          featured: !project.featured
        }),
      })

      if (!response.ok) throw new Error('Proje güncellenirken hata oluştu')

      const updatedProject = await response.json()
      setProject(updatedProject.project)
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Proje güncellenirken hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="project-detail-container">
        <div className="error-container">
          <div className="error-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="error-title">
            Hata Oluştu
          </h3>
          <p className="error-message">
            {error}
          </p>
          <button
            onClick={() => router.back()}
            className="error-button"
          >
            Geri Dön
          </button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-detail-container">
        <div className="not-found-container">
          <h3 className="not-found-title">
            Proje Bulunamadı
          </h3>
          <p className="not-found-message">
            Görüntülemek istediğiniz proje bulunamadı.
          </p>
          <button
            onClick={() => router.push('/admin/projects')}
            className="not-found-button"
          >
            Projeler Listesine Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail-container">
      {/* Header */}
      <div className="project-detail-header">
        <div className="project-detail-header-left">
          <Link
            href="/admin/projects"
            className="back-button"
          >
            <ArrowLeftIcon className="icon" />
            Geri Dön
          </Link>
          <div className="project-detail-title-section">
            <div className="project-status-badge">
              <span className={`status-indicator ${project.status}`}>
                {project.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
              {project.featured && (
                <StarIconSolid className="featured-icon" />
              )}
            </div>
            <h1 className="project-detail-title">
              {project.title}
            </h1>
            <p className="project-detail-subtitle">
              {formatDistanceToNow(new Date(project.created_at), { 
                addSuffix: true, 
                locale: tr 
              })}
            </p>
          </div>
        </div>

        <div className="project-detail-actions">
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="project-action-btn edit"
          >
            <PencilIcon className="icon" />
            Düzenle
          </Link>
          
          <button
            onClick={handleToggleFeatured}
            className={`project-action-btn featured ${!project.featured ? 'inactive' : ''}`}
          >
            {project.featured ? (
              <StarIconSolid className="icon" />
            ) : (
              <StarIcon className="icon" />
            )}
            {project.featured ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="project-action-btn delete"
          >
            {deleteLoading ? (
              <div className="icon animate-spin border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <TrashIcon className="icon" />
            )}
            Sil
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="project-detail-content">
        {/* Image */}
        {project.image_url && (
          <div className="project-image-container">
            <img
              src={project.image_url}
              alt={project.title}
              className="project-image"
            />
          </div>
        )}

        {/* Description */}
        <div className="project-description">
          <h2 className="section-title">Açıklama</h2>
          <p className="description-text">
            {project.description}
          </p>
        </div>

        {/* Content */}
        {project.content && (
          <div className="project-content">
            <h2 className="section-title">Detaylı İçerik</h2>
            <div className="content-text">
              {project.content}
            </div>
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="project-technologies">
            <h2 className="section-title">Kullanılan Teknolojiler</h2>
            <div className="technologies-grid">
              {project.technologies.map((tech) => (
                <span key={tech} className="technology-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(project.demo_url || project.github_url) && (
          <div className="project-links">
            <h2 className="section-title">Linkler</h2>
            <div className="links-container">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link demo-link"
                >
                  <LinkIcon className="icon" />
                  Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link github-link"
                >
                  <CodeBracketIcon className="icon" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
