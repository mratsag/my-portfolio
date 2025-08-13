'use client'

import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'
import CookieConsent from './CookieConsent'

export default function CookieConsentWrapper() {
  useGoogleAnalytics()

  const handleCookieAccept = () => {
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
