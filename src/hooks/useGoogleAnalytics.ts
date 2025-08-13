'use client'

import { useEffect } from 'react'

const GA_TRACKING_ID = 'G-JFVBZZ7LWB'

export function useGoogleAnalytics() {
  useEffect(() => {
    // Cookie consent kontrolü
    const cookieConsent = localStorage.getItem('cookieConsent')
    
    if (cookieConsent === 'accepted') {
      // Google Analytics script'ini yükle
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}');
      `
      document.head.appendChild(script2)

      // Cleanup function
      return () => {
        if (document.head.contains(script1)) {
          document.head.removeChild(script1)
        }
        if (document.head.contains(script2)) {
          document.head.removeChild(script2)
        }
      }
    }
  }, [])
}

// Google Analytics event tracking fonksiyonu
interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  const cookieConsent = localStorage.getItem('cookieConsent')
  
  if (cookieConsent === 'accepted' && typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    (window as WindowWithGtag).gtag!('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}
