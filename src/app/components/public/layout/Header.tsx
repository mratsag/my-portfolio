'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import styles from '@/styles/public/Header.module.css'

const LINKS = [
  { href: '/', label: 'ana sayfa' },
  { href: '/about', label: 'hakkımda' },
  { href: '/projects', label: 'projeler' },
  { href: '/blog', label: 'blog' },
  { href: '/contact', label: 'iletişim' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* SOL: logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>M</span>
          muratsag
        </Link>

        {/* SAĞ: nav + tema + hamburger */}
        <div className={styles.right}>
          <nav className={styles.nav}>
            {LINKS.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(styles.link, active && styles.linkActive)}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Tema değiştir"
              className={styles.iconBtn}
            >
              {mounted && theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menüyü aç/kapat"
              className={cn(styles.iconBtn, styles.burger)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL nav */}
      {open && (
        <nav className={styles.mobileNav}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={styles.mobileLink}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
