'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import styles from '@/styles/public/BlogDetailSection.module.css'

interface BlogDetailSectionProps {
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
  }
  profile?: {
    full_name?: string
  }
}

export default function BlogDetailSection({ blog, profile }: BlogDetailSectionProps) {
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
    <div className={styles.blogDetail} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <Link href="/blog" className={styles.backLink}>
              <ArrowLeft className={styles.backIcon} />
              Blog'a Dön
            </Link>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Calendar className={styles.metaIcon} />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className={styles.metaItem}>
                <User className={styles.metaIcon} />
                <span>{blog.author || profile?.full_name || 'Anonim'}</span>
              </div>
            </div>

            <h1 className={styles.title}>{blog.title}</h1>
            
            {blog.excerpt && (
              <p className={styles.excerpt}>{blog.excerpt}</p>
            )}

            {blog.image_url && (
              <div className={styles.imageContainer}>
                <img 
                  src={blog.image_url} 
                  alt={blog.title}
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
            <div className={styles.article}>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.shareSection}>
                <h3 className={styles.sidebarTitle}>
                  <Share2 className={styles.sidebarIcon} />
                  Paylaş
                </h3>
                <div className={styles.shareButtons}>
                  <button 
                    onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
                    className={styles.shareButton}
                  >
                    Paylaş
                  </button>
                </div>
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className={styles.tagsSection}>
                  <h3 className={styles.sidebarTitle}>Etiketler</h3>
                  <div className={styles.tags}>
                    {blog.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
} 