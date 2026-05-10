'use client'

import Script from 'next/script'
import { useEffect } from 'react'

// Env'den okunur; tanımsızsa fallback olarak mevcut prod ID'si kullanılır.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WH63DW5V'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const

const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const

export default function AnalyticsLoader() {
  useEffect(() => {
    const updateConsent = (state: typeof GRANTED | typeof DENIED) => {
      if (typeof window === 'undefined' || !window.gtag) return
      window.gtag('consent', 'update', state)
    }

    const onAccepted = () => updateConsent(GRANTED)
    const onDeclined = () => updateConsent(DENIED)

    window.addEventListener('cookieConsentAccepted', onAccepted)
    window.addEventListener('cookieConsentDeclined', onDeclined)

    return () => {
      window.removeEventListener('cookieConsentAccepted', onAccepted)
      window.removeEventListener('cookieConsentDeclined', onDeclined)
    }
  }, [])

  // Tek script — sıralama garantisi:
  // 1) dataLayer + gtag stub
  // 2) default consent: denied (Consent Mode v2)
  // 3) önceden accept edilmişse hemen granted'a yükselt
  // 4) GTM container'ı yükle (verification çalışsın diye her zaman yüklenir,
  //    ama tag'ler consent state'ine göre fire edecek)
  const inlineScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    try {
      if (localStorage.getItem('cookieConsent') === 'accepted') {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted'
        });
      }
    } catch (e) {}
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `

  return (
    <Script id="gtm-consent-init" strategy="afterInteractive">
      {inlineScript}
    </Script>
  )
}
