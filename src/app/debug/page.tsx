import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function DebugPage() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Tüm sorguları test et
    const [profileResult, projectsResult, experiencesResult, skillsResult, blogsResult] = await Promise.allSettled([
      supabase.from('profiles').select('*').limit(1).single(),
      supabase.from('projects').select('*').eq('featured', true).limit(3),
      supabase.from('experiences').select('*').limit(3),
      supabase.from('skills').select('*').limit(6),
      supabase.from('blog_posts').select('*').eq('published', true).limit(3)
    ])

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Debug Sayfası</h1>
        
        <div className="space-y-8">
          {/* Profile Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(profileResult, null, 2)}
            </pre>
          </div>

          {/* Projects Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(projectsResult, null, 2)}
            </pre>
          </div>

          {/* Experiences Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Experiences</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(experiencesResult, null, 2)}
            </pre>
          </div>

          {/* Skills Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(skillsResult, null, 2)}
            </pre>
          </div>

          {/* Blog Posts Debug */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(blogsResult, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Debug Sayfası - Hata</h1>
        <div className="bg-red-100 p-6 rounded-lg">
          <pre className="text-red-800">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    )
  }
} 