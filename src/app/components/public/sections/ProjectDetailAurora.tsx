'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Code2,
  ExternalLink,
  Github,
  Link as LinkIcon,
  Share2,
  Sparkles,
} from 'lucide-react'
import styles from '@/styles/components/ProjectDetailAurora.module.css'

interface ProjectDetailAuroraProps {
  project: {
    id: string
    title: string
    description: string
    content?: string
    technologies?: string[]
    github_url?: string
    demo_url?: string
    live_url?: string
    image_url?: string
    status?: string
    featured?: boolean
    created_at: string
    updated_at: string
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProjectDetailAurora({ project }: ProjectDetailAuroraProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: project.title, url: window.location.href })
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const liveUrl = project.live_url || project.demo_url

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.div {...fadeUp}>
              <Link href="/projects" className={styles.backLink}>
                <ArrowLeft size={14} />
                Tüm projeler
              </Link>
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className={styles.sectionLabel}
            >
              Çalışmalar / Proje
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className={styles.title}
            >
              {project.title}
            </motion.h1>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className={styles.meta}
            >
              <span className={styles.metaItem}>
                <Calendar size={13} />
                {formatDate(project.created_at)}
              </span>
              {project.status && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span
                    className={`${styles.statusPill} ${project.status === 'draft' ? styles.statusPillDraft : ''}`}
                  >
                    <span className={styles.statusDot} />
                    {project.status === 'published'
                      ? 'Yayında'
                      : project.status === 'draft'
                        ? 'Taslak'
                        : project.status}
                  </span>
                </>
              )}
              {project.featured && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.featuredPill}>
                    <Sparkles size={12} />
                    Öne çıkan
                  </span>
                </>
              )}
            </motion.div>

            {project.description && (
              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className={styles.description}
              >
                {project.description}
              </motion.p>
            )}

            {/* ACTION BUTTONS */}
            {(liveUrl || project.github_url) && (
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.25 }}
                className={styles.actions}
              >
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionPrimary}
                  >
                    <ExternalLink size={16} />
                    Canlı Görüntüle
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionGhost}
                  >
                    <Github size={16} />
                    GitHub&apos;da Aç
                  </a>
                )}
              </motion.div>
            )}

            {project.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className={styles.imageWrap}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image_url} alt={project.title} className={styles.image} />
              </motion.div>
            )}
          </div>
        </section>

        {/* TECH SECTION */}
        {project.technologies && project.technologies.length > 0 && (
          <section className={styles.container}>
            <div className={styles.techSection}>
              <p className={styles.techHeader}>
                <Code2 size={14} />
                Kullanılan Teknolojiler
              </p>
              <div className={styles.techList}>
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ARTICLE BODY */}
        {project.content && (
          <section className={styles.container}>
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={styles.article}
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </section>
        )}

        {/* FOOTER CARD */}
        <section className={styles.container}>
          <div className={styles.footerCard}>
            <h3 className={styles.footerTitle}>Bu projeyle ilgileniyor musun?</h3>
            <p className={styles.footerSub}>
              Detaylı konuşmak veya benzer bir proje için iletişime geç.
            </p>
            <div className={styles.footerLinks}>
              <Link href="/contact" className={styles.actionPrimary}>
                <ArrowRight size={16} />
                İletişime geç
              </Link>
              <button
                type="button"
                onClick={handleShare}
                className={styles.actionGhost}
              >
                <Share2 size={16} />
                Paylaş
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className={styles.actionGhost}
              >
                <LinkIcon size={16} />
                {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER NAV */}
        <div className={styles.container}>
          <div className={styles.footerNav}>
            <Link href="/projects" className={styles.allLink}>
              <ArrowLeft size={16} />
              Tüm projelere dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
