// src/app/page.tsx
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerClient()
  
  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  // Projeleri al
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Deneyimleri al
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(3)

  // Yetenekleri al
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('order_index', { ascending: true })
    .limit(6)

  // Blog yazılarını al
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <span className="text-white font-bold text-2xl">
                {profile?.full_name?.charAt(0) || 'M'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {profile?.full_name || 'Murat Sağ'}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
              {profile?.title || 'Software Developer & Computer Engineering Student'}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {profile?.bio || 'Java, Python, C, Dart ve C# gibi programlama dillerinde deneyim sahibi, React.js ve Spring Boot teknolojileriyle projeler geliştiren bir yazılım geliştirici.'}
            </p>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/admin"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Admin Panel
            </Link>
            <a
              href={`mailto:${profile?.email || 'mrat.sag@hotmail.com'}`}
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              İletişim
            </a>
          </div>

          {/* Featured Projects */}
          {projects && projects.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Öne Çıkan Projeler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
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
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
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
                  <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {experience.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {experience.location}
                    </p>
                    {experience.current && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
                        Devam Ediyor
                      </span>
                    )}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {skill.name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
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

          {/* Social Links */}
          {profile && (profile.linkedin || profile.github || profile.instagram) && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Sosyal Medya
              </h3>
              <div className="flex justify-center space-x-6">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.070-4.85.070-3.204 0-3.584-.012-4.849-.070-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 text-gray-500 dark:text-gray-400">
            <p>© 2025 {profile?.full_name || 'Murat Sağ'}. Tüm hakları saklıdır.</p>
            <p className="mt-2 text-sm">
              Next.js & Supabase ile geliştirilmiştir
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}