'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, FileText, Filter, Search, Sparkles, X } from 'lucide-react'
import styles from '@/styles/components/BlogListAurora.module.css'

interface Blog {
  id: string
  title: string
  excerpt?: string
  content?: string
  image_url?: string
  tags?: string[]
  author?: string
  published_at?: string
  slug?: string
  featured?: boolean
  reading_time?: number
  created_at?: string
}

interface BlogListAuroraProps {
  blogs: Blog[]
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogListAurora({ blogs }: BlogListAuroraProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [showTags, setShowTags] = useState(false)

  // Tüm tag'leri çıkar
  const allTags = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach((b) => b.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [blogs])

  // Filtreleme
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return blogs.filter((b) => {
      const matchesSearch =
        !term ||
        b.title?.toLowerCase().includes(term) ||
        b.excerpt?.toLowerCase().includes(term) ||
        b.content?.toLowerCase().includes(term)
      const matchesTag = selectedTag === 'all' || b.tags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [blogs, searchTerm, selectedTag])

  // Featured: ilk featured varsa onu, yoksa en yeni yazıyı featured olarak göster
  // (sadece "Tümü" + arama boşken — filter aktifse normal grid)
  const isShowingFeatured = selectedTag === 'all' && !searchTerm.trim()
  const featured = isShowingFeatured
    ? filtered.find((b) => b.featured) || filtered[0]
    : null
  const others = featured ? filtered.filter((b) => b.id !== featured.id) : filtered

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.p {...fadeUp} className={styles.sectionLabel}>
              Blog / Yazılar
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className={styles.heroTitle}
            >
              Notlar &<br />
              <span className={styles.heroTitleAccent}>denemeler.</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className={styles.heroSub}
            >
              Yazılım, teknoloji ve öğrendiklerim üzerine kısa yazılar. Genelde
              haftada bir, bazen daha sık.
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
                  placeholder="Yazılarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {allTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTags((s) => !s)}
                  className={`${styles.filterToggle} ${showTags || selectedTag !== 'all' ? styles.filterToggleActive : ''}`}
                >
                  <Filter size={16} />
                  Filtrele
                  {selectedTag !== 'all' && (
                    <span className={styles.filterBadge}>#{selectedTag}</span>
                  )}
                </button>
              )}

              {selectedTag !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedTag('all')}
                  className={styles.clearFilter}
                  aria-label="Filtreyi temizle"
                >
                  <X size={14} />
                  Temizle
                </button>
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {showTags && allTags.length > 0 && (
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
                        setSelectedTag('all')
                        setShowTags(false)
                      }}
                      className={`${styles.tagChip} ${selectedTag === 'all' ? styles.tagChipActive : ''}`}
                    >
                      Tümü
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTag(tag)
                          setShowTags(false)
                        }}
                        className={`${styles.tagChip} ${selectedTag === tag ? styles.tagChipActive : ''}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className={styles.results}>
              {filtered.length} yazı
              {searchTerm.trim() && ` · "${searchTerm}" için`}
              {selectedTag !== 'all' && ` · #${selectedTag}`}
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
                href={`/blog/${featured.id}`}
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
                      <FileText size={48} />
                    </div>
                  )}
                </div>
                <div className={styles.featuredBody}>
                  <p className={styles.featuredLabel}>
                    <Sparkles
                      size={12}
                      style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }}
                    />
                    Öne çıkan
                  </p>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  {featured.excerpt && (
                    <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                  )}
                  <div className={styles.featuredMeta}>
                    {featured.created_at && (
                      <>
                        <Calendar size={13} />
                        <span>{formatDate(featured.created_at)}</span>
                      </>
                    )}
                    {featured.reading_time && (
                      <>
                        <span className={styles.featuredMetaSep}>·</span>
                        <Clock size={13} />
                        <span>{featured.reading_time} dk okuma</span>
                      </>
                    )}
                  </div>
                  <span className={styles.featuredArrow}>
                    Yazıyı oku <ArrowRight size={16} />
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
                {others.map((blog) => (
                  <motion.a
                    key={blog.id}
                    variants={fadeUp}
                    href={`/blog/${blog.id}`}
                    className={styles.card}
                  >
                    <div className={styles.cardMedia}>
                      {blog.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          className={styles.cardImg}
                        />
                      ) : (
                        <div className={styles.cardPlaceholder}>
                          <FileText size={36} />
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        {blog.created_at && (
                          <>
                            <Calendar size={12} />
                            <span>{formatDate(blog.created_at)}</span>
                          </>
                        )}
                        {blog.reading_time && (
                          <>
                            <span className={styles.cardMetaSep}>·</span>
                            <Clock size={12} />
                            <span>{blog.reading_time} dk</span>
                          </>
                        )}
                      </div>
                      <h3 className={styles.cardTitle}>{blog.title}</h3>
                      {blog.excerpt && (
                        <p className={styles.cardExcerpt}>{blog.excerpt}</p>
                      )}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className={styles.cardTags}>
                          {blog.tags.slice(0, 3).map((t) => (
                            <span key={t} className={styles.cardTag}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className={styles.cardArrow}>
                        Devamını oku <ArrowRight size={14} />
                      </span>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            ) : !featured ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <FileText size={28} />
                </div>
                <h3 className={styles.emptyTitle}>Yazı bulunamadı</h3>
                <p className={styles.emptyText}>
                  {searchTerm.trim() || selectedTag !== 'all'
                    ? 'Arama kriterlerine uygun yazı yok. Farklı anahtar kelime veya filtre dene.'
                    : 'Henüz yayınlanmış yazı yok. Yakında burada olacaklar.'}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
