import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Code2 } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'

interface WorkProject {
  id: string
  title: string
  slug?: string | null
  description: string
  image_url?: string | null
  technologies?: string[] | null
  created_at: string
}

export function HomeWork({ projects }: { projects: WorkProject[] }) {
  if (!projects.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headRow}>
          <div className={styles.head} style={{ marginBottom: 0 }}>
            <p className={styles.marker}>
              <span className={styles.markerIndex}>04</span>
              {'  '}
              <span className={styles.markerComment}>{'// section.work'}</span>
            </p>
            <h2 className={styles.sectionTitle}>Seçili işler.</h2>
          </div>
          <Link href="/projects" className={styles.allLink}>
            Tüm projeler <ArrowRight size={14} />
          </Link>
        </div>

        <div className={styles.workGrid}>
          {projects.map((p) => {
            const year = new Date(p.created_at).getFullYear()
            const type = p.technologies?.[0] || 'Proje'
            return (
              <Link key={p.id} href={`/projects/${p.slug || p.id}`} className={styles.card}>
                <div className={styles.cardMedia}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.cardPlaceholder}>
                      <Code2 size={28} />
                    </div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardMeta}>
                    {year} · {type}
                  </p>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.description}</p>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className={styles.tags}>
                      {p.technologies.slice(0, 3).map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={styles.cardLink}>
                    İncele <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
