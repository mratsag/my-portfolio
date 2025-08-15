'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import styles from '@/styles/public/Footer.module.css'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <footer className={styles.footer} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>Murat Sağ</h3>
            <p className={styles.description}>
              Software Developer & Computer Engineering Student
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Hızlı Linkler</h4>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>
                Hakkımda
              </Link>
              <Link href="/projects" className={styles.link}>
                Projeler
              </Link>
              <Link href="/blog" className={styles.link}>
                Blog
              </Link>
              <Link href="/contact" className={styles.link}>
                İletişim
              </Link>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Sosyal Medya</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/muratsag"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <Github className={styles.socialIcon} />
              </a>
              <a
                href="https://linkedin.com/in/muratsag"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin className={styles.socialIcon} />
              </a>
              <a
                href="https://twitter.com/muratsag"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <Twitter className={styles.socialIcon} />
              </a>
              <a
                href="mailto:mrat.sag@hotmail.com"
                className={styles.socialLink}
                aria-label="Email"
              >
                <Mail className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {currentYear} Murat Sağ. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  )
} 