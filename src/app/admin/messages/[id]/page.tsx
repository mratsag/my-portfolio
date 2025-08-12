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
import styles from '@/styles/admin/MessageDetail.module.css'

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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  if (error || !message) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className={styles.errorTitle}>
          {error || 'Mesaj Bulunamadı'}
        </h3>
        <p className={styles.errorMessage}>
          {error || 'Görüntülemek istediğiniz mesaj bulunamadı.'}
        </p>
        <button
          onClick={() => router.push('/admin/messages')}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Mesajlara Dön
        </button>
      </div>
    )
  }

  return (
    <div className={styles.messageDetailPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={() => router.back()}
            className={styles.backButton}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className={styles.headerTitle}>
              Mesaj Detayı
            </h1>
            <p className={styles.headerSubtitle}>
              {message.name} tarafından gönderildi
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.headerActions}>
          <button
            onClick={handleReply}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            <ArrowPathIcon />
            Yanıtla
          </button>

          <button
            onClick={handleToggleRead}
            disabled={updating}
            className={`${styles.button} ${message.read ? styles.buttonRead : styles.buttonPrimary}`}
          >
            {updating ? (
              <div className={styles.loadingSpinner}></div>
            ) : message.read ? (
              <EnvelopeIcon />
            ) : (
              <EnvelopeOpenIcon />
            )}
            {message.read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`${styles.button} ${styles.buttonDanger}`}
          >
            {deleting ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <TrashIcon />
            )}
            Sil
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className={styles.messageCard}>
        {/* Message Header */}
        <div className={styles.messageHeader}>
          <div className={styles.messageHeaderContent}>
            <div className={styles.senderInfo}>
              {/* Avatar */}
              <div className={styles.avatar}>
                <span>{getInitials(message.name)}</span>
              </div>

              {/* Sender Info */}
              <div className={styles.senderDetails}>
                <div className={styles.senderName}>
                  <span>{message.name}</span>
                  {!message.read && (
                    <div className={styles.unreadIndicator}></div>
                  )}
                </div>
                <div className={styles.senderMeta}>
                  <div className={styles.metaItem}>
                    <AtSymbolIcon />
                    <a href={`mailto:${message.email}`}>
                      {message.email}
                    </a>
                  </div>
                  <div className={styles.metaItem}>
                    <CalendarIcon />
                    {new Date(message.created_at).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`${styles.statusBadge} ${message.read ? styles.statusRead : styles.statusUnread}`}>
              {message.read ? (
                <>
                  <EnvelopeOpenIcon />
                  Okundu
                </>
              ) : (
                <>
                  <EnvelopeIcon />
                  Okunmadı
                </>
              )}
            </div>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className={styles.subject}>
              <DocumentTextIcon />
              <span className={styles.subjectLabel}>Konu:</span>
              <span>{message.subject}</span>
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className={styles.messageBody}>
          <div className={styles.messageContent}>
            {message.message}
          </div>
        </div>

        {/* Meta Info */}
        <div className={styles.messageFooter}>
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

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <div className={styles.actionsInfo}>
          Bu mesaja yanıt vermek için email uygulamanız açılacaktır.
        </div>
        <div className={styles.actionsButtons}>
          <button
            onClick={() => router.push('/admin/messages')}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Listeye Dön
          </button>
          <button
            onClick={handleReply}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            <ArrowPathIcon />
            Email ile Yanıtla
          </button>
        </div>
      </div>
    </div>
  )
}