'use client'
// src/app/admin/experiences/page.tsx

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import ExperienceList from './components/ExperienceList'

import { Experience } from '@/lib/types'

interface ExperiencesData {
  experiences: Experience[]
  stats: {
    total: number
    current: number
    past: number
    byDuration: Record<string, number>
  }
}

export default function ExperiencesPage() {
  const [experiencesData, setExperiencesData] = useState<ExperiencesData | null>(null)
  const [loading, setLoading] = useState(true)

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/experiences')
      if (!response.ok) throw new Error('Failed to fetch experiences')
      
      const data: ExperiencesData = await response.json()
      setExperiencesData(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const handleAddExperience = () => {
    // Yeni deneyim sayfasına yönlendir
    window.location.href = '/admin/experiences/new'
  }

  const handleEditExperience = (experience: Experience) => {
    // Düzenleme sayfasına yönlendir
    window.location.href = `/admin/experiences/${experience.id}/edit`
  }

  const handleDeleteExperience = async (experienceId: string) => {
    if (!confirm('Bu deneyimi silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(experienceId)
    try {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete experience')

      await fetchExperiences() // Refresh data
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Deneyim silinirken hata oluştu')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleFormSuccess = () => {
    fetchExperiences()
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list')
  }

  if (loading) {
    return (
      <div className="experiences-loading-container">
        <div className="experiences-loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="experiences-page">
      {/* Header */}
      <div className="experiences-header">
        <div>
          <h1 className="experiences-title">
            Deneyimler
          </h1>
          <p className="experiences-subtitle">
            İş deneyimlerinizi ve kariyer geçmişinizi yönetin
          </p>
        </div>
        <div className="experiences-header-actions">
          <button
            onClick={toggleViewMode}
            className="experiences-view-toggle"
          >
            {viewMode === 'list' ? (
              <>
                <EyeSlashIcon className="experiences-action-icon" />
                Grid Görünüm
              </>
            ) : (
              <>
                <EyeIcon className="experiences-action-icon" />
                Liste Görünüm
              </>
            )}
          </button>
          <button
            onClick={handleAddExperience}
            className="experiences-add-button"
          >
            <PlusIcon className="experiences-action-icon" />
            Yeni Deneyim
          </button>
        </div>
      </div>

      {/* Stats */}
      {experiencesData && (
        <div className="experiences-stats-grid">
          <div className="experiences-stats-card">
            <div className="experiences-stats-icon-wrapper experiences-stats-total">
              <BriefcaseIcon className="experiences-stats-icon" />
            </div>
            <div className="experiences-stats-content">
              <p className="experiences-stats-label">
                Toplam Deneyim
              </p>
              <p className="experiences-stats-value">
                {experiencesData.stats.total}
              </p>
            </div>
          </div>

          <div className="experiences-stats-card">
            <div className="experiences-stats-icon-wrapper experiences-stats-current">
              <ChartBarIcon className="experiences-stats-icon" />
            </div>
            <div className="experiences-stats-content">
              <p className="experiences-stats-label">
                Aktif İş
              </p>
              <p className="experiences-stats-value">
                {experiencesData.stats.current}
              </p>
            </div>
          </div>

          <div className="experiences-stats-card">
            <div className="experiences-stats-icon-wrapper experiences-stats-past">
              <CalendarIcon className="experiences-stats-icon" />
            </div>
            <div className="experiences-stats-content">
              <p className="experiences-stats-label">
                Geçmiş İşler
              </p>
              <p className="experiences-stats-value">
                {experiencesData.stats.past}
              </p>
            </div>
          </div>

          <div className="experiences-stats-card">
            <div className="experiences-stats-icon-wrapper experiences-stats-location">
              <MapPinIcon className="experiences-stats-icon" />
            </div>
            <div className="experiences-stats-content">
              <p className="experiences-stats-label">
                Farklı Şehir
              </p>
              <p className="experiences-stats-value">
                {Object.keys(experiencesData.stats.byDuration).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Experiences List */}
      {experiencesData && experiencesData.experiences.length === 0 ? (
        <div className="experiences-empty-container">
          <BriefcaseIcon className="experiences-empty-icon" />
          <h3 className="experiences-empty-title">
            Henüz deneyim eklenmemiş
          </h3>
          <p className="experiences-empty-text">
            İlk iş deneyiminizi ekleyerek başlayın
          </p>
          <button
            onClick={handleAddExperience}
            className="experiences-add-button"
          >
            <PlusIcon className="experiences-action-icon" />
            İlk Deneyimi Ekle
          </button>
        </div>
      ) : (
        <ExperienceList
          experiences={experiencesData?.experiences || []}
          viewMode={viewMode}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
          deleteLoading={deleteLoading}
        />
      )}


    </div>
  )
}
