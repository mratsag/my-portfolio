'use client'
// src/app/admin/blog/components/RichTextEditor.tsx

import { useEffect, useRef } from 'react'
import { 
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('Link URL\'sini girin:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="rich-text-toolbar">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="rich-text-button"
          title="Kalın"
        >
          <BoldIcon className="rich-text-icon" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="rich-text-button"
          title="İtalik"
        >
          <ItalicIcon className="rich-text-icon" />
        </button>
        <div className="rich-text-separator"></div>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="rich-text-button"
          title="Madde İşaretli Liste"
        >
          <ListBulletIcon className="rich-text-icon" />
        </button>
        <div className="rich-text-separator"></div>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="rich-text-button"
          title="Alıntı"
        >
          <ChatBubbleLeftRightIcon className="rich-text-icon" />
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="rich-text-button"
          title="Link Ekle"
        >
          <LinkIcon className="rich-text-icon" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}
