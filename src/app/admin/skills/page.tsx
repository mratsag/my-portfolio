// src/app/admin/skills/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { 
  PlusIcon,
  AcademicCapIcon,
  ChartBarIcon,
  FolderIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import SkillForm from './components/SkillForm'
import SkillCategory from './components/SkillCategory'
import { Skill } from '@/lib/types'

interface SkillsData {
  skills: Skill[]
  grouped: Record<string, Skill[]>
  categories: string[]
  stats: {
    total: number
    categories: number
    byLevel: Record<string, number>
    byCategory: Array<{ category: string; count: number }>
  }
}

export default function SkillsPage() {
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [prefilledCategory, setPrefilledCategory] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/skills?groupBy=category')
      if (!response.ok) throw new Error('Failed to fetch skills')
      
      const data: SkillsData = await response.json()
      setSkillsData(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleAddSkill = (category?: string) => {
    setPrefilledCategory(category || '')
    setEditingSkill(null)
    setIsFormOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setPrefilledCategory('')
    setIsFormOpen(true)
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Bu yeteneği silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(skillId)
    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete skill')

      await fetchSkills() // Refresh data
    } catch (error) {
      console.error('Error deleting skill:', error)
      alert('Yetenek silinirken hata oluştu')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleFormSuccess = () => {
    fetchSkills()
  }

  const handleToggleCollapse = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const toggleAllCategories = () => {
    if (!skillsData) return
    
    if (collapsedCategories.size === skillsData.categories.length) {
      // All collapsed, expand all
      setCollapsedCategories(new Set())
    } else {
      // Some expanded, collapse all
      setCollapsedCategories(new Set(skillsData.categories))
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || !skillsData) return

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceCategory = source.droppableId
    const destCategory = destination.droppableId

    // Create new skills array for the affected category
    const sourceSkills = Array.from(skillsData.grouped[sourceCategory])
    const [movedSkill] = sourceSkills.splice(source.index, 1)

    let destSkills
    if (sourceCategory === destCategory) {
      // Same category
      destSkills = sourceSkills
      destSkills.splice(destination.index, 0, movedSkill)
    } else {
      // Different category - update skill category
      destSkills = Array.from(skillsData.grouped[destCategory] || [])
      destSkills.splice(destination.index, 0, {
        ...movedSkill,
        category: destCategory
      })
    }

    // Update local state optimistically
    const newGrouped = {
      ...skillsData.grouped,
      [sourceCategory]: sourceSkills,
      [destCategory]: destSkills
    }

    setSkillsData({
      ...skillsData,
      grouped: newGrouped,
      skills: Object.values(newGrouped).flat()
    })

    try {
      // If category changed, update the skill
      if (sourceCategory !== destCategory) {
        await fetch(`/api/admin/skills/${draggableId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...movedSkill,
            category: destCategory
          })
        })
      }

      // Update order for destination category
      await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: destSkills.map((skill, index) => ({
            id: skill.id,
            order_index: index + 1
          }))
        })
      })

      // If different categories, also update source category order
      if (sourceCategory !== destCategory && sourceSkills.length > 0) {
        await fetch('/api/admin/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills: sourceSkills.map((skill, index) => ({
              id: skill.id,
              order_index: index + 1
            }))
          })
        })
      }

    } catch (error) {
      console.error('Error updating skill order:', error)
      // Revert on error
      fetchSkills()
    }
  }

  if (loading) {
    return (
      <div className="skills-loading-container">
        <div className="skills-loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="skills-page">
      {/* Header */}
      <div className="skills-header">
        <div>
          <h1 className="skills-title">
            Yetenekler
          </h1>
          <p className="skills-subtitle">
            Teknik yeteneklerinizi kategorize edin ve seviyelerini belirtin
          </p>
        </div>
        <div className="skills-header-actions">
          <button
            onClick={toggleAllCategories}
            className="skills-toggle-button"
          >
            {skillsData && collapsedCategories.size === skillsData.categories.length ? (
              <>
                <EyeIcon className="skills-action-icon" />
                Tümünü Genişlet
              </>
            ) : (
              <>
                <EyeSlashIcon className="skills-action-icon" />
                Tümünü Daralt
              </>
            )}
          </button>
          <button
            onClick={() => handleAddSkill()}
            className="skills-add-button"
          >
            <PlusIcon className="skills-action-icon" />
            Yeni Yetenek
          </button>
        </div>
      </div>

      {/* Stats */}
      {skillsData && (
        <div className="skills-stats-grid">
          <div className="skills-stats-card">
            <div className="skills-stats-icon-wrapper skills-stats-total">
              <AcademicCapIcon className="skills-stats-icon" />
            </div>
            <div className="skills-stats-content">
              <p className="skills-stats-label">
                Toplam Yetenek
              </p>
              <p className="skills-stats-value">
                {skillsData.stats.total}
              </p>
            </div>
          </div>

          <div className="skills-stats-card">
            <div className="skills-stats-icon-wrapper skills-stats-expert">
              <ChartBarIcon className="skills-stats-icon" />
            </div>
            <div className="skills-stats-content">
              <p className="skills-stats-label">
                Uzman Seviye
              </p>
              <p className="skills-stats-value">
                {skillsData.stats.byLevel.expert || 0}
              </p>
            </div>
          </div>

          <div className="skills-stats-card">
            <div className="skills-stats-icon-wrapper skills-stats-advanced">
              <div className="skills-stats-icon bg-white/30 rounded"></div>
            </div>
            <div className="skills-stats-content">
              <p className="skills-stats-label">
                İleri Seviye
              </p>
              <p className="skills-stats-value">
                {skillsData.stats.byLevel.advanced || 0}
              </p>
            </div>
          </div>

          <div className="skills-stats-card">
            <div className="skills-stats-icon-wrapper skills-stats-categories">
              <FolderIcon className="skills-stats-icon" />
            </div>
            <div className="skills-stats-content">
              <p className="skills-stats-label">
                Kategori
              </p>
              <p className="skills-stats-value">
                {skillsData.stats.categories}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Level Distribution */}
      {skillsData && skillsData.stats.total > 0 && (
        <div className="skills-level-distribution">
          <h3 className="skills-level-title">
            Seviye Dağılımı
          </h3>
          <div className="skills-level-grid">
            {[
              { level: 'expert', label: 'Uzman', color: 'bg-green-500' },
              { level: 'advanced', label: 'İleri', color: 'bg-blue-500' },
              { level: 'intermediate', label: 'Orta', color: 'bg-yellow-500' },
              { level: 'beginner', label: 'Başlangıç', color: 'bg-red-500' }
            ].map((item) => {
              const count = skillsData.stats.byLevel[item.level] || 0
              const percentage = skillsData.stats.total > 0 ? (count / skillsData.stats.total) * 100 : 0
              
              return (
                <div key={item.level} className="skills-level-item">
                  <div className={`skills-level-circle ${item.color}`}>
                    <span className="skills-level-count">{count}</span>
                  </div>
                  <p className="skills-level-label">
                    {item.label}
                  </p>
                  <p className="skills-level-percentage">
                    %{percentage.toFixed(1)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills by Categories */}
      {skillsData && skillsData.stats.total === 0 ? (
        <div className="skills-empty-container">
          <AcademicCapIcon className="skills-empty-icon" />
          <h3 className="skills-empty-title">
            Henüz yetenek eklenmemiş
          </h3>
          <p className="skills-empty-text">
            İlk yeteneğinizi ekleyerek başlayın
          </p>
          <button
            onClick={() => handleAddSkill()}
            className="skills-add-button"
          >
            <PlusIcon className="skills-action-icon" />
            İlk Yeteneği Ekle
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-6">
            {skillsData?.categories.map((category) => (
              <SkillCategory
                key={category}
                category={category}
                skills={skillsData.grouped[category] || []}
                isCollapsed={collapsedCategories.has(category)}
                onToggleCollapse={handleToggleCollapse}
                onAddSkill={handleAddSkill}
                onEditSkill={handleEditSkill}
                onDeleteSkill={handleDeleteSkill}
                deleteLoading={deleteLoading}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Skill Form Modal */}
      <SkillForm
        skill={editingSkill || undefined}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingSkill(null)
          setPrefilledCategory('')
        }}
        onSuccess={handleFormSuccess}
        existingCategories={skillsData?.categories || []}
      />
    </div>
  )
}