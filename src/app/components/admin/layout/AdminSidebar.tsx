'use client'
// src/app/components/admin/layout/AdminSidebar.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UserIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  CodeBracketIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current: boolean
  children?: NavigationChild[]
  badge?: string
}

interface NavigationChild {
  name: string
  href: string
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: HomeIcon,
    current: false,
  },
  {
    name: 'Profil',
    href: '/admin/profile',
    icon: UserIcon,
    current: false,
  },
  {
    name: 'Projeler',
    href: '/admin/projects',
    icon: CodeBracketIcon,
    current: false,
    children: [
      { name: 'Tüm Projeler', href: '/admin/projects' },
      { name: 'Yeni Proje', href: '/admin/projects/new' },
    ]
  },
  {
    name: 'Deneyimler',
    href: '/admin/experiences',
    icon: BriefcaseIcon,
    current: false,
    children: [
      { name: 'Tüm Deneyimler', href: '/admin/experiences' },
      { name: 'Yeni Deneyim', href: '/admin/experiences/new' },
    ]
  },
  {
    name: 'Eğitim',
    href: '/admin/education',
    icon: AcademicCapIcon,
    current: false,
  },
  {
    name: 'Yetenekler',
    href: '/admin/skills',
    icon: CodeBracketIcon,
    current: false,
  },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: DocumentTextIcon,
    current: false,
    children: [
      { name: 'Tüm Yazılar', href: '/admin/blog' },
      { name: 'Yeni Yazı', href: '/admin/blog/new' },
    ]
  },
  {
    name: 'Mesajlar',
    href: '/admin/messages',
    icon: ChatBubbleLeftRightIcon,
    current: false,
    badge: '0' // Dinamik olarak güncellenecek
  },
  {
    name: 'Ayarlar',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    current: false,
  },
]

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isCurrentPath = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/admin/messages/stats')
        if (response.ok) {
          const data = await response.json()
          setUnreadMessageCount(data.unreadCount)
        } else if (response.status === 401) {
          // Session yoksa sessizce devam et, hata gösterme
          setUnreadMessageCount(0)
        }
      } catch (error) {
        // Network hatası durumunda sessizce devam et
        console.debug('Could not fetch unread message count:', error)
        setUnreadMessageCount(0)
      }
    }

    fetchUnreadCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    
    // Listen for message status changes
    const handleMessageStatusChange = () => {
      fetchUnreadCount()
    }
    
    window.addEventListener('messageStatusChanged', handleMessageStatusChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('messageStatusChanged', handleMessageStatusChanged)
    }
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="icon-lg" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full admin-sidebar">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="icon-lg text-white" />
              </button>
            </div>
            <SidebarContent 
              navigation={navigation}
              pathname={pathname}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
              isCurrentPath={isCurrentPath}
              handleSignOut={handleSignOut}
              unreadMessageCount={unreadMessageCount}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block admin-sidebar">
        <SidebarContent 
          navigation={navigation}
          pathname={pathname}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          isCurrentPath={isCurrentPath}
          handleSignOut={handleSignOut}
          unreadMessageCount={unreadMessageCount}
        />
      </div>
    </>
  )
}

function SidebarContent({ 
  navigation, 
  pathname, 
  expandedItems, 
  toggleExpanded, 
  isCurrentPath,
  handleSignOut,
  unreadMessageCount
}: {
  navigation: NavigationItem[]
  pathname: string
  expandedItems: string[]
  toggleExpanded: (name: string) => void
  isCurrentPath: (href: string) => boolean
  handleSignOut: () => void
  unreadMessageCount: number
}) {
  return (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <div>
          <h1 className="sidebar-logo-text">
            Murat Sağ
          </h1>
          <p className="sidebar-logo-subtitle">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {navigation.map((item) => {
          // Mesajlar için dinamik badge
          const badge = item.name === 'Mesajlar' && unreadMessageCount > 0 
            ? unreadMessageCount.toString() 
            : item.badge
          
          return (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`nav-item ${isCurrentPath(item.href) ? 'active' : ''}`}
                >
                  <item.icon className="nav-item-icon" />
                  {item.name}
                                  {badge && (
                  <span className="nav-item-badge">
                    {badge}
                  </span>
                )}
                  <ChevronDownIcon 
                    className={`nav-item-icon transition-transform ${
                      expandedItems.includes(item.name) ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="nav-submenu">
                    {item.children.map((child: NavigationChild) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`nav-submenu-item ${pathname === child.href ? 'active' : ''}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`nav-item ${isCurrentPath(item.href) ? 'active' : ''}`}
              >
                <item.icon className="nav-item-icon" />
                {item.name}
                {badge && (
                  <span className="nav-item-badge">
                    {badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        )})}
      </nav>

      {/* User menu */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="nav-item"
        >
          <ArrowRightOnRectangleIcon className="nav-item-icon" />
          Çıkış Yap
        </button>
      </div>
    </>
  )
}