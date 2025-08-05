// src/app/admin/skills/components/SkillCard.tsx
'use client'

import { useState } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { Skill } from '@/lib/types'

interface SkillCardProps {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (skillId: string) => void
  isDeleting: boolean
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> | null
}

const skillLevels = {
  beginner: { label: 'Başlangıç', color: 'bg-red-500', percentage: 25 },
  intermediate: { label: 'Orta', color: 'bg-yellow-500', percentage: 50 },
  advanced: { label: 'İleri', color: 'bg-blue-500', percentage: 75 },
  expert: { label: 'Uzman', color: 'bg-green-500', percentage: 100 }
} as const

export default function SkillCard({ 
  skill, 
  onEdit, 
  onDelete, 
  isDeleting,
  isDragging = false,
  dragHandleProps
}: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const levelData = skillLevels[skill.level]

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        isDragging 
          ? 'shadow-lg rotate-2 scale-105 opacity-90' 
          : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {skill.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {skill.category}
            </p>
          </div>
          
          {/* Actions */}
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
            isHovered || isDragging ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Drag Handle */}
            <div
              {...dragHandleProps}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing rounded"
              title="Sürükle"
            >
              <Bars3Icon className="skills-level-icon" />
            </div>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(skill)}
              className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
              title="Düzenle"
            >
              <PencilIcon className="skills-level-icon" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(skill.id)}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sil"
            >
              {isDeleting ? (
                <div className="skills-level-icon animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
              ) : (
                <TrashIcon className="skills-level-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {levelData.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {levelData.percentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${levelData.color}`}
              style={{ width: `${levelData.percentage}%` }}
            />
          </div>
        </div>

        {/* Level Badge */}
        <div className="mt-3 flex justify-end">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            skill.level === 'expert' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : skill.level === 'advanced'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : skill.level === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {levelData.label}
          </span>
        </div>
      </div>
    </div>
  )
}