// src/app/admin/messages/components/MessageList.tsx
'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  EnvelopeIcon,
  EnvelopeOpenIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Message } from '@/lib/types'

interface MessageListProps {
  messages: Message[]
  onToggleRead: (messageId: string, read: boolean) => void
  onDelete: (messageId: string) => void
  selectedMessages: string[]
  onSelectMessage: (messageId: string) => void
  onSelectAll: (selected: boolean) => void
  deleteLoading: string | null
}

export default function MessageList({ 
  messages, 
  onToggleRead, 
  onDelete, 
  selectedMessages,
  onSelectMessage,
  onSelectAll,
  deleteLoading 
}: MessageListProps) {
  const allSelected = messages.length > 0 && selectedMessages.length === messages.length
  const someSelected = selectedMessages.length > 0 && selectedMessages.length < messages.length

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Gönderen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Konu / Mesaj
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((message) => (
              <tr 
                key={message.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !message.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.id)}
                    onChange={() => onSelectMessage(message.id)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </td>

                {/* Sender Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {getInitials(message.name)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium flex items-center ${
                        message.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {message.name}
                        {!message.read && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full ml-2"></div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {message.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Subject & Message */}
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {message.subject && (
                      <div className={`text-sm font-medium mb-1 ${
                        message.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {truncateText(message.subject, 40)}
                      </div>
                    )}
                    <div className={`text-sm ${
                      message.read 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {truncateText(message.message, 80)}
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="messages-table-icon" />
                    <span>
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(message.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    message.read
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  }`}>
                    {message.read ? (
                      <>
                        <EnvelopeOpenIcon className="messages-status-icon" />
                        Okundu
                      </>
                    ) : (
                      <>
                        <EnvelopeIcon className="messages-status-icon" />
                        Okunmadı
                      </>
                    )}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded"
                      title="Görüntüle"
                    >
                      <EyeIcon className="messages-action-icon" />
                    </Link>

                    <button
                      onClick={() => onToggleRead(message.id, !message.read)}
                      className={`p-1 rounded transition-colors ${
                        message.read
                          ? 'text-gray-500 hover:text-indigo-600'
                          : 'text-indigo-500 hover:text-indigo-700'
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
                      disabled={deleteLoading === message.id}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Sil"
                    >
                      {deleteLoading === message.id ? (
                        <div className="messages-action-icon animate-spin border-2 border-red-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <TrashIcon className="messages-action-icon" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}