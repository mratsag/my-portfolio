import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let query = supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: education, error } = await query

    if (error) {
      console.error('Education fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(education || [])

  } catch (error) {
    console.error('Education API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
