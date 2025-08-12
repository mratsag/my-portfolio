// src/app/admin/messages/components/MessageFilter.tsx
'use client'

import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface MessageFilterProps {
  search: string
  onSearchChange: (search: string) => void
  filter: 'all' | 'read' | 'unread'
  onFilterChange: (filter: 'all' | 'read' | 'unread') => void
  sortBy: string
  onSortByChange: (sortBy: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void
  selectedCount: number
  onBulkMarkAsRead: () => void
  onBulkMarkAsUnread: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
  bulkLoading: boolean
}

const sortOptions = [
  { value: 'created_at', label: 'Tarih' },
  { value: 'name', label: 'Ad' },
  { value: 'email', label: 'Email' },
  { value: 'subject', label: 'Konu' }
]

const filterOptions = [
  { value: 'all', label: 'Tüm Mesajlar', icon: null },
  { value: 'unread', label: 'Okunmamış', icon: EnvelopeIcon },
  { value: 'read', label: 'Okunmuş', icon: EnvelopeOpenIcon }
]

export default function MessageFilter({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  selectedCount,
  onBulkMarkAsRead,
  onBulkMarkAsUnread,
  onBulkDelete,
  onClearSelection,
  bulkLoading
}: MessageFilterProps) {
  const hasActiveFilters = search || filter !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onFilterChange('all')
    onSortByChange('created_at')
    onSortOrderChange('desc')
  }

  return (
    <div className="messages-filter-container">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="messages-filter-bulk-bar">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                {selectedCount} mesaj seçili
              </span>
              <button
                onClick={onClearSelection}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Seçimi Kaldır
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onBulkMarkAsRead}
                disabled={bulkLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <EnvelopeOpenIcon className="messages-filter-action-icon" />
                Okundu İşaretle
              </button>
              
              <button
                onClick={onBulkMarkAsUnread}
                disabled={bulkLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <EnvelopeIcon className="messages-filter-action-icon" />
                Okunmadı İşaretle
              </button>
              
              <button
                onClick={onBulkDelete}
                disabled={bulkLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-200 dark:bg-red-800 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TrashIcon className="messages-filter-action-icon" />
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Filter Bar */}
      <div className="messages-filter-main">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="messages-filter-search-container">
            <MagnifyingGlassIcon className="messages-filter-search-icon" />
            <input
              type="text"
              placeholder="Ad, email, konu veya mesaj içinde ara..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="messages-filter-search-input"
            />
          </div>

          {/* Filter Buttons */}
          <div className="messages-filter-buttons">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value as 'all' | 'read' | 'unread')}
                className={`messages-filter-button ${
                  filter === option.value
                    ? 'messages-filter-button-active'
                    : 'messages-filter-button-inactive'
                }`}
              >
                {option.icon && <option.icon className="messages-filter-button-icon" />}
                {option.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="messages-filter-sort-container">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="messages-filter-sort-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="messages-filter-sort-button"
              title={sortOrder === 'asc' ? 'Azalan sıralama' : 'Artan sıralama'}
            >
              <svg className={`messages-filter-sort-icon ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="messages-filter-clear-button"
            >
              <XMarkIcon className="messages-filter-clear-icon" />
              Temizle
            </button>
          )}
        </div>
      </div>
    </div>
  )
}