// src/app/api/admin/education/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tüm eğitim bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Education fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ education })

  } catch (error) {
    console.error('Education GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Yeni eğitim bilgisi ekle
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { institution, school, degree, field, start_date, end_date, description } = body

    // Validation
    if (!institution || !degree || !field || !start_date) {
      return NextResponse.json(
        { error: 'Kurum, derece, alan ve başlangıç tarihi gereklidir' }, 
        { status: 400 }
      )
    }

    // Insert education
    const { data: education, error } = await supabase
      .from('education')
      .insert({
        institution: institution.trim(),
        school: school?.trim() || null,
        degree: degree.trim(),
        field: field.trim(),
        start_date,
        end_date: end_date || null,
        description: description?.trim() || null
      })
      .select()
      .single()

    if (error) {
      console.error('Education insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ education })

  } catch (error) {
    console.error('Education POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
