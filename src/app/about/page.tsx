import { createServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import AboutSection from '@/app/components/public/sections/AboutSection'

export default async function AboutPage() {
  const supabase = createServerClient()
  
  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  // Deneyimleri al
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })

  // Yetenekleri al
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('order_index', { ascending: true })

  // Eğitim bilgilerini al
  const { data: education } = await supabase
    .from('education')
    .select('*')
    .order('start_date', { ascending: false })

  return (
    <PublicLayout>
      <AboutSection 
        profile={profile}
        experiences={experiences}
        skills={skills}
        education={education}
      />
    </PublicLayout>
  )
} 