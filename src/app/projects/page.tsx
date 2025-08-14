import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectsSection from '@/app/components/public/sections/ProjectsSection'

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
    // Tüm projeleri al
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Projects fetch error:', error)
    }

    return (
      <PublicLayout>
        <ProjectsSection projects={projects || []} />
      </PublicLayout>
    )
  } catch (error) {
    console.error('Projects page error:', error)
    return (
      <PublicLayout>
        <ProjectsSection projects={[]} />
      </PublicLayout>
    )
  }
} 