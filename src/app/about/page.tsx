import { createClient } from '@supabase/supabase-js'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import AboutSection from '@/app/components/public/sections/AboutSection'

// Cache for 30 seconds to allow faster profile updates
export const revalidate = 30

export default async function AboutPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
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
    
    // Eğitim bilgilerini al - RLS bypass için tüm verileri çek
    supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })
  ])

  // Sonuçları işle
  const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
  const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value.data : undefined
  const skills = skillsResult.status === 'fulfilled' ? skillsResult.value.data : undefined
  const education = educationResult.status === 'fulfilled' ? educationResult.value.data : undefined



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