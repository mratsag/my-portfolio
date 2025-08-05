// src/app/admin/skills/components/SkillCategory.tsx
'use client'

import { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import SkillCard from './SkillCard'
import { Skill } from '@/lib/types'

interface SkillCategoryProps {
  category: string
  skills: Skill[]
  isCollapsed: boolean
  onToggleCollapse: (category: string) => void
  onAddSkill: (category: string) => void
  onEditSkill: (skill: Skill) => void
  onDeleteSkill: (skillId: string) => void
  deleteLoading: string | null
}

const categoryIcons: Record<string, string> = {
  'Frontend': '🎨',
  'Backend': '⚙️',
  'Database': '🗄️',
  'DevOps': '🚀',
  'Mobile': '📱',
  'Design': '🎨',
  'Tools': '🔧',
  'Programming Languages': '💻',
  'Frameworks': '🏗️',
  'Cloud Services': '☁️',
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || '📚'
}

const getCategoryColor = (category: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500'
  ]
  
  // Generate consistent color based on category name
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export default function SkillCategory({
  category,
  skills,
  isCollapsed,
  onToggleCollapse,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  deleteLoading
}: SkillCategoryProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const categoryColor = getCategoryColor(category)
  const categoryIcon = getCategoryIcon(category)
  
  // Calculate average level
  const levelValues = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
  const averageLevel = skills.length > 0 
    ? skills.reduce((sum, skill) => sum + levelValues[skill.level], 0) / skills.length
    : 0

  const getAverageLevelLabel = (avg: number) => {
    if (avg >= 3.5) return 'Uzman'
    if (avg >= 2.5) return 'İleri'
    if (avg >= 1.5) return 'Orta'
    return 'Başlangıç'
  }

  const getAverageLevelColor = (avg: number) => {
    if (avg >= 3.5) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    if (avg >= 2.5) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
    if (avg >= 1.5) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Category Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          isCollapsed ? 'rounded-lg' : 'rounded-t-lg border-b border-gray-200 dark:border-gray-700'
        }`}
        onClick={() => onToggleCollapse(category)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-3">
          {/* Category Icon */}
          <div className={`${categoryColor} p-2 rounded-lg`}>
            <span className="text-lg">{categoryIcon}</span>
          </div>
          
          {/* Category Info */}
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {skills.length}
              </span>
            </div>
            
            {skills.length > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ortalama seviye:
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getAverageLevelColor(averageLevel)}`}>
                  {getAverageLevelLabel(averageLevel)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Add Skill Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddSkill(category)
            }}
            className={`p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            title="Yeni yetenek ekle"
          >
            <PlusIcon className="skills-category-icon" />
          </button>

          {/* Collapse Button */}
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
            {isCollapsed ? (
              <ChevronRightIcon className="skills-category-icon" />
            ) : (
              <ChevronDownIcon className="skills-category-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      {!isCollapsed && (
        <div className="p-4">
          {skills.length === 0 ? (
            <div className="text-center py-8">
              <AcademicCapIcon className="skills-empty-icon" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Henüz yetenek yok
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bu kategoriye ilk yeteneği ekleyin
              </p>
              <button
                onClick={() => onAddSkill(category)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="skills-action-icon" />
                Yetenek Ekle
              </button>
            </div>
          ) : (
            <Droppable droppableId={category} type="skill">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[100px] rounded-lg transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-indigo-50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-300 dark:border-indigo-600' 
                      : ''
                  }`}
                >
                  {skills.map((skill, index) => (
                    <Draggable 
                      key={skill.id} 
                      draggableId={skill.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <SkillCard
                            skill={skill}
                            onEdit={onEditSkill}
                            onDelete={onDeleteSkill}
                            isDeleting={deleteLoading === skill.id}
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </div>
  )
}