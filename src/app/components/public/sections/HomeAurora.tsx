'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Sparkles, Code2, FileText } from 'lucide-react'
import type { Skill, Experience } from '@/lib/types'
import styles from '@/styles/components/HomeAurora.module.css'

interface LatestProject {
  id: string
  title: string
  description: string
  image_url?: string | null
  technologies?: string[] | null
  slug?: string | null
}

interface LatestBlog {
  id: string
  title: string
  excerpt: string
  image_url?: string | null
  tags?: string[] | null
  reading_time?: number | null
  created_at: string
}

interface HomeAuroraProps {
  profile?: {
    full_name?: string
    title?: string
    bio?: string
    email?: string
    location?: string
    github?: string
    linkedin?: string
    avatar_url?: string
  }
  skills: Skill[]
  experiences: Experience[]
  projectCount: number
  blogCount: number
  latestProject?: LatestProject | null
  latestBlog?: LatestBlog | null
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

const ROTATING_TITLES = [
  'Software Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Backend Engineer',
  'Bilgisayar Mühendisi',
]

function useTypewriter(words: string[], speed = 100, pause = 1800) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }
    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? speed / 2 : speed
    )
    return () => clearTimeout(t)
  }, [text, deleting, index, words, speed, pause])

  return text
}

// Initials fallback for avatar
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function HomeAurora({
  profile,
  skills,
  experiences,
  projectCount,
  blogCount,
  latestProject,
  latestBlog,
}: HomeAuroraProps) {
  const typed = useTypewriter(ROTATING_TITLES)
  const [avatarError, setAvatarError] = useState(false)

  const fullName = profile?.full_name || 'Murat Sağ'
  const [firstName, ...rest] = fullName.split(' ')
  const lastName = rest.join(' ')
  const email = profile?.email || 'murat@muratsag.com'
  const location = profile?.location || 'Karabük, Türkiye'
  const avatarUrl = profile?.avatar_url
  const initials = getInitials(fullName)

  // Skills'i kategoriye göre grupla
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
  const skillCategories = Object.entries(skillsByCategory)
    .sort((a, b) => b[1].length - a[1].length)

  // Marquee için skill isimleri (2 kez tekrar)
  const allSkillNames = skills.map((s) => s.name)
  const marqueeItems = [...allSkillNames, ...allSkillNames]

  // Aktif/son deneyim
  const currentExp = experiences.find((e) => e.current) || experiences[0]

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO — 2 kolon: sol metin, sağ avatar */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              {/* Sol */}
              <div className={styles.heroLeft}>
                {currentExp && (
                  <motion.div {...fadeUp} className={styles.statusPill}>
                    <span className={styles.statusDot} />
                    Şu an {currentExp.company}&apos;da
                  </motion.div>
                )}

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className={styles.heroGreeting}
                >
                  Merhaba, ben —
                </motion.p>

                <motion.h1
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className={styles.heroName}
                >
                  {firstName}{lastName && <> <span className={styles.heroNameAccent}>{lastName}</span></>}
                </motion.h1>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                  className={styles.heroSubtitle}
                >
                  {typed}
                  <span className={styles.heroCursor} />
                </motion.div>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                  className={styles.heroCtas}
                >
                  <Link href="/contact" className={styles.ctaPrimary}>
                    İletişime geç
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/projects" className={styles.ctaGhost}>
                    Projeleri gör
                  </Link>
                </motion.div>
              </div>

              {/* Sağ — avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className={styles.heroRight}
              >
                <div className={styles.avatarWrap}>
                  <div className={styles.avatarGlow} />
                  <div className={styles.avatar}>
                    {avatarUrl && !avatarError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
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

        {/* BENTO GRID */}
        <section className={styles.section}>
          <div className={styles.container}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className={styles.sectionLabel}
            >
              01 / Hakkımda
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={styles.sectionTitle}
            >
              Kısaca.
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className={styles.bento}
            >
              {/* Büyük kart — top skill kategorisi */}
              {skillCategories[0] && (
                <motion.div
                  variants={fadeUp}
                  className={`${styles.bentoCard} ${styles.bentoLarge}`}
                >
                  <div className={styles.bentoIcon}>
                    <Code2 size={20} color="#2563EB" />
                  </div>
                  <p className={styles.bentoLabel}>En çok çalıştığım</p>
                  <h3 className={styles.bentoTitle}>{skillCategories[0][0]}</h3>
                  <p className={styles.bentoText}>
                    {skillCategories[0][1].length} farklı teknolojide deneyim
                  </p>
                  <div className={styles.skillTags}>
                    {skillCategories[0][1].slice(0, 6).map((s) => (
                      <span key={s.id} className={styles.skillTag}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* GitHub */}
              {profile?.github && (
                <motion.a
                  variants={fadeUp}
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.bentoCard} ${styles.bentoCardLink}`}
                >
                  <Github size={28} />
                  <p className={styles.bentoLabel} style={{ marginTop: '1rem' }}>
                    GitHub
                  </p>
                  <p className={styles.bentoTitle}>@muratsag</p>
                  <ArrowRight className={styles.bentoLink} size={18} />
                </motion.a>
              )}

              {/* Project count */}
              <motion.div variants={fadeUp} className={styles.bentoCard}>
                <p className={styles.bentoLabel}>Proje</p>
                <p className={`${styles.bentoValue} ${styles.bentoValueAccent}`}>{projectCount}+</p>
                <p className={styles.bentoText}>tamamlanmış iş</p>
              </motion.div>

              {/* Currently */}
              {currentExp && (
                <motion.div
                  variants={fadeUp}
                  className={`${styles.bentoCard} ${styles.bentoWide} ${styles.bentoHighlight}`}
                >
                  <div className={styles.bentoIcon}>
                    <Sparkles size={20} color="#2563EB" />
                  </div>
                  <p className={styles.bentoLabel}>Şu an</p>
                  <h3 className={styles.bentoTitle}>{currentExp.title}</h3>
                  <p className={styles.bentoText}>{currentExp.company}</p>
                </motion.div>
              )}

              {/* LinkedIn */}
              {profile?.linkedin && (
                <motion.a
                  variants={fadeUp}
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.bentoCard} ${styles.bentoCardLink}`}
                >
                  <Linkedin size={28} />
                  <p className={styles.bentoLabel} style={{ marginTop: '1rem' }}>
                    LinkedIn
                  </p>
                  <p className={styles.bentoTitle}>Bağlan</p>
                  <ArrowRight className={styles.bentoLink} size={18} />
                </motion.a>
              )}

              {/* Skills total */}
              <motion.div variants={fadeUp} className={styles.bentoCard}>
                <p className={styles.bentoLabel}>Yetenek</p>
                <p className={`${styles.bentoValue} ${styles.bentoValueAccent}`}>{skills.length}</p>
                <p className={styles.bentoText}>teknoloji</p>
              </motion.div>

              {/* Location */}
              <motion.div
                variants={fadeUp}
                className={`${styles.bentoCard} ${styles.bentoWide}`}
              >
                <div className={styles.bentoIcon}>
                  <MapPin size={20} color="#2563EB" />
                </div>
                <p className={styles.bentoLabel}>Konum</p>
                <h3 className={styles.bentoTitle}>{location}</h3>
                <p className={styles.bentoText}>uzaktan çalışmaya açığım</p>
              </motion.div>

              {/* Blog */}
              <motion.a
                variants={fadeUp}
                href="/blog"
                className={`${styles.bentoCard} ${styles.bentoCardLink}`}
              >
                <FileText size={28} />
                <p className={styles.bentoLabel} style={{ marginTop: '1rem' }}>
                  Blog
                </p>
                <p className={styles.bentoTitle}>{blogCount} yazı</p>
                <ArrowRight className={styles.bentoLink} size={18} />
              </motion.a>
            </motion.div>

            {/* Skills marquee */}
            {marqueeItems.length > 0 && (
              <div className={styles.marquee}>
                <div className={styles.marqueeTrack}>
                  {marqueeItems.map((name, i) => (
                    <div key={`${name}-${i}`} className={styles.marqueeItem}>
                      <strong>0{(i % 9) + 1}</strong>
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SON ZAMANLARDA — son proje + son blog */}
        {(latestProject || latestBlog) && (
          <section className={styles.section}>
            <div className={styles.container}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className={styles.sectionLabel}
              >
                02 / Son zamanlarda
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={styles.sectionTitle}
              >
                Yeni eklenenler.
              </motion.h2>

              <div className={styles.recentGrid}>
                {/* Son proje */}
                {latestProject && (
                  <motion.a
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    href={`/projects/${latestProject.slug || latestProject.id}`}
                    className={styles.recentCard}
                  >
                    <div className={styles.recentMedia}>
                      {latestProject.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestProject.image_url}
                          alt={latestProject.title}
                          className={styles.recentImg}
                        />
                      ) : (
                        <div className={styles.recentPlaceholder} aria-hidden="true">
                          <Code2 size={32} />
                        </div>
                      )}
                    </div>
                    <div className={styles.recentBody}>
                      <span className={styles.recentLabel}>Son proje</span>
                      <h3 className={styles.recentTitle}>{latestProject.title}</h3>
                      <p className={styles.recentText}>{latestProject.description}</p>
                      {latestProject.technologies && latestProject.technologies.length > 0 && (
                        <div className={styles.recentTags}>
                          {latestProject.technologies.slice(0, 4).map((t) => (
                            <span key={t} className={styles.recentTag}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className={styles.recentArrow}>
                        Projeyi gör <ArrowRight size={16} />
                      </span>
                    </div>
                  </motion.a>
                )}

                {/* Son blog */}
                {latestBlog && (
                  <motion.a
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    href={`/blog/${latestBlog.id}`}
                    className={styles.recentCard}
                  >
                    <div className={styles.recentMedia}>
                      {latestBlog.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestBlog.image_url}
                          alt={latestBlog.title}
                          className={styles.recentImg}
                        />
                      ) : (
                        <div className={styles.recentPlaceholder} aria-hidden="true">
                          <FileText size={32} />
                        </div>
                      )}
                    </div>
                    <div className={styles.recentBody}>
                      <span className={styles.recentLabel}>
                        Son yazı
                        {latestBlog.reading_time ? ` · ${latestBlog.reading_time} dk` : ''}
                      </span>
                      <h3 className={styles.recentTitle}>{latestBlog.title}</h3>
                      <p className={styles.recentText}>{latestBlog.excerpt}</p>
                      {latestBlog.tags && latestBlog.tags.length > 0 && (
                        <div className={styles.recentTags}>
                          {latestBlog.tags.slice(0, 4).map((t) => (
                            <span key={t} className={styles.recentTag}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className={styles.recentArrow}>
                        Yazıyı oku <ArrowRight size={16} />
                      </span>
                    </div>
                  </motion.a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT CTA */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              className={styles.sectionLabel}
            >
              03 / İletişim
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={styles.contactBig}
            >
              Birlikte <span className={styles.contactBigAccent}>çalışalım mı?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2 }}
              className={styles.contactSub}
            >
              Web, mobil veya yazılım projen için aklında bir şey varsa yaz — birlikte konuşalım.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              href={`mailto:${email}`}
              className={styles.contactEmail}
            >
              <Mail size={20} />
              {email}
            </motion.a>
          </div>
        </section>
      </div>
    </main>
  )
}
