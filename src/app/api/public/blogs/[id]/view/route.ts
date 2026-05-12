import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST /api/public/blogs/[id]/view
// Bir blog yazısının görüntülenme sayısını (views) atomik olarak 1 artırır.
// Postgres `increment_blog_views(blog_id uuid)` RPC fonksiyonu kullanır
// (bkz. supabase/migrations/0001_increment_blog_views.sql).
// URL parametresi UUID veya slug olabilir; slug ise önce gerçek id'yi bulup RPC çağırırız.
// Client BlogDetailAurora'dan session başına 1 kez çağırılır.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let blogId = idOrSlug

    // Eğer UUID değilse slug'tan id'yi bul
    if (!UUID_REGEX.test(idOrSlug)) {
      const { data: blog, error: lookupError } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', idOrSlug)
        .maybeSingle()

      if (lookupError || !blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      blogId = blog.id
    }

    const { data: newViews, error } = await supabase.rpc('increment_blog_views', {
      blog_id: blogId,
    })

    if (error) {
      console.error('increment_blog_views RPC error:', error)
      return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
    }

    if (newViews === null) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ views: newViews })
  } catch (error) {
    console.error('Error incrementing blog views:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
