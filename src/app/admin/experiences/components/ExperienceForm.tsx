'use client'
// src/app/admin/experiences/components/ExperienceForm.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  XMarkIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { Experience } from '@/lib/types'

const experienceSchema = z.object({
  title: z.string().min(1, 'Pozisyon adı gereklidir').max(100, 'Pozisyon adı en fazla 100 karakter olabilir'),
  company: z.string().min(1, 'Şirket adı gereklidir').max(100, 'Şirket adı en fazla 100 karakter olabilir'),
  location: z.string().min(1, 'Konum gereklidir').max(100, 'Konum en fazla 100 karakter olabilir'),
  start_date: z.string().min(1, 'Başlangıç tarihi gereklidir'),
  end_date: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().max(1000, 'Açıklama en fazla 1000 karakter olabilir').optional()
})

type ExperienceFormData = z.infer<typeof experienceSchema>

interface ExperienceFormProps {
  experience?: Experience
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ExperienceForm({ 
  experience, 
  isOpen, 
  onClose, 
  onSuccess 
}: ExperienceFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: experience?.title || '',
      company: experience?.company || '',
      location: experience?.location || '',
      start_date: experience?.start_date ? experience.start_date.split('T')[0] : '',
      end_date: experience?.end_date ? experience.end_date.split('T')[0] : '',
      current: experience?.current || false,
      description: experience?.description || ''
    }
  })

  const watchedCurrent = watch('current')
  const watchedStartDate = watch('start_date')

  const onSubmit = async (data: ExperienceFormData) => {
    setLoading(true)
    try {
      const url = experience 
        ? `/api/admin/experiences/${experience.id}`
        : '/api/admin/experiences'
      
      const method = experience ? 'PUT' : 'POST'
      
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
    <div className="experience-form-overlay">
      <div className="experience-form-container">
        {/* Header */}
        <div className="experience-form-header">
          <div className="experience-form-header-content">
            <div className="experience-form-icon-wrapper">
              <BriefcaseIcon className="experience-form-icon" />
            </div>
            <div>
              <h2 className="experience-form-title">
                {experience ? 'Deneyim Düzenle' : 'Yeni Deneyim'}
              </h2>
              <p className="experience-form-subtitle">
                {experience ? 'Mevcut deneyimi düzenleyin' : 'Yeni bir iş deneyimi ekleyin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="experience-form-close"
          >
            <XMarkIcon className="experience-form-close-icon" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="experience-form">
          <div className="experience-form-grid">
            {/* Title */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Pozisyon *
              </label>
              <input
                {...register('title')}
                className="experience-form-input"
                placeholder="Örn: Software Developer, UI/UX Designer"
              />
              {errors.title && (
                <p className="experience-form-error">{errors.title.message}</p>
              )}
            </div>

            {/* Company */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Şirket *
              </label>
              <input
                {...register('company')}
                className="experience-form-input"
                placeholder="Örn: Google, Microsoft, Startup"
              />
              {errors.company && (
                <p className="experience-form-error">{errors.company.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Konum *
              </label>
              <input
                {...register('location')}
                className="experience-form-input"
                placeholder="Örn: İstanbul, Türkiye"
              />
              {errors.location && (
                <p className="experience-form-error">{errors.location.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Başlangıç Tarihi *
              </label>
              <input
                {...register('start_date')}
                type="date"
                className="experience-form-input"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.start_date && (
                <p className="experience-form-error">{errors.start_date.message}</p>
              )}
            </div>

            {/* End Date */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Bitiş Tarihi
              </label>
              <input
                {...register('end_date')}
                type="date"
                className="experience-form-input"
                min={watchedStartDate}
                max={new Date().toISOString().split('T')[0]}
                disabled={watchedCurrent}
              />
              {errors.end_date && (
                <p className="experience-form-error">{errors.end_date.message}</p>
              )}
            </div>

            {/* Current Job */}
            <div className="experience-form-field">
              <label className="experience-form-label">
                Aktif İş
              </label>
              <div className="experience-form-checkbox">
                <input
                  {...register('current')}
                  type="checkbox"
                  className="experience-form-checkbox-input"
                />
                <span className="experience-form-checkbox-label">
                  Bu pozisyonda hala çalışıyorum
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="experience-form-field">
            <label className="experience-form-label">
              Açıklama
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="experience-form-textarea"
              placeholder="Bu pozisyonda yaptığınız işleri ve sorumluluklarınızı açıklayın..."
            />
            {errors.description && (
              <p className="experience-form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="experience-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="experience-form-cancel"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="experience-form-save"
            >
              {loading ? (
                <div className="experience-form-loading"></div>
              ) : (
                <CheckIcon className="experience-form-save-icon" />
              )}
              {loading ? 'Kaydediliyor...' : (experience ? 'Güncelle' : 'Ekle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
