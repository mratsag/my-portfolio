'use client'
// src/app/auth/login/page.tsx

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import { AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import styles from '@/styles/components/LoginAurora.module.css'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Giriş başarısız: ' + signInError.message)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${geist.variable} ${geistMono.variable}`}>
      <main className={styles.page}>
        <div className={styles.glowBg} aria-hidden="true" />

        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <span className={styles.brandIcon}>M</span>
            </Link>
            <p className={styles.brandLabel}>Admin / Giriş</p>
            <h1 className={styles.brandTitle}>Tekrar hoş geldin.</h1>
            <p className={styles.brandSub}>Portfolio yönetim paneline giriş yap.</p>
          </div>

          {/* Card */}
          <div className={styles.card}>
            <form onSubmit={handleSignIn} className={styles.form}>
              {error && (
                <div className={styles.errorBanner} role="alert">
                  <AlertCircle size={18} className={styles.errorIcon} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  E-posta
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Şifre
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.input} ${styles.inputWithToggle}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.submit}>
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>

          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={14} />
            Siteye geri dön
          </Link>
        </div>
      </main>
    </div>
  )
}
