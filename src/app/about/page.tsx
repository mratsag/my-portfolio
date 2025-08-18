import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import AboutSection from '@/app/components/public/sections/AboutSection'

// Cache for 30 seconds to allow faster profile updates
export const revalidate = 30

export const metadata: Metadata = {
  title: 'Hakkımda - Murat Sağ',
  description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi Murat Sağ hakkında detaylı bilgi. Deneyimler, yetenekler ve eğitim geçmişi.',
  keywords: 'hakkımda, murat sağ, yazılım geliştirici, bilgisayar mühendisliği, deneyimler, yetenekler, eğitim, portfolio',
  openGraph: {
    title: 'Hakkımda - Murat Sağ',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi Murat Sağ hakkında detaylı bilgi.',
    url: 'https://www.muratsag.com/about',
    siteName: 'Murat Sağ - Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakkımda - Murat Sağ',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi Murat Sağ hakkında detaylı bilgi.',
  },
  alternates: {
    canonical: 'https://www.muratsag.com/about',
  },
}

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

  // Debug bilgileri
  console.log('=== ABOUT PAGE DEBUG ===')
  console.log('Skills Result Status:', skillsResult.status)
  if (skillsResult.status === 'fulfilled') {
    console.log('Skills Data:', skillsResult.value.data)
    console.log('Skills Count:', skillsResult.value.data?.length)
    console.log('Skills Error:', skillsResult.value.error)
  } else {
    console.log('Skills Error:', skillsResult.reason)
  }
  console.log('Final Skills:', skills)
  console.log('Skills Length:', skills?.length)
  
  // Skills verilerini detaylı kontrol et
  if (skills && skills.length > 0) {
    console.log('=== SKILLS DETAILS ===')
    skills.forEach((skill, index) => {
      console.log(`Skill ${index + 1}:`, {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        order_index: skill.order_index
      })
    })
  } else {
    console.log('No skills data found!')
  }


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