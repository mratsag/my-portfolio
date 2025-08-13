'use client'

import CookieConsent from './CookieConsent'

interface WindowWithDataLayer extends Window {
  dataLayer?: unknown[]
}

export default function CookieConsentWrapper() {
  const handleCookieAccept = () => {
    // Google Tag Manager consent mode'u güncelle
    if (typeof window !== 'undefined' && (window as WindowWithDataLayer).dataLayer) {
      (window as WindowWithDataLayer).dataLayer!.push({
        'event': 'consent_update',
        'consent_state': {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        }
      });
    }
    
    // Sayfayı yeniden yükle
    window.location.reload()
  }

  const handleCookieDecline = () => {
    // Kullanıcı çerezleri reddetti, hiçbir şey yapma
  }

  return (
    <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
  )
}
