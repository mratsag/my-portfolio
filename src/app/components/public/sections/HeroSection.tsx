'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ArrowRight, Mail, Github, Linkedin } from 'lucide-react'
import styles from '@/styles/public/HeroSection.module.css'

interface HeroSectionProps {
  profile?: {
    full_name?: string
    title?: string
    bio?: string
    email?: string
    github?: string
    linkedin?: string
    avatar_url?: string
  }
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Profil fotoğrafı URL'sine timestamp ekleyerek cache'i bypass et
  const getAvatarUrl = (url?: string) => {
    if (!url) return undefined
    // URL'de zaten timestamp varsa kullan, yoksa ekle
    if (url.includes('?t=')) {
      return url
    }
    const separator = url.includes('?') ? '&' : '?'
    const finalUrl = `${url}${separator}t=${Date.now()}`
    return finalUrl
  }

  if (!mounted) {
    return null
  }

  return (
    <section className={styles.hero} data-theme={theme}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Side - Text Content */}
          <div className={`${styles.textContent} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>👋 Merhaba, ben</span>
            </div>
            
            <h1 className={styles.title}>
              <span className={styles.name}>
                {profile?.full_name || 'Murat Sağ'}
              </span>
            </h1>
            
            <h2 className={styles.subtitle}>
              {profile?.title || 'Software Developer & Computer Engineering Student'}
            </h2>
            
            <p className={styles.description}>
              {profile?.bio || 'Java, Python, C, Dart ve C# gibi programlama dillerinde deneyim sahibi, React.js ve Spring Boot teknolojileriyle projeler geliştiren bir yazılım geliştirici.'}
            </p>

            <div className={styles.actions}>
              <Link href="/projects" className={styles.primaryButton}>
                <span>Projelerimi Gör</span>
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              
              <Link href="/contact" className={styles.secondaryButton}>
                <Mail className={styles.buttonIcon} />
                <span>İletişim</span>
              </Link>
            </div>

            <div className={styles.socialLinks}>
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="GitHub"
                >
                  <Github className={styles.socialIcon} />
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                >
                  <Linkedin className={styles.socialIcon} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className={styles.socialLink}
                  aria-label="Email"
                >
                  <Mail className={styles.socialIcon} />
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Visual Content */}
          <div className={`${styles.visualContent} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.avatarContainer}>
              {profile?.avatar_url ? (
                <img
                  src={getAvatarUrl(profile.avatar_url)}
                  alt={profile.full_name || 'Murat Sağ'}
                  className={styles.avatar}
                  onError={(e) => {
                    // Avatar yükleme hatası - sessizce handle et
                  }}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span className={styles.avatarText}>
                    {(profile?.full_name || 'M').charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Floating Elements */}
              <div className={styles.floatingElement} style={{ '--delay': '0s' } as React.CSSProperties}>
                <div className={styles.techBadge}>React</div>
              </div>
              <div className={styles.floatingElement} style={{ '--delay': '1s' } as React.CSSProperties}>
                <div className={styles.techBadge}>Next.js</div>
              </div>
              <div className={styles.floatingElement} style={{ '--delay': '2s' } as React.CSSProperties}>
                <div className={styles.techBadge}>TypeScript</div>
              </div>
              <div className={styles.floatingElement} style={{ '--delay': '3s' } as React.CSSProperties}>
                <div className={styles.techBadge}>Supabase</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollText}>Aşağı kaydır</div>
          <div className={styles.scrollArrow}></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle}></div>
        <div className={styles.bgCircle}></div>
        <div className={styles.bgCircle}></div>
      </div>
    </section>
  )
} 