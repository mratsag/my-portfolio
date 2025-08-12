// src/app/api/admin/projects/[id]/route.ts
import { createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tek proje getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      console.error('Project fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Project GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Proje güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    // Get current project
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create slug from title if title changed
    let finalSlug = currentProject.slug
    if (title !== currentProject.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Check if new slug exists (excluding current project)
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', newSlug)
        .eq('user_id', session.user.id)
        .neq('id', id)
        .single()

      if (existingProject) {
        finalSlug = `${newSlug}-${Date.now()}`
      } else {
        finalSlug = newSlug
      }
    }

    const updateData = {
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
      updated_at: new Date().toISOString()
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Project update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Project PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Proje sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    // Check if project exists and belongs to user
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, image_url')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Project delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }


    // if (project.image_url) {
    //   // Delete from Supabase storage
    // }

    return NextResponse.json({ message: 'Project deleted successfully' })

  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}