import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    const supabase = createSupabaseServerClient()

    let query = supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: experiences, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch experiences' },
        { status: 500 }
      )
    }

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 