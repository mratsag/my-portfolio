// src/app/admin/layout.tsx

import { redirect } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminShell from '@/app/components/admin/layout/AdminShell'

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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className={`${geist.variable} ${geistMono.variable}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
