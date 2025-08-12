import { createSupabaseServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ContactSection from '@/app/components/public/sections/ContactSection'

// Cache for 5 minutes
export const revalidate = 300

export default async function ContactPage() {
  const supabase = createSupabaseServerClient()
  
  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  return (
    <PublicLayout>
      <ContactSection profile={profile} />
    </PublicLayout>
  )
} 