'use client'
// src/app/components/admin/layout/AdminBreadcrumb.tsx

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home } from 'lucide-react'
import styles from '@/styles/components/AdminLayoutAurora.module.css'

const pathNameMap: { [key: string]: string } = {
  '/admin': 'Dashboard',
  '/admin/profile': 'Profil',
  '/admin/projects': 'Projeler',
  '/admin/projects/new': 'Yeni Proje',
  '/admin/experiences': 'Deneyimler',
  '/admin/experiences/new': 'Yeni Deneyim',
  '/admin/education': 'Eğitim',
  '/admin/skills': 'Yetenekler',
  '/admin/blog': 'Blog',
  '/admin/blog/new': 'Yeni Yazı',
  '/admin/messages': 'Mesajlar',
  '/admin/settings': 'Ayarlar',
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function AdminBreadcrumb() {
  const pathname = usePathname()

  if (pathname === '/admin') return null

  const segments = pathname.split('/').filter(Boolean)
  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    let name = pathNameMap[href] || segment

    if (UUID_REGEX.test(segment)) name = 'Detay'
    if (segment === 'edit') name = 'Düzenle'

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      href,
      current: index === segments.length - 1,
    }
  })

  return (
    <nav className={styles.breadcrumb}>
      <Link href="/admin" className={styles.breadcrumbLink}>
        <Home size={12} />
        Dashboard
      </Link>
      {items.map((item) => (
        <span key={item.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.breadcrumbSep}>/</span>
          {item.current ? (
            <span className={styles.breadcrumbCurrent}>{item.name}</span>
          ) : (
            <Link href={item.href} className={styles.breadcrumbLink}>
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
