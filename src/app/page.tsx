// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'

// Cache for 10 seconds to allow faster profile updates
export const revalidate = 10

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Tüm sorguları paralel olarak çalıştır
    const [profileResult, projectsResult] = await Promise.allSettled([
      // Profil bilgilerini al
      supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single(),
      
      // Projeleri al
      supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)
    ])

    // Sonuçları işle
    const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
    const projects = projectsResult.status === 'fulfilled' ? projectsResult.value.data : []



    return (
      <PublicLayout>
        <HeroSection profile={profile} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            {/* Featured Projects */}
            {projects && projects.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Öne Çıkan Projeler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {project.description?.substring(0, 100)}...
                      </p>
                      {project.content && (
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          <div 
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ 
                              __html: project.content.length > 150 
                                ? project.content.substring(0, 150) + '...' 
                                : project.content 
                            }} 
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 3).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link 
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                        >
                          Detayları Gör
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PublicLayout>
    )
  } catch (error) {
    console.error('Home page error:', error)
    return (
      <PublicLayout>
        <HeroSection profile={undefined} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Veri yüklenirken bir hata oluştu
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </PublicLayout>
    )
  }
}
