// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'
import styles from '@/styles/components/HomeSEO.module.css'

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

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  return (
    <PublicLayout>
      <HeroSection profile={profile || undefined} />
        
        {/* SEO için ek içerik - CV'den alınan bilgilerle */}
        <section className={styles.seoSection}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.mainTitle}>
                Yazılım Geliştirici & <span>Bilgisayar Mühendisliği Öğrencisi</span>
              </h2>
              <div className={styles.grid}>
                <div className={styles.skillCard}>
                  <h3 className={styles.skillTitle}>Program Dilleri & Backend</h3>
                  <p className={styles.skillDescription}>
                    Java, Python, C, C#, Dart gibi programlama dillerinde ileri seviye deneyim. 
                    Spring Boot, Django ve .NET framework&apos;leri ile backend sistemleri geliştiriyorum.
                  </p>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>Java (İleri Seviye) - Ziraat ATM Projesi</li>
                    <li className={styles.skillItem}>Python (İleri Seviye) - WeatherSocket Projesi</li>
                    <li className={styles.skillItem}>C (İleri Seviye) - Socket Programming</li>
                    <li className={styles.skillItem}>C# (İleri Seviye) - Weekly Tracking</li>
                    <li className={styles.skillItem}>Dart (Orta Seviye) - Servis App Mobile</li>
                    <li className={styles.skillItem}>Spring Boot (Orta Seviye) - Full Stack Projesi</li>
                  </ul>
                </div>
                <div className={styles.skillCard}>
                  <h3 className={styles.skillTitle}>Web & Mobil Geliştirme</h3>
                  <p className={styles.skillDescription}>
                    React.js, Next.js, TypeScript ile modern web uygulamaları. 
                    Flutter ile cross-platform mobil uygulamalar geliştiriyorum.
                  </p>
                  <ul className={styles.skillList}>
                    <li className={styles.skillItem}>React.js (Orta Seviye) - Adataha Web Site</li>
                    <li className={styles.skillItem}>HTML/CSS (İleri Seviye) - BTK Website</li>
                    <li className={styles.skillItem}>JavaScript (Orta Seviye) - CV Projesi</li>
                    <li className={styles.skillItem}>Flutter & Dart - Cross-platform Mobile</li>
                    <li className={styles.skillItem}>MySQL (İleri Seviye) - Veritabanı Yönetimi</li>
                    <li className={styles.skillItem}>pgAdmin (Orta Seviye) - PostgreSQL</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* İletişim CTA - CV'den alınan deneyimlerle */}
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
            
            {/* CV'den alınan deneyimler */}
            <div className={styles.experienceHighlights}>
              <h3 className={styles.experienceTitle}>Profesyonel Deneyimler</h3>
              <ul className={styles.experienceList}>
                <li className={styles.experienceItem}>Software Developer - Kabul Yazılım (2025)</li>
                <li className={styles.experienceItem}>Mobil Uygulama Geliştirici - AZR Bilişim (2024-2025)</li>
                <li className={styles.experienceItem}>Intern - Reset Bilgi Teknolojileri (2025)</li>
                <li className={styles.experienceItem}>TEKNOFEST Finalist - Akıllı Wi-Fi Kapsama (2024)</li>
              </ul>
            </div>
            
            <a href="/contact" className={styles.ctaButton}>
              İletişime Geç
            </a>
          </div>
        </section>
      </PublicLayout>
    )
}
