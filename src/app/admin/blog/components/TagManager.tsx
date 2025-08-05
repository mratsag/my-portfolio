'use client'
// src/app/admin/blog/components/TagManager.tsx

import { useState } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface TagManagerProps {
  tags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export default function TagManager({ tags, onChange, maxTags = 10 }: TagManagerProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="tag-manager">
      <div className="tag-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Etiket eklemek için yazın ve Enter'a basın..."
          className="tag-input"
          disabled={tags.length >= maxTags}
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          className="tag-add-button"
        >
          <PlusIcon className="tag-add-icon" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="tag-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item">
              <span className="tag-text">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="tag-remove-button"
              >
                <XMarkIcon className="tag-remove-icon" />
              </button>
            </span>
          ))}
        </div>
      )}

      {tags.length >= maxTags && (
        <p className="tag-limit-warning">
          Maksimum {maxTags} etiket eklenebilir
        </p>
      )}
    </div>
  )
}
