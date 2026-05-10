'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Share2,
  Link as LinkIcon,
  Twitter,
  Linkedin,
} from 'lucide-react'
import styles from '@/styles/components/BlogDetailAurora.module.css'

interface BlogDetailAuroraProps {
  blog: {
    id: string
    title: string
    content: string
    excerpt?: string
    author?: string
    created_at: string
    updated_at: string
    image_url?: string
    tags?: string[]
    reading_time?: number
    views?: number
  }
  profile?: {
    full_name?: string
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

export default function BlogDetailAurora({ blog, profile }: BlogDetailAuroraProps) {
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // View increment — session başına 1 kez
  useEffect(() => {
    if (typeof window === 'undefined' || !blog?.id) return
    const sessionKey = `blog_view_${blog.id}`
    if (sessionStorage.getItem(sessionKey)) return

    sessionStorage.setItem(sessionKey, '1')
    fetch(`/api/public/blogs/${blog.id}/view`, { method: 'POST' }).catch(() => {
      sessionStorage.removeItem(sessionKey)
    })
  }, [blog?.id])

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const author = blog.author || profile?.full_name || 'Murat Sağ'
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: blog.title, url })
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(url)}`
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <main className={styles.page}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.div {...fadeUp}>
              <Link href="/blog" className={styles.backLink}>
                <ArrowLeft size={14} />
                Tüm yazılar
              </Link>
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className={styles.sectionLabel}
            >
              Blog / Yazı
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className={styles.title}
            >
              {blog.title}
            </motion.h1>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className={styles.meta}
            >
              <span className={styles.metaItem}>
                <Calendar className={styles.metaIcon} />
                {formatDate(blog.created_at)}
              </span>
              <span className={styles.metaSep}>·</span>
              <span className={styles.metaItem}>
                <User className={styles.metaIcon} />
                {author}
              </span>
              {blog.reading_time && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}>
                    <Clock className={styles.metaIcon} />
                    {blog.reading_time} dk okuma
                  </span>
                </>
              )}
              {typeof blog.views === 'number' && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}>
                    <Eye className={styles.metaIcon} />
                    {blog.views.toLocaleString()} görüntülenme
                  </span>
                </>
              )}
            </motion.div>

            {blog.excerpt && (
              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className={styles.excerpt}
              >
                {blog.excerpt}
              </motion.p>
            )}

            {blog.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className={styles.imageWrap}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.image_url} alt={blog.title} className={styles.image} />
              </motion.div>
            )}
          </div>
        </section>

        {/* ARTICLE BODY */}
        <section className={styles.container}>
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* TAGS */}
          {blog.tags && blog.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {blog.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* SHARE CARD */}
          <div className={styles.shareCard}>
            <h3 className={styles.shareTitle}>Yazıyı beğendin mi?</h3>
            <p className={styles.shareSub}>
              Paylaşırsan çok sevinirim — bağlantıyı kopyala veya sosyal medyada paylaş.
            </p>
            <div className={styles.shareButtons}>
              <button onClick={handleShare} className={`${styles.shareBtn} ${styles.sharePrimary}`}>
                <Share2 size={16} />
                Paylaş
              </button>
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareBtn}
              >
                <Twitter size={16} />
                X / Twitter
              </a>
              <a
                href={linkedinShare}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareBtn}
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <button onClick={handleCopyLink} className={styles.shareBtn}>
                <LinkIcon size={16} />
                {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER NAV */}
        <div className={styles.container}>
          <div className={styles.footerNav}>
            <Link href="/blog" className={styles.allPostsLink}>
              <ArrowLeft size={16} />
              Tüm yazılara dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
