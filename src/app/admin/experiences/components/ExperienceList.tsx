'use client'
// src/app/admin/experiences/components/ExperienceList.tsx

import { 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { Experience } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface ExperienceListProps {
  experiences: Experience[]
  viewMode: 'list' | 'grid'
  onEdit: (experience: Experience) => void
  onDelete: (experienceId: string) => void
  deleteLoading: string | null
}

export default function ExperienceList({ 
  experiences, 
  viewMode, 
  onEdit, 
  onDelete, 
  deleteLoading 
}: ExperienceListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const years = end.getFullYear() - start.getFullYear()
    const months = end.getMonth() - start.getMonth()
    
    let totalMonths = years * 12 + months
    if (end.getDate() < start.getDate()) {
      totalMonths--
    }
    
    const yearsPart = Math.floor(totalMonths / 12)
    const monthsPart = totalMonths % 12
    
    if (yearsPart > 0 && monthsPart > 0) {
      return `${yearsPart} yıl ${monthsPart} ay`
    } else if (yearsPart > 0) {
      return `${yearsPart} yıl`
    } else {
      return `${monthsPart} ay`
    }
  }

  if (viewMode === 'grid') {
    return (
      <div className="experiences-grid">
        {experiences.map((experience) => (
          <div key={experience.id} className="experience-card">
            <div className="experience-card-header">
              <div className="experience-card-company">
                <BuildingOfficeIcon className="experience-card-icon" />
                <div>
                  <h3 className="experience-card-title">
                    {experience.title}
                  </h3>
                  <p className="experience-card-company-name">
                    {experience.company}
                  </p>
                </div>
              </div>
              
              <div className="experience-card-actions">
                <button
                  onClick={() => onEdit(experience)}
                  className="experience-action-button experience-edit-button"
                  title="Düzenle"
                >
                  <PencilIcon className="experience-action-icon" />
                </button>
                <button
                  onClick={() => onDelete(experience.id)}
                  disabled={deleteLoading === experience.id}
                  className="experience-action-button experience-delete-button"
                  title="Sil"
                >
                  {deleteLoading === experience.id ? (
                    <div className="experience-loading-spinner"></div>
                  ) : (
                    <TrashIcon className="experience-action-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="experience-card-content">
              <div className="experience-card-details">
                <div className="experience-card-detail">
                  <MapPinIcon className="experience-detail-icon" />
                  <span>{experience.location}</span>
                </div>
                <div className="experience-card-detail">
                  <CalendarIcon className="experience-detail-icon" />
                  <span>
                    {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Devam ediyor'}
                  </span>
                </div>
                <div className="experience-card-duration">
                  {getDuration(experience.start_date, experience.end_date)}
                </div>
              </div>

              {experience.description && (
                <p className="experience-card-description">
                  {experience.description}
                </p>
              )}

              {experience.current && (
                <div className="experience-current-badge">
                  Aktif
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="experiences-table-container">
      <table className="experiences-table">
        <thead>
          <tr>
            <th className="experiences-table-header">Pozisyon</th>
            <th className="experiences-table-header">Şirket</th>
            <th className="experiences-table-header">Konum</th>
            <th className="experiences-table-header">Tarih</th>
            <th className="experiences-table-header">Süre</th>
            <th className="experiences-table-header">Durum</th>
            <th className="experiences-table-header">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((experience) => (
            <tr key={experience.id} className="experiences-table-row">
              <td className="experiences-table-cell">
                <div className="experience-cell-content">
                  <h4 className="experience-cell-title">
                    {experience.title}
                  </h4>
                  {experience.description && (
                    <p className="experience-cell-description">
                      {experience.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="experiences-table-cell">
                <div className="experience-cell-company">
                  <BuildingOfficeIcon className="experience-cell-icon" />
                  <span>{experience.company}</span>
                </div>
              </td>
              <td className="experiences-table-cell">
                <div className="experience-cell-location">
                  <MapPinIcon className="experience-cell-icon" />
                  <span>{experience.location}</span>
                </div>
              </td>
              <td className="experiences-table-cell">
                <div className="experience-cell-date">
                  <CalendarIcon className="experience-cell-icon" />
                  <span>
                    {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Devam ediyor'}
                  </span>
                </div>
              </td>
              <td className="experiences-table-cell">
                <span className="experience-cell-duration">
                  {getDuration(experience.start_date, experience.end_date)}
                </span>
              </td>
              <td className="experiences-table-cell">
                {experience.current ? (
                  <span className="experience-status-badge experience-status-current">
                    Aktif
                  </span>
                ) : (
                  <span className="experience-status-badge experience-status-past">
                    Geçmiş
                  </span>
                )}
              </td>
              <td className="experiences-table-cell">
                <div className="experience-cell-actions">
                  <button
                    onClick={() => onEdit(experience)}
                    className="experience-action-button experience-edit-button"
                    title="Düzenle"
                  >
                    <PencilIcon className="experience-action-icon" />
                  </button>
                  <button
                    onClick={() => onDelete(experience.id)}
                    disabled={deleteLoading === experience.id}
                    className="experience-action-button experience-delete-button"
                    title="Sil"
                  >
                    {deleteLoading === experience.id ? (
                      <div className="experience-loading-spinner"></div>
                    ) : (
                      <TrashIcon className="experience-action-icon" />
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
