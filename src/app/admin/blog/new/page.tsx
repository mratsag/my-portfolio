'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import BlogForm from '../components/BlogForm'

export default function NewBlogPage() {
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/blog')
    }, 2000)
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
              Yeni Blog Yazısı
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Yeni bir blog yazısı oluşturun
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Blog yazısı başarıyla oluşturuldu! Blog yazıları sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Form */}
      <BlogForm 
        isOpen={true}
        onClose={() => router.push('/admin/blog')}
        onSuccess={handleSuccess} 
      />
    </div>
  )
}
