'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminBreadcrumb from './AdminBreadcrumb'
import styles from '@/styles/components/AdminLayoutAurora.module.css'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className={styles.root}>
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className={styles.main}>
        <AdminHeader onMobileMenuOpen={() => setIsMobileOpen(true)} />
        <AdminBreadcrumb />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
