import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get experience
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (experienceError) {
      if (experienceError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
      }
      console.error('Experience fetch error:', experienceError)
      return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
    }

    return NextResponse.json({ experience })

  } catch (error) {
    console.error('Experience GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    // Update experience
    const { data: experience, error: updateError } = await supabase
      .from('experiences')
      .update({
        title,
        company,
        location,
        start_date,
        end_date: end_date || null,
        current: current || false,
        description: description || null
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Experience update error:', updateError)
      return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
    }

    return NextResponse.json({ experience })

  } catch (error) {
    console.error('Experience PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Delete experience
    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Experience delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Experience DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 