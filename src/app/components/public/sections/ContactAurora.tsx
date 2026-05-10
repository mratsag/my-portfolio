'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import styles from '@/styles/components/ContactAurora.module.css'

interface ContactAuroraProps {
  profile?: {
    full_name?: string
    email?: string
    phone?: string
    location?: string
    github?: string
    linkedin?: string
    website?: string
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

export default function ContactAurora({ profile }: ContactAuroraProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Mesaj gönderilirken bir hata oluştu')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Bağlantı hatası — lütfen tekrar dene')
    } finally {
      setIsSubmitting(false)
    }
  }

  const email = profile?.email || 'murat@muratsag.com'
  const phone = profile?.phone
  const location = profile?.location || 'Karabük, Türkiye'

  return (
    <main className={styles.page}>
      <div className={styles.glowBg} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.p {...fadeUp} className={styles.sectionLabel}>
              01 / İletişim
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className={styles.heroTitle}
            >
              Birlikte <span className={styles.heroTitleAccent}>çalışalım.</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className={styles.heroSub}
            >
              Web, mobil veya yazılım projen için aklında bir şey varsa formu
              doldur — genelde 24 saat içinde dönüyorum.
            </motion.p>
          </div>
        </section>

        {/* MAIN */}
        <section className={styles.main}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {/* FORM */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className={styles.formCard}
              >
                <h2 className={styles.formTitle}>Mesaj gönder</h2>
                <p className={styles.formSubtitle}>
                  Tüm alanlar zorunlu. Mesajın direkt bana gelir.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label htmlFor="name" className={styles.label}>
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Adınız"
                        autoComplete="name"
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="email" className={styles.label}>
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="ornek@email.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="subject" className={styles.label}>
                      Konu
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="message" className={styles.label}>
                      Mesaj
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={styles.textarea}
                      placeholder="Projeniz hakkında kısaca bilgi verin..."
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} className={styles.submit}>
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner} aria-hidden="true" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Mesaj Gönder
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={styles.successBanner}
                      role="status"
                    >
                      <CheckCircle2 size={20} />
                      <span>
                        Mesajın başarıyla gönderildi! 24 saat içinde sana dönüş
                        yapacağım.
                      </span>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={styles.errorBanner}
                      role="alert"
                    >
                      <AlertCircle size={20} />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </form>
              </motion.div>

              {/* INFO */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                className={styles.infoStack}
              >
                <div className={styles.infoCard}>
                  <div className={styles.statusPill}>
                    <span className={styles.statusDot} />
                    Yeni projelere açığım
                  </div>
                </div>

                <a href={`mailto:${email}`} className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Mail size={20} />
                  </div>
                  <p className={styles.infoLabel}>E-posta</p>
                  <p className={styles.infoValue}>{email}</p>
                </a>

                {phone && (
                  <a href={`tel:${phone}`} className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <Phone size={20} />
                    </div>
                    <p className={styles.infoLabel}>Telefon</p>
                    <p className={styles.infoValue}>{phone}</p>
                  </a>
                )}

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <MapPin size={20} />
                  </div>
                  <p className={styles.infoLabel}>Konum</p>
                  <p className={styles.infoValue}>{location}</p>
                </div>

                {(profile?.github || profile?.linkedin || profile?.website) && (
                  <div className={styles.infoCard}>
                    <p className={styles.infoLabel} style={{ marginBottom: '0.5rem' }}>
                      Sosyal
                    </p>
                    <div className={styles.socialRow}>
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label="GitHub"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label="Website"
                        >
                          <Globe size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
