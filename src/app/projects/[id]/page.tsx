import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectDetailSection from '@/app/components/public/sections/ProjectDetailSection'

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for project detail page
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = createSupabaseServerClient()
  
  // Projeyi al
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) {
    return {
      title: 'Proje Bulunamadı - Murat Sağ',
      description: 'Aradığınız proje bulunamadı.',
    }
  }

  const technologies = project.technologies?.join(', ') || ''
  const description = project.description || project.content?.substring(0, 160) || 'Proje detayları'

  return {
    title: `${project.title} - Murat Sağ`,
    description: description,
    keywords: `${technologies}, proje, yazılım, web geliştirme, murat sağ`,
    openGraph: {
      title: project.title,
      description: description,
      type: 'website',
      url: `https://www.muratsag.com/projects/${project.id}`,
      siteName: 'Murat Sağ - Portfolio',
      images: project.image_url ? [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: description,
      images: project.image_url ? [project.image_url] : undefined,
    },
    alternates: {
      canonical: `https://www.muratsag.com/projects/${project.id}`,
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const supabase = createSupabaseServerClient()
  
  // Projeyi al
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  return (
    <PublicLayout>
      <ProjectDetailSection project={project} profile={profile} />
    </PublicLayout>
  )
} 