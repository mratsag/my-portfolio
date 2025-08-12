import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get blog
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (blogError) {
      if (blogError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      console.error('Blog fetch error:', blogError)
      return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
    }

    return NextResponse.json({ blog })

  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, author, tags, published } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update blog
    const { data: blog, error: updateError } = await supabase
      .from('blogs')
      .update({
        title,
        excerpt: excerpt || null,
        content,
        author: author || null,
        tags: tags || [],
        published: published || false
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Blog update error:', updateError)
      return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
    }

    return NextResponse.json({ blog })

  } catch (error) {
    console.error('Blog PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete blog
    const { error: deleteError } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (deleteError) {
      console.error('Blog delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Blog DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 