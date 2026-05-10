import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import BlogListAurora from '@/app/components/public/sections/BlogListAurora'

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

// Cache for 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog - Murat Sağ',
  description: 'Yazılım, teknoloji ve deneyimlerim hakkında blog yazılarım. MikroTik, ağ teknolojileri ve yazılım geliştirme konularında içerikler.',
  keywords: 'blog, yazılım, teknoloji, mikrotik, ağ teknolojileri, yazılım geliştirme, murat sağ',
  openGraph: {
    title: 'Blog - Murat Sağ',
    description: 'Yazılım, teknoloji ve deneyimlerim hakkında blog yazılarım.',
    type: 'website',
    url: 'https://www.muratsag.com/blog',
    siteName: 'Murat Sağ - Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Murat Sağ',
    description: 'Yazılım, teknoloji ve deneyimlerim hakkında blog yazılarım.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Blogs fetch error:', error)
    }

    return (
      <PublicLayout>
        <div className={`${geist.variable} ${geistMono.variable}`}>
          <BlogListAurora blogs={blogs || []} />
        </div>
      </PublicLayout>
    )
  } catch (error) {
    console.error('Blog page error:', error)
    return (
      <PublicLayout>
        <div className={`${geist.variable} ${geistMono.variable}`}>
          <BlogListAurora blogs={[]} />
        </div>
      </PublicLayout>
    )
  }
}
