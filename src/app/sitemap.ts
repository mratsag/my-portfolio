import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.muratsag.com'
  
  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Statik sayfalar
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dinamik proje sayfaları
  const { data: projects } = await supabase
    .from('projects')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })

  const projectPages = projects?.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(project.updated_at || project.id),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || []

  // Dinamik blog sayfaları
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const blogPages = blogs?.map((blog) => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastModified: new Date(blog.updated_at || blog.id),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || []

  return [...staticPages, ...projectPages, ...blogPages]
}
