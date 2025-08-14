import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogDetailSection from '@/app/components/public/sections/BlogDetailSection'
import ArticleSchema from '../../../components/ArticleSchema'

interface BlogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for blog detail page
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Blog yazısını al
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !blog) {
    return {
      title: 'Blog Yazısı Bulunamadı - Murat Sağ',
      description: 'Aradığınız blog yazısı bulunamadı.',
    }
  }

  const tags = blog.tags?.join(', ') || ''
  const description = blog.excerpt || blog.content?.substring(0, 160) || 'Blog yazısı detayları'

  return {
    title: `${blog.title} - Murat Sağ`,
    description: description,
    keywords: `${tags}, blog, yazılım, teknoloji, murat sağ`,
    openGraph: {
      title: blog.title,
      description: description,
      type: 'article',
      url: `https://www.muratsag.com/blog/${blog.id}`,
      siteName: 'Murat Sağ - Portfolio',
      authors: [blog.author || 'Murat Sağ'],
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
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
      <ArticleSchema
        title={blog.title}
        description={blog.excerpt || blog.content?.substring(0, 160) || 'Blog yazısı'}
        url={`https://www.muratsag.com/blog/${blog.id}`}
        author={blog.author || 'Murat Sağ'}
        publishedDate={blog.created_at}
        modifiedDate={blog.updated_at}
        image={blog.image_url}
      />
      <BlogDetailSection blog={blog} profile={profile} />
    </PublicLayout>
  )
} 