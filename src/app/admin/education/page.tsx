'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import EducationForm from './components/EducationForm'
import { Education } from '@/lib/types'
import styles from '@/styles/admin/EducationPage.module.css'

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/admin/education')
      if (!response.ok) {
        throw new Error('Failed to fetch education')
      }
      const data = await response.json()
      setEducation(data.education || [])
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu eğitim bilgisini silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete education')
      }

      // Remove from state
      setEducation(prev => prev.filter(edu => edu.id !== id))
    } catch (error) {
      console.error('Error deleting education:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete education')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEducation(undefined)
    fetchEducation()
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEducation(undefined)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.educationPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <AcademicCapIcon />
              </div>
              <div className={styles.headerText}>
                <h1>Eğitim Bilgileri</h1>
                <p>Eğitim geçmişinizi yönetin</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className={styles.addButton}
            >
              <PlusIcon />
              Eğitim Ekle
            </button>
          </div>
        </div>

        {/* Education List */}
        <div className={styles.educationList}>
          {education.length === 0 ? (
            <div className={styles.emptyState}>
              <AcademicCapIcon className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>
                Henüz eğitim bilgisi eklenmemiş
              </h3>
              <p className={styles.emptyText}>
                İlk eğitim bilginizi ekleyerek başlayın
              </p>
              <button
                onClick={() => setShowForm(true)}
                className={styles.emptyButton}
              >
                <PlusIcon />
                Eğitim Ekle
              </button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Kurum</th>
                  <th>Derece</th>
                  <th>Alan</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {education.map((edu) => (
                  <tr key={edu.id}>
                    <td className={styles.institutionCell}>
                      <div className={styles.institutionName}>
                        {edu.institution}
                      </div>
                      {edu.school && (
                        <div className={styles.institutionSchool}>
                          {edu.school}
                        </div>
                      )}
                    </td>
                    <td className={styles.degreeCell}>
                      {edu.degree}
                    </td>
                    <td className={styles.fieldCell}>
                      {edu.field}
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Devam ediyor'}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(edu)}
                          className={styles.editButton}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(edu.id)}
                          className={styles.deleteButton}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Education Form Modal */}
      <EducationForm
        education={editingEducation}
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
