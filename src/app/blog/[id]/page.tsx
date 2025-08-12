import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogDetailSection from '@/app/components/public/sections/BlogDetailSection'

interface BlogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const supabase = createSupabaseServerClient()
  
  // Blog yazısını al
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !blog) {
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
      <BlogDetailSection blog={blog} profile={profile} />
    </PublicLayout>
  )
} 