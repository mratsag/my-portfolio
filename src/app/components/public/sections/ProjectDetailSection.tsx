'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Calendar, Tag, ArrowLeft, Github, ExternalLink, Share2 } from 'lucide-react'
import Link from 'next/link'
import styles from '@/styles/public/ProjectDetailSection.module.css'

interface ProjectDetailSectionProps {
  project: {
    id: string
    title: string
    description: string
    content: string
    technologies?: string[]
    github_url?: string
    demo_url?: string
    live_url?: string
    image_url?: string
    category?: string
    status?: string
    featured?: boolean
    created_at: string
    updated_at: string
  }
  profile?: {
    full_name?: string
  }
}

export default function ProjectDetailSection({ project, profile }: ProjectDetailSectionProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={styles.projectDetail} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <Link href="/projects" className={styles.backLink}>
              <ArrowLeft className={styles.backIcon} />
              Projelere Dön
            </Link>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Calendar className={styles.metaIcon} />
                <span>{formatDate(project.created_at)}</span>
              </div>
              {project.category && (
                <div className={styles.metaItem}>
                  <Tag className={styles.metaIcon} />
                  <span>{project.category}</span>
                </div>
              )}
              {project.status && (
                <div className={styles.metaItem}>
                  <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                    {project.status === 'published' ? 'Yayında' : 
                     project.status === 'in-progress' ? 'Geliştiriliyor' : 'Taslak'}
                  </span>
                </div>
              )}
            </div>

            <h1 className={styles.title}>{project.title}</h1>
            
            <p className={styles.description}>{project.description}</p>

            {project.image_url && (
              <div className={styles.imageContainer}>
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className={styles.image}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className={styles.technologiesSection}>
                  <h2 className={styles.sectionTitle}>Kullanılan Teknolojiler</h2>
                  <div className={styles.technologies}>
                    {project.technologies.map((tech, index) => (
                      <span key={index} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Content */}
              {project.content && (
                <div className={styles.projectContent}>
                  <h2 className={styles.sectionTitle}>Proje Detayları</h2>
                  <div 
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Project Links */}
              <div className={styles.linksSection}>
                <h3 className={styles.sidebarTitle}>Proje Linkleri</h3>
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
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      <ExternalLink className={styles.linkIcon} />
                      <span>Demo</span>
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
                      <span>Canlı Site</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className={styles.shareSection}>
                <h3 className={styles.sidebarTitle}>
                  <Share2 className={styles.sidebarIcon} />
                  Paylaş
                </h3>
                <div className={styles.shareButtons}>
                  <button 
                    onClick={() => navigator.share?.({ title: project.title, url: window.location.href })}
                    className={styles.shareButton}
                  >
                    Paylaş
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className={styles.infoSection}>
                <h3 className={styles.sidebarTitle}>Proje Bilgileri</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Oluşturulma:</span>
                    <span className={styles.infoValue}>{formatDate(project.created_at)}</span>
                  </div>
                  {project.updated_at !== project.created_at && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Güncellenme:</span>
                      <span className={styles.infoValue}>{formatDate(project.updated_at)}</span>
                    </div>
                  )}
                  {project.category && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Kategori:</span>
                      <span className={styles.infoValue}>{project.category}</span>
                    </div>
                  )}
                  {project.status && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Durum:</span>
                      <span className={`${styles.infoValue} ${styles[project.status]}`}>
                        {project.status === 'published' ? 'Yayında' : 
                         project.status === 'in-progress' ? 'Geliştiriliyor' : 'Taslak'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
} 