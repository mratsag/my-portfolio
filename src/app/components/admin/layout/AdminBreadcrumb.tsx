'use client'
// src/app/components/admin/layout/AdminBreadcrumb.tsx

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

const pathNameMap: { [key: string]: string } = {
  '/admin': 'Dashboard',
  '/admin/profile': 'Profil',
  '/admin/projects': 'Projeler',
  '/admin/projects/new': 'Yeni Proje',
  '/admin/experiences': 'Deneyimler',
  '/admin/experiences/new': 'Yeni Deneyim',
  '/admin/skills': 'Yetenekler',
  '/admin/blog': 'Blog',
  '/admin/blog/new': 'Yeni Yazı',
  '/admin/messages': 'Mesajlar',
  '/admin/settings': 'Ayarlar',
}

export default function AdminBreadcrumb() {
  const pathname = usePathname()
  
  // Path segments oluştur
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  
  // Breadcrumb items oluştur
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    let name = pathNameMap[href] || segment
    
    // Eğer segment bir ID ise (UUID formatında), "Düzenle" olarak göster
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      name = 'Detay'
    }
    
    // Edit sayfası ise
    if (segment === 'edit') {
      name = 'Düzenle'
    }
    
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      href,
      current: index === pathSegments.length - 1
    }
  })

  // Ana sayfa ise breadcrumb gösterme
  if (pathname === '/admin') {
    return null
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center space-x-2 text-sm">
        {/* Ana sayfa linki */}
        <Link
          href="/admin"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <HomeIcon className="h-4 w-4 mr-1" />
          Dashboard
        </Link>

        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            {item.current ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}