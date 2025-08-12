import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectDetailSection from '@/app/components/public/sections/ProjectDetailSection'

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
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