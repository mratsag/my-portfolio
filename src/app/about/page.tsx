import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import AboutAurora from '@/app/components/public/sections/AboutAurora'

// Geist (Vercel) — Aurora typography
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

  const [profileResult, experiencesResult, skillsResult, educationResult] =
    await Promise.allSettled([
      supabase.from('profiles').select('*').limit(1).single(),
      supabase
        .from('experiences')
        .select('*')
        .order('current', { ascending: false })
        .order('start_date', { ascending: false }),
      supabase.from('skills').select('*').order('order_index', { ascending: true }),
      supabase.from('education').select('*').order('start_date', { ascending: false }),
    ])

  const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
  const experiences =
    experiencesResult.status === 'fulfilled' ? experiencesResult.value.data : null
  const skills = skillsResult.status === 'fulfilled' ? skillsResult.value.data : null
  const education =
    educationResult.status === 'fulfilled' ? educationResult.value.data : null

  return (
    <PublicLayout>
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <AboutAurora
          profile={profile}
          experiences={experiences}
          skills={skills}
          education={education}
        />
      </div>
    </PublicLayout>
  )
}
