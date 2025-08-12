import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build query
    let query = supabase
      .from('blogs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('published', status === 'published')
    }

    const { data: blogs, error: blogsError } = await query

    if (blogsError) {
      console.error('Blogs fetch error:', blogsError)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    // Calculate stats
    const total = blogs?.length || 0
    const published = blogs?.filter(blog => blog.published)?.length || 0
    const draft = blogs?.filter(blog => !blog.published)?.length || 0
    const views = blogs?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0

    const stats = {
      total,
      published,
      draft,
      views
    }

    return NextResponse.json({
      blogs: blogs || [],
      stats
    })

  } catch (error) {
    console.error('Blogs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Insert blog
    const { data: blog, error: insertError } = await supabase
      .from('blogs')
      .insert({
        user_id: session.user.id,
        title,
        excerpt: excerpt || null,
        content,
        author: author || null,
        tags: tags || [],
        published: published || false,
        views: 0
      })
      .select()
      .single()

    if (insertError) {
      console.error('Blog insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
    }

    return NextResponse.json({ blog })

  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 