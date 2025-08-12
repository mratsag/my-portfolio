// src/app/admin/layout.tsx

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminSidebar from '@/app/components/admin/layout/AdminSidebar'
import AdminHeader from '@/app/components/admin/layout/AdminHeader'
import AdminBreadcrumb from '@/app/components/admin/layout/AdminBreadcrumb'

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
    <div className="min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <AdminHeader />
        
        {/* Breadcrumb */}
        <AdminBreadcrumb />
        
        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}