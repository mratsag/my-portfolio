import { createServerClient } from '@/lib/supabase-server'
import PublicLayout from '@/app/components/public/layout/PublicLayout'

export default async function DebugPage() {
  const supabase = createServerClient()
  
  try {
    // Tüm tabloları test et
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')

    const { data: blogs, error: blogError } = await supabase
      .from('blogs')
      .select('*')

    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')

    const { data: experiences, error: experienceError } = await supabase
      .from('experiences')
      .select('*')

    const { data: skills, error: skillError } = await supabase
      .from('skills')
      .select('*')

    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Debug Sayfası
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Profil Verileri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hata: {profileError ? profileError.message : 'Yok'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veri Sayısı: {profiles?.length || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Blog Verileri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hata: {blogError ? blogError.message : 'Yok'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veri Sayısı: {blogs?.length || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Proje Verileri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hata: {projectError ? projectError.message : 'Yok'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veri Sayısı: {projects?.length || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Deneyim Verileri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hata: {experienceError ? experienceError.message : 'Yok'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veri Sayısı: {experiences?.length || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Yetenek Verileri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hata: {skillError ? skillError.message : 'Yok'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veri Sayısı: {skills?.length || 0}
                </p>
              </div>
            </div>

            {blogs && blogs.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Blog Verileri Detay
                </h2>
                <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-auto">
                  {JSON.stringify(blogs, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </PublicLayout>
    )
  } catch (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Debug Sayfası - Hata
            </h1>
            <div className="bg-red-100 dark:bg-red-900 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-200">
                Hata: {error instanceof Error ? error.message : 'Bilinmeyen hata'}
              </p>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }
} 