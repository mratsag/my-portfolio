// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HomeAurora from '@/app/components/public/sections/HomeAurora'
import type { Skill, Experience } from '@/lib/types'

// Geist (Vercel) — modern, sharp, paired sans + mono
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

// Cache for 10 seconds to allow faster profile updates
export const revalidate = 10

export const metadata: Metadata = {
  title: 'Murat Sağ - Software Developer & Computer Engineering Student',
  description: 'Yazılım geliştirici ve bilgisayar mühendisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri konularında deneyimli.',
  keywords: 'yazılım geliştirici, web geliştirme, mobil uygulama, react, next.js, typescript, javascript, portfolio, murat sağ',
  openGraph: {
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri.',
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
    description: 'Yazılım geliştirici ve bilgisayar mühendisi.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://www.muratsag.com',
  },
}

export default async function Home() {
  const supabase = createSupabaseServerClient()

  const [
    profileRes,
    skillsRes,
    experiencesRes,
    projectsCountRes,
    blogsCountRes,
    latestProjectRes,
    latestBlogRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('skills').select('*').order('order_index', { ascending: true }),
    supabase
      .from('experiences')
      .select('*')
      .order('current', { ascending: false })
      .order('start_date', { ascending: false })
      .limit(6),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase
      .from('projects')
      .select('id, title, description, image_url, technologies, slug')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blogs')
      .select('id, title, excerpt, image_url, tags, reading_time, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const profile = profileRes.data
  const skills: Skill[] = skillsRes.data ?? []
  const experiences: Experience[] = experiencesRes.data ?? []
  const projectCount = projectsCountRes.count ?? 0
  const blogCount = blogsCountRes.count ?? 0
  const latestProject = latestProjectRes.data
  const latestBlog = latestBlogRes.data

  return (
    <PublicLayout>
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <HomeAurora
          profile={profile || undefined}
          skills={skills}
          experiences={experiences}
          projectCount={projectCount}
          blogCount={blogCount}
          latestProject={latestProject}
          latestBlog={latestBlog}
        />
      </div>
    </PublicLayout>
  )
}
