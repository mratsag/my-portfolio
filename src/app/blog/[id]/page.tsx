import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogDetailAurora from '@/app/components/public/sections/BlogDetailAurora'
import ArticleSchema from '../../../components/ArticleSchema'

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

interface BlogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// URL parametresi UUID veya slug olabilir
async function fetchBlog(idOrSlug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const isUuid = UUID_REGEX.test(idOrSlug)
  const column = isUuid ? 'id' : 'slug'
  return supabase.from('blogs').select('*').eq(column, idOrSlug).maybeSingle()
}

// Generate metadata for blog detail page
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const { data: blog, error } = await fetchBlog(id)

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
      url: `https://www.muratsag.com/blog/${blog.slug || blog.id}`,
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

  const { data: blog, error } = await fetchBlog(id)

  if (error || !blog) {
    notFound()
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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
        url={`https://www.muratsag.com/blog/${blog.slug || blog.id}`}
        author={blog.author || 'Murat Sağ'}
        publishedDate={blog.created_at}
        modifiedDate={blog.updated_at}
        image={blog.image_url}
      />
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <BlogDetailAurora blog={blog} profile={profile} />
      </div>
    </PublicLayout>
  )
}
