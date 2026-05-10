import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/public/blogs/[id]/view
// Bir blog yazısının görüntülenme sayısını (views) atomik olarak 1 artırır.
// Postgres `increment_blog_views(blog_id uuid)` RPC fonksiyonu kullanır
// (bkz. supabase/migrations/0001_increment_blog_views.sql).
// Client BlogDetailAurora'dan session başına 1 kez çağırılır.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: newViews, error } = await supabase.rpc('increment_blog_views', {
      blog_id: id,
    })

    if (error) {
      // Fonksiyon yoksa veya başka bir DB hatası olduysa
      console.error('increment_blog_views RPC error:', error)
      return NextResponse.json(
        { error: 'Failed to increment views' },
        { status: 500 }
      )
    }

    if (newViews === null) {
      // RPC çalıştı ama UPDATE hiçbir satıra dokunmadı → blog yok
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ views: newViews })
  } catch (error) {
    console.error('Error incrementing blog views:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
