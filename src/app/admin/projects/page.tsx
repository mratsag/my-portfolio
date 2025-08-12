'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import ProjectCard from './components/ProjectCard'
import ProjectList from './components/ProjectList'
import { Project } from '@/lib/types'

type ViewMode = 'cards' | 'list'
type FilterStatus = 'all' | 'draft' | 'published'
type FilterFeatured = 'all' | 'true' | 'false'

interface ProjectsData {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [featuredFilter, setFeaturedFilter] = useState<FilterFeatured>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(featuredFilter !== 'all' && { featured: featuredFilter })
      })

      const response = await fetch(`/api/admin/projects?${params}`)
      if (!response.ok) throw new Error('Failed to fetch projects')
      
      const data: ProjectsData = await response.json()
      setProjects(data.projects)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [currentPage, search, statusFilter, featuredFilter])

  const handleDelete = async (projectId: string) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(projectId)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete project')

      setProjects(prev => prev.filter(p => p.id !== projectId))
      await fetchProjects() // Refresh list
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Proje silinirken hata oluştu')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          featured: !project.featured
        })
      })

      if (!response.ok) throw new Error('Failed to update project')

      setProjects(prev => prev.map(p => 
        p.id === project.id ? { ...p, featured: !p.featured } : p
      ))
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Proje güncellenirken hata oluştu')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setFeaturedFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-title-section">
          <h1 className="projects-title">
            Projeler
          </h1>
          <p className="projects-subtitle">
            Portfolio projelerinizi yönetin
          </p>
        </div>
        <div className="projects-actions">
          <Link
            href="/admin/projects/new"
            className="btn-primary"
          >
            <PlusIcon className="icon-sm" />
            Yeni Proje
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <div className="filters-container">
          {/* Search */}
          <div className="search-container">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Proje ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="filter-select"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as FilterFeatured)}
            className="filter-select"
          >
            <option value="all">Tüm Projeler</option>
            <option value="true">Öne Çıkanlar</option>
            <option value="false">Normal</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('cards')}
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            >
              Kartlar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              Liste
            </button>
          </div>

          {/* Reset Filters */}
          {(search || statusFilter !== 'all' || featuredFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="reset-filters-btn"
            >
              <FunnelIcon className="icon-sm" />
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="projects-stats">
        {[
          { label: 'Toplam', value: pagination.total, color: 'blue' },
          { label: 'Yayında', value: projects.filter(p => p.status === 'published').length, color: 'green' },
          { label: 'Taslak', value: projects.filter(p => p.status === 'draft').length, color: 'yellow' },
          { label: 'Öne Çıkan', value: projects.filter(p => p.featured).length, color: 'purple' }
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon-container">
              <div className={`stat-indicator ${stat.color}`}></div>
            </div>
            <div className="stat-content">
              <p className="stat-label">
                {stat.label}
              </p>
              <p className="stat-value">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="empty-title">
            Henüz proje bulunmuyor
          </h3>
          <p className="empty-description">
            İlk projenizi oluşturarak başlayın
          </p>
          <Link
            href="/admin/projects/new"
            className="btn-primary"
          >
            <PlusIcon className="icon-sm" />
            Yeni Proje
          </Link>
        </div>
      ) : (
        <>
          {/* Projects Grid/List */}
          {viewMode === 'cards' ? (
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => handleDelete(project.id)}
                  onToggleFeatured={() => handleToggleFeatured(project)}
                  isDeleting={deleteLoading === project.id}
                />
              ))}
            </div>
          ) : (
            <ProjectList
              projects={projects}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              deleteLoading={deleteLoading}
            />
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{((currentPage - 1) * pagination.limit) + 1}</span>
                    {' - '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>
                    {' / '}
                    <span className="font-medium">{pagination.total}</span>
                    {' sonuç gösteriliyor'}
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Önceki
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                      if (pageNum > pagination.totalPages) return null
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900 dark:text-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Sonraki
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}