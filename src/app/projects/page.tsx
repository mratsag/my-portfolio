import { createServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ProjectsSection from '@/app/components/public/sections/ProjectsSection'

export default async function ProjectsPage() {
  const supabase = createServerClient()
  
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