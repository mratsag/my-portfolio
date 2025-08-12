'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react'
import styles from '@/styles/public/ContactSection.module.css'

interface ContactSectionProps {
  profile?: {
    full_name?: string
    email?: string
    phone?: string
    location?: string
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        console.error('Contact form error:', data.error)
        // Hata mesajını kullanıcıya göster
        alert(data.error || 'Mesaj gönderilirken bir hata oluştu')
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.contact} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>İletişim</h1>
            <p className={styles.subtitle}>
              Benimle iletişime geçmek için aşağıdaki yöntemleri kullanabilirsiniz
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.contactForm}>
              <h2 className={styles.formTitle}>Mesaj Gönder</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={styles.textarea}
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <Send className={styles.sendIcon} />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className={styles.successMessage}>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <h2 className={styles.infoTitle}>İletişim Bilgileri</h2>
              
              <div className={styles.infoList}>
                {profile?.email && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <Mail className={styles.icon} />
                    </div>
                    <div className={styles.infoContent}>
                      <h3 className={styles.infoLabel}>E-posta</h3>
                      <a href={`mailto:${profile.email}`} className={styles.infoValue}>
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <Phone className={styles.icon} />
                    </div>
                    <div className={styles.infoContent}>
                      <h3 className={styles.infoLabel}>Telefon</h3>
                      <a href={`tel:${profile.phone}`} className={styles.infoValue}>
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <MapPin className={styles.icon} />
                    </div>
                    <div className={styles.infoContent}>
                      <h3 className={styles.infoLabel}>Konum</h3>
                      <span className={styles.infoValue}>{profile.location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile?.github || profile?.linkedin || profile?.twitter) && (
                <div className={styles.socialSection}>
                  <h3 className={styles.socialTitle}>Sosyal Medya</h3>
                  <div className={styles.socialLinks}>
                    {profile.github && (
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
                    {profile.linkedin && (
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
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="Twitter"
                      >
                        <Twitter className={styles.socialIcon} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className={styles.additionalInfo}>
                <h3 className={styles.additionalTitle}>Çalışma Saatleri</h3>
                <div className={styles.schedule}>
                  <div className={styles.scheduleItem}>
                    <span className={styles.day}>Pazartesi - Cuma</span>
                    <span className={styles.time}>09:00 - 18:00</span>
                  </div>
                  <div className={styles.scheduleItem}>
                    <span className={styles.day}>Cumartesi</span>
                    <span className={styles.time}>10:00 - 16:00</span>
                  </div>
                  <div className={styles.scheduleItem}>
                    <span className={styles.day}>Pazar</span>
                    <span className={styles.time}>Kapalı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 