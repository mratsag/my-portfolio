// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'

// Cache for 10 seconds to allow faster profile updates
export const revalidate = 10

export const metadata: Metadata = {
  title: 'Murat Sağ - Software Developer & Computer Engineering Student',
  description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri konularında deneyimli.',
  keywords: 'yazılım geliştirici, web geliştirme, mobil uygulama, react, next.js, typescript, javascript, portfolio, murat sağ',
  openGraph: {
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri.',
    url: 'https://www.muratsag.com',
    siteName: 'Murat Sağ - Portfolio',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Murat Sağ Portfolio',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://www.muratsag.com',
  },
}

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Profil bilgilerini al
    const profileResult = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    const profile = profileResult.data



    return (
      <PublicLayout>
        <HeroSection profile={profile} />
      </PublicLayout>
    )
  } catch (error) {
    console.error('Home page error:', error)
    return (
      <PublicLayout>
        <HeroSection profile={undefined} />
      </PublicLayout>
    )
  }
}
