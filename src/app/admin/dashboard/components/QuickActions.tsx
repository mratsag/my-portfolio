'use client'
// src/app/admin/dashboard/components/QuickActions.tsx

import Link from 'next/link'
import { 
  PlusIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Yeni Proje',
    description: 'Portföye yeni proje ekle',
    href: '/admin/projects/new',
    icon: CodeBracketIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Yeni Deneyim',
    description: 'Çalışma deneyimi ekle',
    href: '/admin/experiences/new',
    icon: BriefcaseIcon,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Yeni Blog Yazısı',
    description: 'Blog yazısı yayınla',
    href: '/admin/blog/new',
    icon: DocumentTextIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'Siteyi Görüntüle',
    description: 'Portfolio sitesini ziyaret et',
    href: '/',
    icon: EyeIcon,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    external: true,
  },
  {
    name: 'Profil Düzenle',
    description: 'Kişisel bilgileri güncelle',
    href: '/admin/profile',
    icon: Cog6ToothIcon,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
]

export default function QuickActions() {
  return (
    <div className="widget-card">
      <div className="widget-title">
        <PlusIcon className="widget-title-icon" />
        Hızlı İşlemler
      </div>
      <p className="widget-description">
        Sık kullandığın işlemler
      </p>
      
      <div className="quick-actions">
        {quickActions.map((action) => {
          const content = (
            <div className="action-button">
              <div className={`action-icon ${action.color.replace('bg-', '').replace(' hover:bg-', '')}`}>
                <action.icon className="icon-md" />
              </div>
              <div className="action-content">
                <p className="action-title">
                  {action.name}
                </p>
                <p className="action-description">
                  {action.description}
                </p>
              </div>
            </div>
          )

          if (action.external) {
            return (
              <a
                key={action.name}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            )
          }

          return (
            <Link key={action.name} href={action.href}>
              {content}
            </Link>
          )
        })}
      </div>


    </div>
  )
}