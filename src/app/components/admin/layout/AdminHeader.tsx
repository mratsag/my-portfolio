'use client'
// src/app/components/admin/layout/AdminHeader.tsx

import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, Transition } from '@headlessui/react'
import {
  Search,
  Sun,
  Moon,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import styles from '@/styles/components/AdminLayoutAurora.module.css'

interface UserWithProfile {
  id: string
  email?: string
  profile?: {
    full_name?: string
    avatar_url?: string
  } | null
}

interface AdminHeaderProps {
  onMobileMenuOpen: () => void
}

export default function AdminHeader({ onMobileMenuOpen }: AdminHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser({ ...authUser, profile })
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const initials = (user?.profile?.full_name || user?.email || 'A')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className={styles.header}>
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className={styles.mobileMenuBtn}
        aria-label="Menüyü aç"
      >
        <MenuIcon size={18} />
      </button>

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input type="text" placeholder="Ara..." className={styles.searchInput} />
      </div>

      {/* Actions */}
      <div className={styles.headerActions}>
        {/* Theme toggle */}
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.iconBtn}
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Notifications */}
        <button type="button" className={styles.iconBtn} aria-label="Bildirimler">
          <Bell size={18} />
        </button>

        {/* User dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className={styles.userBtn}>
            <span className={styles.userAvatar}>
              {user?.profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profile.avatar_url}
                  alt={user.profile.full_name || user.email}
                  className={styles.userAvatarImg}
                />
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{initials}</span>
              )}
            </span>
            <span className={styles.userMeta}>
              <span className={styles.userName}>{user?.profile?.full_name || 'Admin'}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={styles.dropdown}>
              <Menu.Item>
                <button
                  type="button"
                  onClick={() => router.push('/admin/profile')}
                  className={styles.dropdownItem}
                >
                  <UserIcon size={16} />
                  Profil
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  type="button"
                  onClick={() => router.push('/admin/settings')}
                  className={styles.dropdownItem}
                >
                  <Settings size={16} />
                  Ayarlar
                </button>
              </Menu.Item>
              <div className={styles.dropdownDivider} />
              <Menu.Item>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                >
                  <LogOut size={16} />
                  Çıkış Yap
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}
