import { createSupabaseServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import AboutSection from '@/app/components/public/sections/AboutSection'

// Cache for 30 seconds to allow faster profile updates
export const revalidate = 30

export default async function AboutPage() {
  const supabase = createSupabaseServerClient()
  
  // Tüm sorguları paralel olarak çalıştır
  const [profileResult, experiencesResult, skillsResult, educationResult] = await Promise.allSettled([
    // Profil bilgilerini al
    supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single(),
    
    // Deneyimleri al
    supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false }),
    
    // Yetenekleri al
    supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true }),
    
    // Eğitim bilgilerini al
    supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })
  ])

  // Sonuçları işle
  const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
  const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value.data : []
  const skills = skillsResult.status === 'fulfilled' ? skillsResult.value.data : []
  const education = educationResult.status === 'fulfilled' ? educationResult.value.data : []

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