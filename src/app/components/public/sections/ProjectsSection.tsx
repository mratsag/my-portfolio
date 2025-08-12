'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ExternalLink, Github, Filter, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import styles from '@/styles/public/ProjectsSection.module.css'

interface ProjectsSectionProps {
  projects?: Array<{
    id: string
    title: string
    description?: string
    content?: string
    image_url?: string
    demo_url?: string
    github_url?: string
    live_url?: string
    technologies?: string[]
    category?: string[]
    featured?: boolean
    status?: string
    created_at?: string
  }>
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Kategorileri çıkar
  const categories = ['all', ...new Set(projects?.flatMap(p => p.category || []).filter(Boolean) || [])]

  // Filtreleme
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies?.some((tech: string) => 
                           tech.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesCategory = selectedCategory === 'all' || 
                           project.category?.includes(selectedCategory)

    return matchesSearch && matchesCategory
  }) || []

  return (
    <div className={styles.projects} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Projelerim</h1>
            <p className={styles.subtitle}>
              Geliştirdiğim projeler ve çalışmalarım
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.categoryFilter}>
              <Filter className={styles.filterIcon} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tüm Kategoriler' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.results}>
            {filteredProjects.length} proje bulundu
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.container}>
          {filteredProjects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectImage}>
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>
                          {project.title?.charAt(0) || 'P'}
                        </span>
                      </div>
                    )}
                    {project.featured && (
                      <div className={styles.featuredBadge}>
                        Öne Çıkan
                      </div>
                    )}
                  </div>

                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      {project.category && (
                        <span className={styles.projectCategory}>
                          {project.category}
                        </span>
                      )}
                    </div>

                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className={styles.projectTechnologies}>
                        {project.technologies.slice(0, 4).map((tech: string, index: number) => (
                          <span key={index} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className={styles.moreTech}>
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.projectLinks}>
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                        >
                          <Github className={styles.linkIcon} />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                        >
                          <ExternalLink className={styles.linkIcon} />
                          <span>Canlı Demo</span>
                        </a>
                      )}
                    </div>

                    <div className={styles.projectMeta}>
                      <span className={styles.projectDate}>
                        {project.created_at ? new Date(project.created_at).toLocaleDateString('tr-TR') : 'Tarih yok'}
                      </span>
                      {project.status && (
                        <span className={`${styles.projectStatus} ${styles[project.status]}`}>
                          {project.status === 'published' ? 'Yayında' : 
                           project.status === 'in-progress' ? 'Geliştiriliyor' : 'Taslak'}
                        </span>
                      )}
                    </div>

                    <div className={styles.projectFooter}>
                      <Link href={`/projects/${project.id}`} className={styles.viewDetails}>
                        <span>Detayları Gör</span>
                        <ArrowRight className={styles.arrowIcon} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>Proje bulunamadı</h3>
              <p className={styles.noResultsText}>
                Arama kriterlerinize uygun proje bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 