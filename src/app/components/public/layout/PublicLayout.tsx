'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Header from './Header'
import Footer from './Footer'
import styles from '@/styles/public/PublicLayout.module.css'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.layout} data-theme={theme}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
} 