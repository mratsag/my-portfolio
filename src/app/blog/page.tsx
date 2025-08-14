import { createClient } from '@supabase/supabase-js'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogSection from '@/app/components/public/sections/BlogSection'

// Cache for 5 minutes
export const revalidate = 300

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    // Tüm blog yazılarını al
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Blogs fetch error:', error)
    }

    console.log('BlogPage: Final blogs data:', blogs)
    console.log('BlogPage: Blogs length:', blogs?.length)

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