import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'

interface WritingPost {
  id: string
  title: string
  slug?: string | null
  excerpt: string
  tags?: string[] | null
  reading_time?: number | null
  created_at: string
}

export function HomeWriting({ posts }: { posts: WritingPost[] }) {
  if (!posts.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headRow}>
          <div className={styles.head} style={{ marginBottom: 0 }}>
            <p className={styles.marker}>
              <span className={styles.markerIndex}>05</span>
              {'  '}
              <span className={styles.markerComment}>{'// section.writing'}</span>
            </p>
            <h2 className={styles.sectionTitle}>Son yazılar.</h2>
          </div>
          <Link href="/blog" className={styles.allLink}>
            Tüm yazılar <ArrowRight size={14} />
          </Link>
        </div>

        <div className={styles.writeList}>
          {posts.map((b) => {
            const date = new Intl.DateTimeFormat('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(b.created_at))
            return (
              <Link key={b.id} href={`/blog/${b.slug || b.id}`} className={styles.writeItem}>
                <div className={styles.writeInner}>
                  <span className={styles.writeDate}>
                    {date}
                    {b.reading_time ? ` · ${b.reading_time}dk` : ''}
                  </span>
                  <div>
                    <h3 className={styles.writeTitle}>{b.title}</h3>
                    <p className={styles.writeExcerpt}>{b.excerpt}</p>
                    {b.tags && b.tags.length > 0 && (
                      <div className={styles.writeTags}>
                        {b.tags.slice(0, 3).map((t) => (
                          <span key={t}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
