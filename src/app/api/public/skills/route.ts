import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const supabase = createSupabaseServerClient()

    let query = supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: skills, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      )
    }

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 