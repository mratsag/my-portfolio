import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')

    const supabase = createSupabaseServerClient()

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: projects, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 