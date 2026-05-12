import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectDetailAurora from '@/app/components/public/sections/ProjectDetailAurora'
import ProjectSchema from '../../../components/ProjectSchema'

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

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// URL parametresi UUID veya slug olabilir — her ikisi için de çalış
async function fetchProject(idOrSlug: string) {
  const supabase = createSupabaseServerClient()
  const isUuid = UUID_REGEX.test(idOrSlug)
  const column = isUuid ? 'id' : 'slug'

  return supabase.from('projects').select('*').eq(column, idOrSlug).maybeSingle()
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params

  const { data: project, error } = await fetchProject(id)

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
    description,
    keywords: `${technologies}, proje, yazılım, web geliştirme, murat sağ`,
    openGraph: {
      title: project.title,
      description,
      type: 'website',
      url: `https://www.muratsag.com/projects/${project.id}`,
      siteName: 'Murat Sağ - Portfolio',
      images: project.image_url
        ? [
            {
              url: project.image_url,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.image_url ? [project.image_url] : undefined,
    },
    alternates: {
      canonical: `https://www.muratsag.com/projects/${project.id}`,
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params

  const { data: project, error } = await fetchProject(id)

  if (error || !project) {
    notFound()
  }

  return (
    <PublicLayout>
      <ProjectSchema
        title={project.title}
        description={project.description || project.content?.substring(0, 160) || 'Proje detayları'}
        url={`https://www.muratsag.com/projects/${project.id}`}
        technologies={project.technologies || []}
        image={project.image_url}
        githubUrl={project.github_url}
        demoUrl={project.demo_url}
        createdDate={project.created_at}
        updatedDate={project.updated_at}
      />
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <ProjectDetailAurora project={project} />
      </div>
    </PublicLayout>
  )
}
