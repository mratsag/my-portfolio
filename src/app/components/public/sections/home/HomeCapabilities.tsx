import { Code2, Smartphone, Server } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'
import { SectionHead } from './SectionHead'

const CAPS = [
  {
    icon: Code2,
    title: 'Web Geliştirme',
    desc: 'React, Next.js ve TypeScript ile hızlı, erişilebilir ve SEO-dostu web uygulamaları. Fikirden yayına uçtan uca.',
  },
  {
    icon: Smartphone,
    title: 'Mobil Uygulama',
    desc: 'Modern, akıcı ve kullanıcı odaklı mobil deneyimler. Tek kod tabanından çoklu platform.',
  },
  {
    icon: Server,
    title: 'Backend & API',
    desc: 'Java/Spring Boot, Python ve SQL ile ölçeklenebilir backend sistemleri ve temiz REST API tasarımı.',
  },
]

export function HomeCapabilities() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHead index="03" comment="// section.services" title="Nasıl yardımcı olurum." />

        <div className={styles.capList}>
          {CAPS.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className={styles.capItem}>
                <span className={styles.capIcon}>
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className={styles.capTitle}>{c.title}</h3>
                  <p className={styles.capDesc}>{c.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
