// src/app/admin/projects/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProjectForm from '../../components/ProjectForm'
import { Project } from '@/lib/types'

export default function EditProjectPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const handleSuccess = () => {
    router.push('/admin/projects')
  }

  if (loading) {
    return (
      <div className="edit-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="edit-page-container">
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
      <div className="edit-page-container">
        <div className="not-found-container">
          <h3 className="not-found-title">
            Proje Bulunamadı
          </h3>
          <p className="not-found-message">
            Düzenlemek istediğiniz proje bulunamadı.
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
    <div className="edit-page-container">
      <div className="edit-page-header">
        <h1 className="edit-page-title">
          Proje Düzenle
        </h1>
        <p className="edit-page-subtitle">
          &ldquo;{project.title}&rdquo; projesini düzenleyin
        </p>
      </div>

      <div className="edit-page-content">
        <ProjectForm project={project} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}