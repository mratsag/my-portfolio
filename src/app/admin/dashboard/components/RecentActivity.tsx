'use client'
// src/app/admin/dashboard/components/RecentActivity.tsx

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  CodeBracketIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  title: string
  created_at: string
  status: 'draft' | 'published'
}

interface Message {
  id: string
  name: string
  subject: string
  created_at: string
  read: boolean
}

interface RecentActivityProps {
  recentProjects: Project[]
  recentMessages: Message[]
}

export default function RecentActivity({ recentProjects, recentMessages }: RecentActivityProps) {
  return (
    <div className="widget-card">
      <div className="widget-title">
        <CodeBracketIcon className="widget-title-icon" />
        Son Aktiviteler
      </div>
      
      <ul className="activity-list">
        {/* Recent Projects */}
        {recentProjects.length > 0 ? (
          recentProjects.map((project) => (
            <li key={project.id} className="activity-item">
              <div className="activity-icon project">
                <CodeBracketIcon className="icon-md" />
              </div>
              <div className="activity-content">
                <div className="activity-title">
                  <Link 
                    href={`/admin/projects/${project.id}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {project.title}
                  </Link>
                </div>
                <div className="activity-time">
                  {formatDistanceToNow(new Date(project.created_at), { 
                    addSuffix: true, 
                    locale: tr 
                  })}
                </div>
              </div>
              <div className="activity-status">
                <span className={`status-badge ${project.status === 'published' ? 'published' : 'draft'}`}>
                  {project.status === 'published' ? 'Yayında' : 'Taslak'}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="activity-item">
            <div className="activity-content">
              <div className="activity-title text-gray-500 dark:text-gray-400 italic">
                Henüz proje bulunmuyor.
              </div>
            </div>
          </li>
        )}

        {/* Recent Messages */}
        {recentMessages.length > 0 ? (
          recentMessages.map((message) => (
            <li key={message.id} className="activity-item">
              <div className="activity-icon message">
                <ChatBubbleLeftRightIcon className="icon-md" />
              </div>
              <div className="activity-content">
                <div className="activity-title">
                  <Link 
                    href={`/admin/messages/${message.id}`}
                    className={`${
                      !message.read 
                        ? 'font-medium' 
                        : ''
                    } hover:text-indigo-600 dark:hover:text-indigo-400`}
                  >
                    {message.name} - {message.subject || 'Konu yok'}
                  </Link>
                  {!message.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
                <div className="activity-time">
                  {formatDistanceToNow(new Date(message.created_at), { 
                    addSuffix: true, 
                    locale: tr 
                  })}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="activity-item">
            <div className="activity-content">
              <div className="activity-title text-gray-500 dark:text-gray-400 italic">
                Henüz mesaj bulunmuyor.
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}