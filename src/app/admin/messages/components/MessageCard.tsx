// src/app/admin/messages/components/MessageCard.tsx
'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  EnvelopeIcon,
  EnvelopeOpenIcon,
  EyeIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Message } from '@/lib/types'

interface MessageCardProps {
  message: Message
  onToggleRead: (messageId: string, read: boolean) => void
  onDelete: (messageId: string) => void
  isSelected: boolean
  onSelect: (messageId: string) => void
  isDeleting: boolean
}

export default function MessageCard({ 
  message, 
  onToggleRead, 
  onDelete, 
  isSelected,
  onSelect,
  isDeleting 
}: MessageCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border-l-4 ${
      message.read 
        ? 'border-l-gray-300 dark:border-l-gray-600' 
        : 'border-l-indigo-500 dark:border-l-indigo-400'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(message.id)}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getInitials(message.name)}
                </span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`text-sm font-medium truncate ${
                  message.read 
                    ? 'text-gray-700 dark:text-gray-300' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {message.name}
                </h3>
                {!message.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {message.email}
              </p>
            </div>
          </div>

          {/* Read Status Icon */}
          <div className="flex-shrink-0">
            {message.read ? (
              <EnvelopeOpenIcon className="messages-card-icon" />
            ) : (
              <EnvelopeIcon className="messages-card-icon messages-card-icon-unread" />
            )}
          </div>
        </div>

        {/* Subject */}
        {message.subject && (
          <div className="mb-3">
            <h4 className={`text-sm font-medium ${
              message.read 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-gray-800 dark:text-gray-200'
            }`}>
              {truncateText(message.subject, 60)}
            </h4>
          </div>
        )}

        {/* Message Preview */}
        <div className="mb-4">
          <p className={`text-sm leading-relaxed ${
            message.read 
              ? 'text-gray-600 dark:text-gray-400' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {truncateText(message.message, 120)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Date */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="messages-table-icon" />
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true, 
              locale: tr 
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/messages/${message.id}`}
              className="inline-flex items-center p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Görüntüle"
            >
              <EyeIcon className="messages-action-icon" />
            </Link>

            <button
              onClick={() => onToggleRead(message.id, !message.read)}
              className={`inline-flex items-center p-1.5 rounded-md transition-colors ${
                message.read
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20'
                  : 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20'
              }`}
              title={message.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
            >
              {message.read ? (
                <EnvelopeIcon className="messages-action-icon" />
              ) : (
                <EnvelopeOpenIcon className="messages-action-icon" />
              )}
            </button>

            <button
              onClick={() => onDelete(message.id)}
              disabled={isDeleting}
              className="inline-flex items-center p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sil"
            >
              {isDeleting ? (
                <div className="messages-action-icon animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
              ) : (
                <TrashIcon className="messages-action-icon" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}