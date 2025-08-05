import { createServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogSection from '@/app/components/public/sections/BlogSection'

export default async function BlogPage() {
  const supabase = createServerClient()
  
  try {
    // Tüm blog yazılarını al
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Blog fetch error:', error)
    }

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