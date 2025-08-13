import { createSupabaseServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogSection from '@/app/components/public/sections/BlogSection'

// Cache for 5 minutes
export const revalidate = 300

export default async function BlogPage() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Yayınlanmış blog yazılarını al
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Blog fetch error:', error)
    }

    console.log('Blog data:', blogs)
    console.log('Blog count:', blogs?.length)

    return (
      <PublicLayout>
        <BlogSection blogs={blogs || []} />
      </PublicLayout>
    )
  } catch (error) {
    console.error('Blog page error:', error)
    return (
      <PublicLayout>
        <BlogSection blogs={[]} />
      </PublicLayout>
    )
  }
} 