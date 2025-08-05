// src/app/admin/messages/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  AtSymbolIcon,
  DocumentTextIcon,
  PhoneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Message } from '@/lib/types'

export default function MessageDetailPage() {
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const messageId = params.id as string

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/admin/messages/${messageId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Mesaj bulunamadı')
          } else {
            throw new Error('Mesaj yüklenirken hata oluştu')
          }
          return
        }

        const data = await response.json()
        setMessage(data.message)
      } catch (err) {
        console.error('Error fetching message:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    if (messageId) {
      fetchMessage()
    }
  }, [messageId])

  const handleToggleRead = async () => {
    if (!message) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !message.read })
      })

      if (!response.ok) throw new Error('Mesaj güncellenemedi')

      const data = await response.json()
      setMessage(data.message)
    } catch (err) {
      console.error('Error updating message:', err)
      alert('Mesaj güncellenirken hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!message || !confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Mesaj silinemedi')

      router.push('/admin/messages')
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Mesaj silinirken hata oluştu')
      setDeleting(false)
    }
  }

  const handleReply = () => {
    if (message) {
      const subject = message.subject ? `Re: ${message.subject}` : 'Re: İletişim'
      const body = `\n\n--- Orijinal Mesaj ---\nGönderen: ${message.name} (${message.email})\nTarih: ${new Date(message.created_at).toLocaleString('tr-TR')}\n${message.subject ? `Konu: ${message.subject}\n` : ''}Mesaj: ${message.message}`
      
      const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, '_blank')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !message) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {error || 'Mesaj Bulunamadı'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Görüntülemek istediğiniz mesaj bulunamadı.'}
        </p>
        <button
          onClick={() => router.push('/admin/messages')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Mesajlara Dön
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mesaj Detayı
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {message.name} tarafından gönderildi
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReply}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Yanıtla
          </button>

          <button
            onClick={handleToggleRead}
            disabled={updating}
            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              message.read
                ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {updating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : message.read ? (
              <EnvelopeIcon className="w-4 h-4 mr-2" />
            ) : (
              <EnvelopeOpenIcon className="w-4 h-4 mr-2" />
            )}
            {message.read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <TrashIcon className="w-4 h-4 mr-2" />
            )}
            Sil
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Message Header */}
        <div className={`border-l-4 ${
          message.read 
            ? 'border-l-gray-300 dark:border-l-gray-600' 
            : 'border-l-indigo-500 dark:border-l-indigo-400'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {getInitials(message.name)}
                    </span>
                  </div>
                </div>

                {/* Sender Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {message.name}
                    </h2>
                    {!message.read && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center">
                      <AtSymbolIcon className="w-4 h-4 mr-1" />
                      <a 
                        href={`mailto:${message.email}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(message.created_at).toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  message.read
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                }`}>
                  {message.read ? (
                    <>
                      <EnvelopeOpenIcon className="w-4 h-4 mr-1" />
                      Okundu
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-4 h-4 mr-1" />
                      Okunmadı
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Subject */}
            {message.subject && (
              <div className="mt-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Konu:</span>
                  <span className="ml-2 text-sm">{message.subject}</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.message}
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>
                Gönderilme: {formatDistanceToNow(new Date(message.created_at), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </div>
              <div>
                Mesaj ID: {message.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Bu mesaja yanıt vermek için email uygulamanız açılacaktır.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/messages')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Listeye Dön
            </button>
            <button
              onClick={handleReply}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Email ile Yanıtla
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}