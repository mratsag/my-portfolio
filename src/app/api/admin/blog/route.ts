import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build query - get all blogs for admin
    let query = supabase
      .from('blogs')
      .select('*')
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
        title,
        excerpt: excerpt || null,
        content,
        author: author || null,
        tags: tags || [],
        published: published || false,
        views: 0,
        user_id: 'ce805e36-b98e-48a9-825b-0c9198093953' // Default user ID for admin operations
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