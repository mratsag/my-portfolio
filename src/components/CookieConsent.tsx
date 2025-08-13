'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/components/CookieConsent.module.css'

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
    <div className={styles.cookieBanner}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <div className={styles.header}>
              <div className={styles.cookieIcon}>
                🍪
              </div>
              <h3 className={styles.title}>
                Çerez Kullanımı
              </h3>
            </div>
            <p className={styles.description}>
              Bu web sitesi deneyiminizi geliştirmek için çerezler kullanır. 
              Google Analytics ile ziyaretçi istatistiklerini topluyoruz. 
              Devam ederek{' '}
              <a 
                href="/privacy" 
                className={styles.privacyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                gizlilik politikamızı
              </a>
              {' '}kabul etmiş olursunuz.
            </p>
          </div>
          <div className={styles.buttonSection}>
            <button
              onClick={handleDecline}
              className={styles.declineButton}
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              className={styles.acceptButton}
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
