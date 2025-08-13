'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  XMarkIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { Education } from '@/lib/types'
import styles from '@/styles/admin/EducationForm.module.css'

const educationSchema = z.object({
  institution: z.string().min(1, 'Kurum adı gereklidir').max(100, 'Kurum adı en fazla 100 karakter olabilir'),
  school: z.string().max(100, 'Okul adı en fazla 100 karakter olabilir').optional(),
  degree: z.string().min(1, 'Derece gereklidir').max(100, 'Derece en fazla 100 karakter olabilir'),
  field: z.string().min(1, 'Alan gereklidir').max(100, 'Alan en fazla 100 karakter olabilir'),
  start_date: z.string().min(1, 'Başlangıç tarihi gereklidir'),
  end_date: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(1000, 'Açıklama en fazla 1000 karakter olabilir').optional()
})

type EducationFormData = z.infer<typeof educationSchema>

interface EducationFormProps {
  education?: Education
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EducationForm({ 
  education, 
  isOpen, 
  onClose, 
  onSuccess 
}: EducationFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution || '',
      school: education?.school || '',
      degree: education?.degree || '',
      field: education?.field || '',
      start_date: education?.start_date ? education.start_date.split('T')[0] : '',
      end_date: education?.end_date ? education.end_date.split('T')[0] : '',
      current: education?.end_date ? false : true,
      description: education?.description || ''
    }
  })

  const watchedCurrent = watch('current')
  const watchedStartDate = watch('start_date')

  const onSubmit = async (data: EducationFormData) => {
    setLoading(true)
    try {
      const url = education 
        ? `/api/admin/education/${education.id}`
        : '/api/admin/education'
      
      const method = education ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          start_date: new Date(data.start_date).toISOString(),
          end_date: data.end_date ? new Date(data.end_date).toISOString() : null
        }),
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

  if (!isOpen) return null

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <AcademicCapIcon />
            </div>
            <div className={styles.headerText}>
              <h2>
                {education ? 'Eğitim Bilgisini Düzenle' : 'Yeni Eğitim Bilgisi'}
              </h2>
              <p>
                {education ? 'Mevcut eğitim bilgisini düzenleyin' : 'Yeni bir eğitim bilgisi ekleyin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            <XMarkIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Institution */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <BuildingOfficeIcon />
                Kurum *
              </label>
              <input
                {...register('institution')}
                className={styles.formInput}
                placeholder="Örn: İstanbul Teknik Üniversitesi"
              />
              {errors.institution && (
                <p className={styles.formError}>{errors.institution.message}</p>
              )}
            </div>

            {/* School */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <AcademicCapIcon />
                Okul/Fakülte
              </label>
              <input
                {...register('school')}
                className={styles.formInput}
                placeholder="Örn: Bilgisayar Mühendisliği Fakültesi"
              />
              {errors.school && (
                <p className={styles.formError}>{errors.school.message}</p>
              )}
            </div>

            {/* Degree */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Derece *
              </label>
              <input
                {...register('degree')}
                className={styles.formInput}
                placeholder="Örn: Lisans, Yüksek Lisans, Doktora"
              />
              {errors.degree && (
                <p className={styles.formError}>{errors.degree.message}</p>
              )}
            </div>

            {/* Field */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Alan *
              </label>
              <input
                {...register('field')}
                className={styles.formInput}
                placeholder="Örn: Bilgisayar Mühendisliği"
              />
              {errors.field && (
                <p className={styles.formError}>{errors.field.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <CalendarIcon />
                Başlangıç Tarihi *
              </label>
              <input
                {...register('start_date')}
                type="date"
                className={styles.formInput}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.start_date && (
                <p className={styles.formError}>{errors.start_date.message}</p>
              )}
            </div>

            {/* End Date */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <CalendarIcon />
                Bitiş Tarihi
              </label>
              <input
                {...register('end_date')}
                type="date"
                className={styles.formInput}
                min={watchedStartDate}
                max={new Date().toISOString().split('T')[0]}
                disabled={watchedCurrent}
              />
              {errors.end_date && (
                <p className={styles.formError}>{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Current Education */}
          <div className={styles.checkboxContainer}>
            <input
              {...register('current')}
              type="checkbox"
              id="current"
              className={styles.checkboxInput}
            />
            <label htmlFor="current" className={styles.checkboxLabel}>
              Bu eğitimde hala devam ediyorum
            </label>
          </div>

          {/* Description */}
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              Açıklama
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={styles.formTextarea}
              placeholder="Eğitim süreciniz hakkında ek bilgiler..."
            />
            {errors.description && (
              <p className={styles.formError}>{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <CheckIcon />
              )}
              {loading ? 'Kaydediliyor...' : (education ? 'Güncelle' : 'Ekle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
