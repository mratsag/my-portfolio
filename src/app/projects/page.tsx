import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectsListAurora from '@/app/components/public/sections/ProjectsListAurora'

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

// Cache for 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Projeler - Murat Sağ',
  description: 'Geliştirdiğim projeler ve çalışmalarım. Web uygulamaları, mobil uygulamalar ve yazılım çözümleri.',
  keywords: 'projeler, web uygulamaları, mobil uygulamalar, yazılım projeleri, react, next.js, typescript, murat sağ',
  openGraph: {
    title: 'Projeler - Murat Sağ',
    description: 'Geliştirdiğim projeler ve çalışmalarım. Web uygulamaları, mobil uygulamalar ve yazılım çözümleri.',
    url: 'https://www.muratsag.com/projects',
    siteName: 'Murat Sağ - Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projeler - Murat Sağ',
    description: 'Geliştirdiğim projeler ve çalışmalarım.',
  },
  alternates: {
    canonical: 'https://www.muratsag.com/projects',
  },
}

export default async function ProjectsPage() {
  const supabase = createSupabaseServerClient()

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Projects fetch error:', error)
    }

    return (
      <PublicLayout>
        <div className={`${geist.variable} ${geistMono.variable}`}>
          <ProjectsListAurora projects={projects || []} />
        </div>
      </PublicLayout>
    )
  } catch (error) {
    console.error('Projects page error:', error)
    return (
      <PublicLayout>
        <div className={`${geist.variable} ${geistMono.variable}`}>
          <ProjectsListAurora projects={[]} />
        </div>
      </PublicLayout>
    )
  }
}
