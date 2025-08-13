'use client'

import { useState, useEffect } from 'react'

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // localStorage'dan cookie tercihini kontrol et
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-t-2 border-blue-200 dark:border-gray-600 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
                <span className="text-xl">🍪</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Çerez Kullanımı
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-w-2xl">
              Bu web sitesi deneyiminizi geliştirmek için çerezler kullanır. 
              Google Analytics ile ziyaretçi istatistiklerini topluyoruz. 
              Devam ederek{' '}
              <a 
                href="/privacy" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline decoration-2 underline-offset-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                gizlilik politikamızı
              </a>
              {' '}kabul etmiş olursunuz.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
