'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Filter,
  Github,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import styles from '@/styles/components/ProjectsListAurora.module.css'

interface Project {
  id: string
  title: string
  description?: string
  content?: string
  image_url?: string
  demo_url?: string
  github_url?: string
  live_url?: string
  technologies?: string[]
  category?: string | string[]
  featured?: boolean
  status?: string
  slug?: string
  created_at?: string
}

interface ProjectsListAuroraProps {
  projects: Project[]
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

export default function ProjectsListAurora({ projects }: ProjectsListAuroraProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Tüm technologies listesi
  const allTechs = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [projects])

  // Filtreleme
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return projects.filter((p) => {
      const matchesSearch =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.content?.toLowerCase().includes(term) ||
        p.technologies?.some((t) => t.toLowerCase().includes(term))
      const matchesTech =
        selectedTech === 'all' || p.technologies?.includes(selectedTech)
      return matchesSearch && matchesTech
    })
  }, [projects, searchTerm, selectedTech])

  const isShowingFeatured = selectedTech === 'all' && !searchTerm.trim()
  const featured = isShowingFeatured
    ? filtered.find((p) => p.featured) || filtered[0]
    : null
  const others = featured ? filtered.filter((p) => p.id !== featured.id) : filtered

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.p {...fadeUp} className={styles.sectionLabel}>
              Çalışmalar / Projeler
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className={styles.heroTitle}
            >
              Geliştirdiğim<br />
              <span className={styles.heroTitleAccent}>projeler.</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className={styles.heroSub}
            >
              Web, mobil ve sistem projelerim. React, Next.js, Spring Boot,
              Flutter ve daha fazlasıyla.
            </motion.p>
          </div>
        </section>

        {/* FILTERS */}
        <section className={styles.filtersBar}>
          <div className={styles.container}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className={styles.filterRow}
            >
              <div className={styles.searchWrap}>
                <Search className={styles.searchIcon} size={18} />
                <input
                  type="text"
                  placeholder="Projelerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {allTechs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFilters((s) => !s)}
                  className={`${styles.filterToggle} ${showFilters || selectedTech !== 'all' ? styles.filterToggleActive : ''}`}
                >
                  <Filter size={16} />
                  Filtrele
                  {selectedTech !== 'all' && (
                    <span className={styles.filterBadge}>{selectedTech}</span>
                  )}
                </button>
              )}

              {selectedTech !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedTech('all')}
                  className={styles.clearFilter}
                  aria-label="Filtreyi temizle"
                >
                  <X size={14} />
                  Temizle
                </button>
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {showFilters && allTechs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.tagChipsWrap}
                >
                  <div className={styles.tagChips}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTech('all')
                        setShowFilters(false)
                      }}
                      className={`${styles.tagChip} ${selectedTech === 'all' ? styles.tagChipActive : ''}`}
                    >
                      Tümü
                    </button>
                    {allTechs.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          setSelectedTech(tech)
                          setShowFilters(false)
                        }}
                        className={`${styles.tagChip} ${selectedTech === tech ? styles.tagChipActive : ''}`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className={styles.results}>
              {filtered.length} proje
              {searchTerm.trim() && ` · "${searchTerm}" için`}
              {selectedTech !== 'all' && ` · ${selectedTech}`}
            </p>
          </div>
        </section>

        {/* FEATURED */}
        {featured && (
          <section className={styles.featuredSection}>
            <div className={styles.container}>
              <motion.a
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                href={`/projects/${featured.slug || featured.id}`}
                className={styles.featuredCard}
              >
                <div className={styles.featuredMedia}>
                  {featured.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className={styles.featuredImg}
                    />
                  ) : (
                    <div className={styles.featuredPlaceholder}>
                      <Code2 size={48} />
                    </div>
                  )}
                </div>
                <div className={styles.featuredBody}>
                  <p className={styles.featuredLabel}>
                    <Sparkles
                      size={12}
                      style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }}
                    />
                    Öne çıkan proje
                  </p>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  {featured.description && (
                    <p className={styles.featuredDesc}>{featured.description}</p>
                  )}
                  {featured.technologies && featured.technologies.length > 0 && (
                    <div className={styles.featuredTech}>
                      {featured.technologies.slice(0, 6).map((t) => (
                        <span key={t} className={styles.techTag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={styles.featuredArrow}>
                    Detayları gör <ArrowRight size={16} />
                  </span>
                </div>
              </motion.a>
            </div>
          </section>
        )}

        {/* GRID */}
        <section className={styles.gridSection}>
          <div className={styles.container}>
            {others.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                }}
                className={styles.grid}
              >
                {others.map((p) => (
                  <motion.a
                    key={p.id}
                    variants={fadeUp}
                    href={`/projects/${p.slug || p.id}`}
                    className={styles.card}
                  >
                    <div className={styles.cardMedia}>
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className={styles.cardImg}
                        />
                      ) : (
                        <div className={styles.cardPlaceholder}>
                          <Code2 size={36} />
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>{p.title}</h3>
                        {p.status && p.status !== 'published' && (
                          <span className={`${styles.statusBadge} ${p.status === 'draft' ? styles.statusDraft : ''}`}>
                            {p.status === 'draft' ? 'Taslak' : p.status}
                          </span>
                        )}
                      </div>
                      {p.description && <p className={styles.cardDesc}>{p.description}</p>}
                      {p.technologies && p.technologies.length > 0 && (
                        <div className={styles.cardTech}>
                          {p.technologies.slice(0, 4).map((t) => (
                            <span key={t} className={styles.techTag}>
                              {t}
                            </span>
                          ))}
                          {p.technologies.length > 4 && (
                            <span className={styles.techTagMore}>
                              +{p.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <div className={styles.cardFooter}>
                        <span className={styles.cardArrow}>
                          Detayları gör <ArrowRight size={14} />
                        </span>
                        <div className={styles.cardLinks}>
                          {p.github_url && (
                            <button
                              type="button"
                              className={styles.cardLink}
                              aria-label="GitHub"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(p.github_url, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              <Github size={15} />
                            </button>
                          )}
                          {(p.live_url || p.demo_url) && (
                            <button
                              type="button"
                              className={styles.cardLink}
                              aria-label="Canlı demo"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(p.live_url || p.demo_url, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              <ExternalLink size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            ) : !featured ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Code2 size={28} />
                </div>
                <h3 className={styles.emptyTitle}>Proje bulunamadı</h3>
                <p className={styles.emptyText}>
                  {searchTerm.trim() || selectedTech !== 'all'
                    ? 'Arama kriterlerine uygun proje yok. Farklı anahtar kelime veya filtre dene.'
                    : 'Henüz yayınlanmış proje yok.'}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
