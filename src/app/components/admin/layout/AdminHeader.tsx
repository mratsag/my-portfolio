'use client'
// src/app/components/admin/layout/AdminHeader.tsx

import { useState, useEffect } from 'react'
import { 
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import styles from '@/styles/admin/AdminLayout.module.css'

interface UserWithProfile {
  id: string
  email?: string
  profile?: {
    full_name?: string
    avatar_url?: string
  }
}

export default function AdminHeader() {
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(3) // Bildirim sayısı
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Kullanıcı bilgilerini al
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Profil bilgilerini al
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUser({ ...user, profile })
      }
    }

    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!mounted) {
    return (
      <header className="admin-header">
        <div className="flex items-center justify-between w-full">
          <div className="header-search">
            <div className="relative">
              <MagnifyingGlassIcon className="header-search-icon" />
              <input
                type="text"
                placeholder="Ara..."
                className="header-search-input"
              />
            </div>
          </div>
          <div className="header-actions">
            <div className="header-action-btn"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={styles['admin-header']}>
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className={styles['header-search']}>
          <div className="relative">
            <MagnifyingGlassIcon className={styles['header-search-icon']} />
            <input
              type="text"
              placeholder="Ara..."
              className={styles['header-search-input']}
            />
          </div>
        </div>

        {/* Right side */}
        <div className={styles['header-actions']}>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles['header-action-btn']}
          >
            {theme === 'dark' ? (
              <SunIcon className={styles['icon-md']} />
            ) : (
              <MoonIcon className={styles['icon-md']} />
            )}
          </button>

          {/* Notifications */}
          <button className={`${styles['header-action-btn']} relative`}>
            <BellIcon className={styles['icon-md']} />
            {notifications > 0 && (
              <span className={styles['header-notification-badge']}>
                {notifications}
              </span>
            )}
          </button>

          {/* User dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className={styles['user-menu']}>
              {user?.profile?.avatar_url ? (
                <img
                  className={styles['user-avatar']}
                  src={user.profile.avatar_url}
                  alt={user.profile.full_name || user.email}
                />
              ) : (
                <div className={styles['user-avatar']}>
                  <UserCircleIcon className={styles['icon-md']} />
                </div>
              )}
              <div className={styles['user-info']}>
                <p className={styles['user-name']}>
                  {user?.profile?.full_name || 'Admin'}
                </p>
                <p className={styles['user-email']}>
                  {user?.email}
                </p>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className={styles['user-dropdown-menu']}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/admin/profile')}
                      className={`${styles['user-dropdown-item']} ${active ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                    >
                      <UserCircleIcon className={styles['user-dropdown-icon']} />
                      Profil
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/admin/settings')}
                      className={`${styles['user-dropdown-item']} ${active ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                    >
                      <Cog6ToothIcon className={styles['user-dropdown-icon']} />
                      Ayarlar
                    </button>
                  )}
                </Menu.Item>
                <div className={styles['user-dropdown-divider']}></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`${styles['user-dropdown-item']} ${active ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                    >
                      <ArrowRightOnRectangleIcon className={styles['user-dropdown-icon']} />
                      Çıkış Yap
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}