// src/app/api/admin/education/[id]/route.ts
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tek eğitim bilgisi getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Education not found' }, { status: 404 })
      }
      console.error('Education fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ education })

  } catch (error) {
    console.error('Education GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Eğitim bilgisi güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { institution, school, degree, field, start_date, end_date, description } = body

    // Validation
    if (!institution || !degree || !field || !start_date) {
      return NextResponse.json(
        { error: 'Kurum, derece, alan ve başlangıç tarihi gereklidir' }, 
        { status: 400 }
      )
    }

    // Get current education
    const { data: currentEducation, error: fetchError } = await supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !currentEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    const updateData = {
      institution: institution.trim(),
      school: school?.trim() || null,
      degree: degree.trim(),
      field: field.trim(),
      start_date,
      end_date: end_date || null,
      description: description?.trim() || null,
      updated_at: new Date().toISOString()
    }

    const { data: education, error } = await supabase
      .from('education')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Education update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ education })

  } catch (error) {
    console.error('Education PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Eğitim bilgisi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if education exists and belongs to user
    const { data: education, error: fetchError } = await supabase
      .from('education')
      .select('id, institution, degree')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    // Delete education
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Education delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Eğitim bilgisi başarıyla silindi',
      deletedEducation: {
        id: id,
        institution: education.institution,
        degree: education.degree
      }
    })

  } catch (error) {
    console.error('Education DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
