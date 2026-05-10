'use client'

import CookieConsent from './CookieConsent'

export default function CookieConsentWrapper() {
  const handleCookieAccept = () => {
    // AnalyticsLoader bu eventi dinleyip GTM'i yükler
    window.dispatchEvent(new Event('cookieConsentAccepted'))
  }

  const handleCookieDecline = () => {
    // Reddedildi — analytics yüklenmez, mevcut session'da bir şey değişmez
    window.dispatchEvent(new Event('cookieConsentDeclined'))
  }

  return (
    <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
  )
}
