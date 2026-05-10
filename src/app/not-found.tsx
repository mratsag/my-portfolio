import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import { ArrowRight, Home, Mail, Search } from 'lucide-react'
import styles from '@/styles/components/NotFoundAurora.module.css'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata = {
  title: '404 — Sayfa Bulunamadı | Murat Sağ',
  description: 'Aradığın sayfa bulunamadı.',
}

export default function NotFound() {
  return (
    <div className={`${geist.variable} ${geistMono.variable}`}>
      <main className={styles.page}>
        <div className={styles.glowBg} aria-hidden="true" />

        <div className={styles.content}>
          <p className={styles.label}>Hata / 404</p>
          <h1 className={styles.bigCode}>404</h1>
          <p className={styles.title}>Sayfa bulunamadı.</p>
          <p className={styles.sub}>
            Aradığın sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Yanlış
            bir bağlantıya tıkladıysan haber ver.
          </p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primary}>
              <Home size={16} />
              Ana sayfaya dön
            </Link>
            <Link href="/contact" className={styles.ghost}>
              <Mail size={16} />
              Bana yaz
            </Link>
          </div>

          <div className={styles.suggestionList}>
            <p className={styles.suggestionTitle}>
              <Search size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
              Belki şuna mı bakıyordun?
            </p>
            <div className={styles.suggestions}>
              <Link href="/projects" className={styles.suggestion}>
                Projeler
                <ArrowRight size={14} className={styles.suggestionArrow} />
              </Link>
              <Link href="/blog" className={styles.suggestion}>
                Blog
                <ArrowRight size={14} className={styles.suggestionArrow} />
              </Link>
              <Link href="/about" className={styles.suggestion}>
                Hakkımda
                <ArrowRight size={14} className={styles.suggestionArrow} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
