'use client'

import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'
import CookieConsent from './CookieConsent'

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void
}

export default function CookieConsentWrapper() {
  useGoogleAnalytics()

  const handleCookieAccept = () => {
    // Google Analytics izin modunu güncelle
    if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
      (window as WindowWithGtag).gtag!('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
    
    // Google Analytics'i yeniden yükle
    window.location.reload()
  }

  const handleCookieDecline = () => {
    // Kullanıcı çerezleri reddetti, hiçbir şey yapma
  }

  return (
    <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
  )
}
