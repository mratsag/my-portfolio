import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get experiences
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (experiencesError) {
      console.error('Experiences fetch error:', experiencesError)
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }

    // Calculate stats
    const current = experiences?.filter(exp => exp.current)?.length || 0
    const past = experiences?.filter(exp => !exp.current)?.length || 0
    const locations = new Set(experiences?.map(exp => exp.location) || [])
    const byDuration = experiences?.reduce((acc, exp) => {
      const location = exp.location
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const stats = {
      total: experiences?.length || 0,
      current,
      past,
      byDuration
    }

    return NextResponse.json({
      experiences: experiences || [],
      stats
    })

  } catch (error) {
    console.error('Experiences API error:', error)
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
    const { title, company, location, start_date, end_date, current, description } = body

    // Validate required fields
    if (!title || !company || !location || !start_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert experience
    const { data: experience, error: insertError } = await supabase
      .from('experiences')
      .insert({
        title,
        company,
        location,
        start_date,
        end_date: end_date || null,
        current: current || false,
        description: description || null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Experience insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
    }

    return NextResponse.json({ experience })

  } catch (error) {
    console.error('Experience POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 