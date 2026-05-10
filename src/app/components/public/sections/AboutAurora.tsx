'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  FileText,
  GraduationCap,
  MapPin,
  Mail,
} from 'lucide-react'
import styles from '@/styles/components/AboutAurora.module.css'

interface Profile {
  full_name?: string
  title?: string
  bio?: string
  email?: string
  location?: string
  avatar_url?: string
  github?: string
  linkedin?: string
  website?: string
}

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  current?: boolean
  description?: string
  technologies?: string[]
}

interface Skill {
  id: string
  name: string
  level: string
  category?: string
}

interface Education {
  id: string
  institution: string
  school?: string
  degree: string
  field: string
  start_date: string
  end_date?: string
  description?: string
}

interface AboutAuroraProps {
  profile?: Profile | null
  experiences?: Experience[] | null
  skills?: Skill[] | null
  education?: Education[] | null
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

const LEVEL_DOTS: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatPeriod(start?: string, end?: string, current?: boolean): string {
  if (!start) return ''
  const startYear = new Date(start).getFullYear()
  if (current) return `${startYear} → şimdi`
  if (!end) return `${startYear}`
  const endYear = new Date(end).getFullYear()
  return endYear === startYear ? `${startYear}` : `${startYear} → ${endYear}`
}

export default function AboutAurora({
  profile,
  experiences,
  skills,
  education,
}: AboutAuroraProps) {
  const [avatarError, setAvatarError] = useState(false)

  const fullName = profile?.full_name || 'Murat Sağ'
  const title = profile?.title || 'Software Developer & Computer Engineering Student'
  const bio =
    profile?.bio ||
    'Java, Python, C, Dart ve C# gibi programlama dillerinde deneyim sahibi, React.js ve Spring Boot teknolojileriyle projeler geliştiren bir yazılım geliştirici.'
  const initials = getInitials(fullName)
  const [firstName, ...rest] = fullName.split(' ')
  const lastName = rest.join(' ')

  // Skills'i kategoriye göre grupla, kategori sayısına göre azalan sırala
  const skillsByCategory: Record<string, Skill[]> = {}
  if (skills) {
    skills.forEach((s) => {
      const cat = s.category || 'Diğer'
      if (!skillsByCategory[cat]) skillsByCategory[cat] = []
      skillsByCategory[cat].push(s)
    })
  }
  const skillCategories = Object.entries(skillsByCategory).sort(
    (a, b) => b[1].length - a[1].length
  )

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroLeft}>
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.sectionLabel}
                >
                  Profil / Hakkımda
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className={styles.heroTitle}
                >
                  {firstName}
                  {lastName && <> <span className={styles.heroTitleAccent}>{lastName}</span></>}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className={styles.heroSubtitle}
                >
                  {title}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className={styles.heroMeta}
                >
                  {profile?.location && (
                    <span className={styles.heroMetaItem}>
                      <MapPin size={13} />
                      {profile.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className={styles.heroMetaItem}>
                      <Mail size={13} />
                      {profile.email}
                    </a>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <div className={styles.avatarWrap}>
                  <div className={styles.avatarGlow} />
                  <div className={styles.avatar}>
                    {profile?.avatar_url && !avatarError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={fullName}
                        className={styles.avatarImg}
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span className={styles.avatarFallback}>{initials}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BIO */}
        <section className={styles.section}>
          <div className={styles.containerNarrow}>
            <motion.div {...fadeUp} className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>01 / Kim</p>
              <h2 className={styles.sectionTitle}>Kısaca tanışalım.</h2>
            </motion.div>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className={styles.bioText}>
              {bio}
            </motion.p>

            {/* Stats */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className={styles.statsBar}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Deneyim</p>
                <p className={styles.statValue}>{experiences?.length || 0}</p>
                <p className={styles.statSub}>pozisyon</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Yetenek</p>
                <p className={styles.statValue}>{skills?.length || 0}</p>
                <p className={styles.statSub}>teknoloji</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Eğitim</p>
                <p className={styles.statValue}>{education?.length || 0}</p>
                <p className={styles.statSub}>kurum</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <motion.div {...fadeUp} className={styles.sectionHeader}>
                <p className={styles.sectionLabel}>02 / Deneyim</p>
                <h2 className={styles.sectionTitle}>Yolculuk.</h2>
              </motion.div>
              <div className={styles.timeline}>
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className={styles.timelineItem}
                  >
                    <span className={styles.timelineDate}>
                      {formatPeriod(exp.start_date, exp.end_date, exp.current)}
                    </span>
                    <span className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>{exp.title}</h3>
                      <span className={styles.timelineCompany}>
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </span>
                      {exp.description && <p className={styles.timelineDesc}>{exp.description}</p>}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className={styles.techRow}>
                          {exp.technologies.map((t) => (
                            <span key={t} className={styles.techTag}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skillCategories.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <motion.div {...fadeUp} className={styles.sectionHeader}>
                <p className={styles.sectionLabel}>03 / Yetenekler</p>
                <h2 className={styles.sectionTitle}>Çalıştığım araçlar.</h2>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className={styles.skillGrid}
              >
                {skillCategories.map(([category, items]) => (
                  <motion.div
                    key={category}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.skillCategoryCard}
                  >
                    <h3 className={styles.skillCategoryName}>
                      {category}
                      <span className={styles.skillCategoryCount}>· {items.length}</span>
                    </h3>
                    {items.map((s) => {
                      const filled = LEVEL_DOTS[s.level] ?? 0
                      return (
                        <div key={s.id} className={styles.skillRow}>
                          <span className={styles.skillName}>{s.name}</span>
                          <div
                            className={styles.levelDots}
                            title={LEVEL_LABELS[s.level] || s.level}
                            aria-label={`Seviye: ${LEVEL_LABELS[s.level] || s.level}`}
                          >
                            {[1, 2, 3, 4].map((d) => (
                              <span
                                key={d}
                                className={`${styles.dot} ${d <= filled ? styles.dotFilled : ''}`}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <motion.div {...fadeUp} className={styles.sectionHeader}>
                <p className={styles.sectionLabel}>04 / Eğitim</p>
                <h2 className={styles.sectionTitle}>Akademik geçmiş.</h2>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className={styles.eduGrid}
              >
                {education.map((edu) => (
                  <motion.div
                    key={edu.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.eduCard}
                  >
                    <div className={styles.eduIcon}>
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className={styles.eduDegree}>{edu.degree}</h3>
                      <p className={styles.eduSchool}>
                        {edu.institution}
                        {edu.school ? ` · ${edu.school}` : ''}
                        {edu.field ? ` — ${edu.field}` : ''}
                      </p>
                      <p className={styles.eduPeriod}>{formatPeriod(edu.start_date, edu.end_date)}</p>
                      {edu.description && <p className={styles.eduDesc}>{edu.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* CV DOWNLOAD */}
        <section className={styles.section}>
          <div className={styles.container}>
            <motion.div {...fadeUp} className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>05 / CV</p>
              <h2 className={styles.sectionTitle}>Tam dökümanı al.</h2>
            </motion.div>
            <motion.a
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              href="/cv-murat-sag.pdf"
              download="Murat-Sag-CV.pdf"
              className={styles.cvCard}
            >
              <div className={styles.cvIcon}>
                <FileText size={28} />
              </div>
              <div className={styles.cvBody}>
                <h3 className={styles.cvTitle}>Murat Sağ — CV (PDF)</h3>
                <p className={styles.cvDesc}>
                  Tüm deneyim, yetenek ve eğitim bilgisi tek dökümanda. Güncel sürüm.
                </p>
              </div>
              <span className={styles.cvBtn}>
                <Download size={18} />
                İndir
              </span>
            </motion.a>
          </div>
        </section>

        {/* Footer spacer */}
        <div style={{ height: '4rem' }} aria-hidden="true" />
      </div>
    </main>
  )
}
