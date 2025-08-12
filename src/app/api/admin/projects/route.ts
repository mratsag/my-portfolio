// src/app/api/admin/projects/route.ts

import { createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tüm projeleri getir
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const featured = searchParams.get('featured') || 'all'

    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // Featured filter
    if (featured !== 'all') {
      query = query.eq('featured', featured === 'true')
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: projects, error, count } = await query

    if (error) {
      console.error('Projects fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      projects: projects || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Yeni proje oluştur
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      image_url,
      demo_url,
      github_url,
      technologies,
      featured,
      status
    } = body

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' }, 
        { status: 400 }
      )
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .eq('user_id', session.user.id)
      .single()

    let finalSlug = slug
    if (existingProject) {
      finalSlug = `${slug}-${Date.now()}`
    }

    const projectData = {
      title,
      slug: finalSlug,
      description,
      content: content || '',
      image_url: image_url || null,
      demo_url: demo_url || null,
      github_url: github_url || null,
      technologies: technologies || [],
      featured: featured || false,
      status: status || 'draft',
      user_id: session.user.id
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (error) {
      console.error('Project creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project }, { status: 201 })

  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}