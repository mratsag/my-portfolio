import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'
import { SectionHead } from './SectionHead'

type Stat = { value: string; label: string; detail: string }

export function HomeAbout({
  profile,
  stats,
}: {
  profile?: { full_name?: string; bio?: string }
  stats: Stat[]
}) {
  const bio =
    profile?.bio ||
    'Bilgisayar mühendisliği öğrencisiyim ve full-stack geliştirici olarak web ile mobil ürünler geliştiriyorum.'

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHead index="02" comment="// section.about" title="Kısaca ben." />

        <div className={styles.prose}>
          <p>{bio}</p>
          <p>
            İşin hem tasarım hem mühendislik tarafından keyif alırım. Yeni teknolojiler öğrenmeyi ve
            öğrendiklerimi gerçek projelerde uygulamayı seviyorum.
          </p>
        </div>

        <Link href="/about" className={styles.moreLink}>
          Daha fazlası <ArrowRight size={15} />
        </Link>

        <div className={styles.statGrid}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statDetail}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
