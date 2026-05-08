// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'
import styles from '@/styles/components/HomeSEO.module.css'
import type { Skill, Experience } from '@/lib/types'

// Cache for 10 seconds to allow faster profile updates
export const revalidate = 10

export const metadata: Metadata = {
  title: 'Murat Sağ - Software Developer & Computer Engineering Student',
  description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri konularında deneyimli.',
  keywords: 'yazılım geliştirici, web geliştirme, mobil uygulama, react, next.js, typescript, javascript, portfolio, murat sağ',
  openGraph: {
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri.',
    url: 'https://www.muratsag.com',
    siteName: 'Murat Sağ - Portfolio',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Murat Sağ Portfolio',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://www.muratsag.com',
  },
}

const LEVEL_LABELS: Record<Skill['level'], string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
}

const LEVEL_ORDER: Record<Skill['level'], number> = {
  expert: 0,
  advanced: 1,
  intermediate: 2,
  beginner: 3,
}

function formatExperienceYears(exp: Experience): string {
  const startYear = exp.start_date ? new Date(exp.start_date).getFullYear() : null
  const endYear = exp.end_date ? new Date(exp.end_date).getFullYear() : null

  if (!startYear) return ''
  if (exp.current) return `(${startYear} - Devam ediyor)`
  if (endYear && endYear !== startYear) return `(${startYear}-${endYear})`
  return `(${startYear})`
}

function buildCategoryDescription(category: string, skills: Skill[]): string {
  const topNames = skills
    .slice()
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level])
    .slice(0, 4)
    .map(s => s.name)
    .join(', ')

  return `${category} alanında ${skills.length} farklı teknolojide deneyim. ${topNames ? `Öne çıkanlar: ${topNames}.` : ''}`
}

export default async function Home() {
  const supabase = createSupabaseServerClient()

  const [profileRes, skillsRes, experiencesRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('skills').select('*').order('order_index', { ascending: true }),
    supabase
      .from('experiences')
      .select('*')
      .order('current', { ascending: false })
      .order('start_date', { ascending: false })
      .limit(6),
  ])

  const profile = profileRes.data
  const skills: Skill[] = skillsRes.data ?? []
  const experiences: Experience[] = experiencesRes.data ?? []

  // Skills'i kategoriye göre grupla, kategorileri yetenek sayısına göre sırala
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const skillCategories = Object.entries(skillsByCategory)
    .sort((a, b) => b[1].length - a[1].length)

  return (
    <PublicLayout>
      <HeroSection profile={profile || undefined} />

      {/* SEO için ek içerik - Supabase'den dinamik */}
      {skillCategories.length > 0 && (
        <section className={styles.seoSection}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.mainTitle}>
                Yazılım Geliştirici & <span>Bilgisayar Mühendisliği Öğrencisi</span>
              </h2>
              <div className={styles.grid}>
                {skillCategories.map(([category, categorySkills]) => (
                  <div key={category} className={styles.skillCard}>
                    <h3 className={styles.skillTitle}>{category}</h3>
                    <p className={styles.skillDescription}>
                      {buildCategoryDescription(category, categorySkills)}
                    </p>
                    <ul className={styles.skillList}>
                      {categorySkills
                        .slice()
                        .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level])
                        .map(skill => (
                          <li key={skill.id} className={styles.skillItem}>
                            {skill.name} ({LEVEL_LABELS[skill.level]})
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* İletişim CTA - Deneyimler dinamik */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Projeleriniz İçin İletişime Geçin
          </h2>
          <p className={styles.ctaDescription}>
            Web sitesi, mobil uygulama veya yazılım projeleriniz için profesyonel çözümler sunuyorum.
            Karabük Üniversitesi Bilgisayar Mühendisliği öğrencisi olarak en güncel teknolojileri kullanarak
            projelerinizi hayata geçiriyorum.
          </p>

          {experiences.length > 0 && (
            <div className={styles.experienceHighlights}>
              <h3 className={styles.experienceTitle}>Profesyonel Deneyimler</h3>
              <ul className={styles.experienceList}>
                {experiences.map(exp => (
                  <li key={exp.id} className={styles.experienceItem}>
                    {exp.title} - {exp.company} {formatExperienceYears(exp)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href="/contact" className={styles.ctaButton}>
            İletişime Geç
          </a>
        </div>
      </section>
    </PublicLayout>
  )
}
