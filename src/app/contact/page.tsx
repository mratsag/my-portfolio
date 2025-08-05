import { createServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ContactSection from '@/app/components/public/sections/ContactSection'

export default async function ContactPage() {
  const supabase = createServerClient()
  
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