'use client'
// src/app/components/admin/layout/AdminSidebar.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  MessageSquare,
  Settings,
  X,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import styles from '@/styles/components/AdminLayoutAurora.module.css'

interface NavChild {
  name: string
  href: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  children?: NavChild[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Profil', href: '/admin/profile', icon: User },
  {
    name: 'Projeler',
    href: '/admin/projects',
    icon: Code,
    children: [
      { name: 'Tüm Projeler', href: '/admin/projects' },
      { name: 'Yeni Proje', href: '/admin/projects/new' },
    ],
  },
  {
    name: 'Deneyimler',
    href: '/admin/experiences',
    icon: Briefcase,
    children: [
      { name: 'Tüm Deneyimler', href: '/admin/experiences' },
      { name: 'Yeni Deneyim', href: '/admin/experiences/new' },
    ],
  },
  { name: 'Eğitim', href: '/admin/education', icon: GraduationCap },
  { name: 'Yetenekler', href: '/admin/skills', icon: Code },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: FileText,
    children: [
      { name: 'Tüm Yazılar', href: '/admin/blog' },
      { name: 'Yeni Yazı', href: '/admin/blog/new' },
    ],
  },
  { name: 'Mesajlar', href: '/admin/messages', icon: MessageSquare },
  { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(href + '/')
  }

  // Realtime: messages tablosundaki değişikliklerde unread sayısını yenile
  useEffect(() => {
    let cancelled = false

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/admin/messages/stats')
        if (cancelled) return
        if (response.ok) {
          const data = await response.json()
          setUnreadMessageCount(data.unreadCount)
        } else if (response.status === 401) {
          setUnreadMessageCount(0)
        }
      } catch {
        if (cancelled) return
        setUnreadMessageCount(0)
      }
    }

    fetchUnreadCount()

    const channel = supabase
      .channel('admin-messages-unread-sidebar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchUnreadCount()
      })
      .subscribe()

    const handleEvent = () => fetchUnreadCount()
    window.addEventListener('messageStatusChanged', handleEvent)

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
      window.removeEventListener('messageStatusChanged', handleEvent)
    }
  }, [supabase])

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && <div className={styles.sidebarOverlay} onClick={onMobileClose} />}

      <aside className={`${styles.sidebar} ${!isMobileOpen ? styles.sidebarHidden : ''}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/admin" className={styles.brandIcon}>
            M
          </Link>
          <div className={styles.brandText}>
            <h1 className={styles.brandName}>Murat Sağ</h1>
            <p className={styles.brandSub}>Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className={styles.mobileMenuBtn}
            style={{ marginLeft: 'auto' }}
            aria-label="Menüyü kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {navigation.map((item) => {
            const active = isActive(item.href)
            const expanded = expandedItems.includes(item.name)
            const Icon = item.icon

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.name)}
                    className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                  >
                    <Icon size={18} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.name}</span>
                    {item.name === 'Mesajlar' && unreadMessageCount > 0 && (
                      <span className={styles.navBadge}>{unreadMessageCount}</span>
                    )}
                    <ChevronDown
                      size={16}
                      className={`${styles.navChevron} ${expanded ? styles.navChevronOpen : ''}`}
                    />
                  </button>
                  {expanded && (
                    <div className={styles.subnav}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onMobileClose}
                          className={`${styles.subnavItem} ${pathname === child.href ? styles.subnavItemActive : ''}`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              >
                <Icon size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.name}</span>
                {item.name === 'Mesajlar' && unreadMessageCount > 0 && (
                  <span className={styles.navBadge}>{unreadMessageCount}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <button type="button" onClick={handleSignOut} className={styles.navItem}>
            <LogOut size={18} className={styles.navIcon} />
            <span className={styles.navLabel}>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  )
}
