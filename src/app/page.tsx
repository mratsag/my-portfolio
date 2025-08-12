// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'

// Cache for 30 seconds to allow faster profile updates
export const revalidate = 30

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Tüm sorguları paralel olarak çalıştır
    const [profileResult, projectsResult, experiencesResult, skillsResult, blogsResult] = await Promise.allSettled([
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
        .limit(3),
      
      // Deneyimleri al
      supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(3),
      
      // Yetenekleri al
      supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(6),
      
      // Blog yazılarını al
      supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
    ])

    // Sonuçları işle
    const profile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
    const projects = projectsResult.status === 'fulfilled' ? projectsResult.value.data : []
    const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value.data : []
    const skills = skillsResult.status === 'fulfilled' ? skillsResult.value.data : []
    const blogs = blogsResult.status === 'fulfilled' ? blogsResult.value.data : []

    // Hataları logla (sadece development'ta)
    if (process.env.NODE_ENV === 'development') {
      if (profileResult.status === 'rejected') console.error('Profile fetch error:', profileResult.reason)
      if (projectsResult.status === 'rejected') console.error('Projects fetch error:', projectsResult.reason)
      if (experiencesResult.status === 'rejected') console.error('Experiences fetch error:', experiencesResult.reason)
      if (skillsResult.status === 'rejected') console.error('Skills fetch error:', skillsResult.reason)
      if (blogsResult.status === 'rejected') console.error('Blogs fetch error:', blogsResult.reason)
    }

    return (
      <PublicLayout>
        <HeroSection profile={profile} />
        
        <div className="bg-gray-50 dark:bg-gray-800">
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Experiences */}
              {experiences && experiences.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Son Deneyimler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {experiences.map((experience) => (
                      <div key={experience.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {experience.title}
                        </h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                          {experience.company}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {experience.description?.substring(0, 100)}...
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(experience.start_date).toLocaleDateString('tr-TR')} - 
                          {experience.end_date ? new Date(experience.end_date).toLocaleDateString('tr-TR') : 'Devam ediyor'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Yetenekler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill) => (
                      <div key={skill.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            skill.level === 'expert' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : skill.level === 'advanced' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : skill.level === 'intermediate' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {skill.level === 'expert' ? 'Uzman' : 
                             skill.level === 'advanced' ? 'İleri' :
                             skill.level === 'intermediate' ? 'Orta' : 'Başlangıç'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Blog Posts */}
              {blogs && blogs.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Son Blog Yazıları
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {blog.title}
                        </h4>
                        {blog.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {blog.excerpt.substring(0, 100)}...
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{blog.author || 'Anonim'}</span>
                          <span>{new Date(blog.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  } catch (error) {
    console.error('Home page error:', error)
    return (
      <PublicLayout>
        <HeroSection profile={undefined} />
        <div className="bg-gray-50 dark:bg-gray-800">
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
        </div>
      </PublicLayout>
    )
  }
}
