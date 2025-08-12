// src/app/admin/messages/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import MessageCard from './components/MessageCard'
import MessageList from './components/MessageList'
import MessageFilter from './components/MessageFilter'
import { Message } from '@/lib/types'

type ViewMode = 'cards' | 'list'
type FilterType = 'all' | 'read' | 'unread'

interface MessagesData {
  messages: Message[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    read: number
    unread: number
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0
  })
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(filter !== 'all' && { filter }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/messages?${params}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      
      const data: MessagesData = await response.json()
      setMessages(data.messages)
      setPagination(data.pagination)
      setStats(data.stats)
      setSelectedMessages([]) // Clear selection on new fetch
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [currentPage, search, filter, sortBy, sortOrder])

  const handleToggleRead = async (messageId: string, read: boolean) => {
    try {
      console.log('Toggling message read status:', { messageId, read })
      
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update message')
      }

      const result = await response.json()
      console.log('Message update result:', result)

      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, read } : m
      ))
      
      // Update stats
      setStats(prev => ({
        ...prev,
        read: read ? prev.read + 1 : prev.read - 1,
        unread: read ? prev.unread - 1 : prev.unread + 1
      }))

      // Trigger sidebar update by dispatching a custom event
      window.dispatchEvent(new CustomEvent('messageStatusChanged'))
    } catch (error) {
      console.error('Error updating message:', error)
      alert('Mesaj güncellenirken hata oluştu')
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    setDeleteLoading(messageId)
    try {
      console.log('Deleting message:', messageId)
      
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete message')
      }

      const result = await response.json()
      console.log('Message delete result:', result)

      setMessages(prev => prev.filter(m => m.id !== messageId))
      setSelectedMessages(prev => prev.filter(id => id !== messageId))
      
      // Update stats
      const deletedMessage = messages.find(m => m.id === messageId)
      if (deletedMessage) {
        setStats(prev => ({
          total: prev.total - 1,
          read: deletedMessage.read ? prev.read - 1 : prev.read,
          unread: deletedMessage.read ? prev.unread : prev.unread - 1
        }))
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Mesaj silinirken hata oluştu')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedMessages(selected ? messages.map(m => m.id) : [])
  }

  const handleBulkAction = async (action: 'markAsRead' | 'markAsUnread' | 'delete') => {
    if (selectedMessages.length === 0) return

    if (action === 'delete' && !confirm(`${selectedMessages.length} mesajı silmek istediğinizden emin misiniz?`)) {
      return
    }

    setBulkLoading(true)
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          messageIds: selectedMessages
        })
      })

      if (!response.ok) throw new Error('Bulk operation failed')

      if (action === 'delete') {
        setMessages(prev => prev.filter(m => !selectedMessages.includes(m.id)))
        // Update stats for deleted messages
        const deletedMessages = messages.filter(m => selectedMessages.includes(m.id))
        const deletedRead = deletedMessages.filter(m => m.read).length
        const deletedUnread = deletedMessages.length - deletedRead
        setStats(prev => ({
          total: prev.total - selectedMessages.length,
          read: prev.read - deletedRead,
          unread: prev.unread - deletedUnread
        }))
      } else {
        const read = action === 'markAsRead'
        setMessages(prev => prev.map(m => 
          selectedMessages.includes(m.id) ? { ...m, read } : m
        ))
        
        // Update stats for read/unread changes
        const affectedMessages = messages.filter(m => selectedMessages.includes(m.id))
        const currentlyRead = affectedMessages.filter(m => m.read).length
        const currentlyUnread = affectedMessages.length - currentlyRead
        
        if (read) {
          setStats(prev => ({
            ...prev,
            read: prev.read + currentlyUnread,
            unread: prev.unread - currentlyUnread
          }))
        } else {
          setStats(prev => ({
            ...prev,
            read: prev.read - currentlyRead,
            unread: prev.unread + currentlyRead
          }))
        }
      }

      setSelectedMessages([])
    } catch (error) {
      console.error('Error in bulk operation:', error)
      alert('Toplu işlem sırasında hata oluştu')
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="messages-page">
      {/* Header */}
      <div className="messages-header">
        <div>
          <h1 className="messages-title">
            Mesajlar
          </h1>
          <p className="messages-subtitle">
            İletişim formundan gelen mesajları yönetin
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="messages-stats-grid">
        {[
          { 
            label: 'Toplam Mesaj', 
            value: stats.total, 
            colorClass: 'messages-stats-total',
            icon: ChatBubbleLeftRightIcon
          },
          { 
            label: 'Okunmamış', 
            value: stats.unread, 
            colorClass: 'messages-stats-unread',
            icon: EnvelopeIcon
          },
          { 
            label: 'Okunmuş', 
            value: stats.read, 
            colorClass: 'messages-stats-read',
            icon: CheckIcon
          }
        ].map((stat) => (
          <div key={stat.label} className="messages-stats-card">
            <div className={`messages-stats-icon-wrapper ${stat.colorClass}`}>
              <stat.icon className="messages-stats-icon" />
            </div>
            <div className="messages-stats-content">
              <p className="messages-stats-label">
                {stat.label}
              </p>
              <p className="messages-stats-value">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <MessageFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        selectedCount={selectedMessages.length}
        onBulkMarkAsRead={() => handleBulkAction('markAsRead')}
        onBulkMarkAsUnread={() => handleBulkAction('markAsUnread')}
        onBulkDelete={() => handleBulkAction('delete')}
        onClearSelection={() => setSelectedMessages([])}
        bulkLoading={bulkLoading}
      />

      {/* View Toggle */}
      <div className="messages-view-toggle">
        <div className="messages-view-buttons">
          <button
            onClick={() => setViewMode('cards')}
            className={`messages-view-button ${
              viewMode === 'cards'
                ? 'messages-view-button-active'
                : 'messages-view-button-inactive'
            }`}
          >
            Kartlar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`messages-view-button ${
              viewMode === 'list'
                ? 'messages-view-button-active'
                : 'messages-view-button-inactive'
            }`}
          >
            Liste
          </button>
        </div>

        <div className="messages-count-text">
          {pagination.total} mesajdan {messages.length} tanesi gösteriliyor
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="messages-loading-container">
          <div className="messages-loading-spinner"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="messages-empty-container">
          <ChatBubbleLeftRightIcon className="messages-empty-icon" />
          <h3 className="messages-empty-title">
            Mesaj Bulunamadı
          </h3>
          <p className="messages-empty-text">
            {search || filter !== 'all' ? 'Arama kriterlerinize uygun mesaj bulunamadı.' : 'Henüz hiç mesaj yok.'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <div className="messages-grid">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                  onSelect={handleSelectMessage}
                  isSelected={selectedMessages.includes(message.id)}
                  isDeleting={deleteLoading === message.id}
                />
              ))}
            </div>
          ) : (
            <MessageList
              messages={messages}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
              onSelectMessage={handleSelectMessage}
              selectedMessages={selectedMessages}
              onSelectAll={handleSelectAll}
              deleteLoading={deleteLoading}
            />
          )}
        </>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="messages-pagination">
          <div className="messages-pagination-info">
            Sayfa {pagination.page} / {pagination.totalPages}
          </div>
          <div className="messages-pagination-buttons">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="messages-pagination-button"
            >
              Önceki
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="messages-pagination-button"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  )
}