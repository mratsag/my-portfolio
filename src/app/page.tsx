// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HomeModern from '@/app/components/public/sections/HomeModern'
import type { Skill, Experience } from '@/lib/types'

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
    projectsListRes,
    blogsListRes,
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
      .select('id, title, slug, description, image_url, technologies, created_at')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('blogs')
      .select('id, title, excerpt, tags, reading_time, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const profile = profileRes.data
  const skills: Skill[] = skillsRes.data ?? []
  const experiences: Experience[] = experiencesRes.data ?? []
  const projectCount = projectsCountRes.count ?? 0
  const blogCount = blogsCountRes.count ?? 0
  const projects = projectsListRes.data ?? []
  const posts = blogsListRes.data ?? []

  return (
    <PublicLayout>
      <HomeModern
        profile={profile || undefined}
        skills={skills}
        experiences={experiences}
        projectCount={projectCount}
        blogCount={blogCount}
        projects={projects}
        posts={posts}
      />
    </PublicLayout>
  )
}
