import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogSection from '@/app/components/public/sections/BlogSection'

// Cache for 5 minutes
export const revalidate = 300

export default async function BlogPage() {
  console.log('BlogPage: Starting...')
  
  try {
    // Public API'yi kullan
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/public/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const blogs = data || []

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