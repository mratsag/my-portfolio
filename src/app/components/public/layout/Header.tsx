'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import styles from '@/styles/public/Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <header className={styles.header} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Murat Sağ</span>
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`} data-theme={theme}>
          <Link href="/" className={styles.navLink}>
            Ana Sayfa
          </Link>
          <Link href="/about" className={styles.navLink}>
            Hakkımda
          </Link>
          <Link href="/projects" className={styles.navLink}>
            Projeler
          </Link>
          <Link href="/blog" className={styles.navLink}>
            Blog
          </Link>
          <Link href="/contact" className={styles.navLink}>
            İletişim
          </Link>
        </nav>

        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? (
              <Sun className={styles.themeIcon} />
            ) : (
              <Moon className={styles.themeIcon} />
            )}
          </button>

          <button
            onClick={toggleMenu}
            className={styles.mobileMenuButton}
            aria-label="Menüyü aç/kapat"
          >
            {isMenuOpen ? (
              <X className={styles.menuIcon} />
            ) : (
              <Menu className={styles.menuIcon} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
} 