'use client'

import { useState } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Experience } from '@/lib/types'

interface ExperienceCardProps {
  experience: Experience
  onEdit: (experience: Experience) => void
  onDelete: (experienceId: string) => void
  isDeleting: boolean
}

export default function ExperienceCard({ 
  experience, 
  onEdit, 
  onDelete,
  isDeleting 
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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
    
    const yearsResult = Math.floor(totalMonths / 12)
    const monthsResult = totalMonths % 12
    
    if (yearsResult > 0 && monthsResult > 0) {
      return `${yearsResult} yıl ${monthsResult} ay`
    } else if (yearsResult > 0) {
      return `${yearsResult} yıl`
    } else if (monthsResult > 0) {
      return `${monthsResult} ay`
    } else {
      return '1 ay'
    }
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
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {experience.title}
              </h3>
              {experience.current && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Devam Ediyor
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <div className="flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-1" />
                <span className="font-medium">{experience.company}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{experience.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>
                  {formatDate(experience.start_date)} - {experience.current ? 'Devam Ediyor' : formatDate(experience.end_date!)}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>{getDuration(experience.start_date, experience.end_date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {experience.description && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
              {experience.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className={`flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(experience)}
              className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              title="Düzenle"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete(experience.id)}
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
