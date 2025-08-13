// src/app/api/admin/skills/[id]/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tek yetenek getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: skill, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
      }
      console.error('Skill fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ skill })

  } catch (error) {
    console.error('Skill GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Yetenek güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { name, category, level } = body

    // Validation
    if (!name || !category || !level) {
      return NextResponse.json(
        { error: 'Ad, kategori ve seviye gereklidir' }, 
        { status: 400 }
      )
    }

    if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
      return NextResponse.json(
        { error: 'Geçersiz seviye' },
        { status: 400 }
      )
    }

    // Get current skill
    const { data: currentSkill, error: fetchError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !currentSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Check if another skill with same name and category exists (excluding current)
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .eq('name', name.trim())
      .eq('category', category.trim())
      .neq('id', id)
      .single()

    if (existingSkill) {
      return NextResponse.json(
        { error: 'Bu kategori için aynı isimde yetenek zaten mevcut' },
        { status: 409 }
      )
    }

    const updateData = {
      name: name.trim(),
      category: category.trim(),
      level,
      updated_at: new Date().toISOString()
    }

    const { data: skill, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Skill update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ skill })

  } catch (error) {
    console.error('Skill PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Yetenek sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if skill exists and belongs to user
    const { data: skill, error: fetchError } = await supabase
      .from('skills')
      .select('id, name, category, order_index')
      .eq('id', id)
      .single()

    if (fetchError || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Delete skill
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Skill delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Reorder remaining skills in the same category
    const { data: remainingSkills, error: reorderError } = await supabase
      .from('skills')
      .select('id, order_index')
      .eq('category', skill.category)
      .gt('order_index', skill.order_index)
      .order('order_index', { ascending: true })

    if (!reorderError && remainingSkills) {
      for (let i = 0; i < remainingSkills.length; i++) {
        await supabase
          .from('skills')
          .update({ order_index: skill.order_index + i })
          .eq('id', remainingSkills[i].id)
      }
    }

    return NextResponse.json({
      message: 'Yetenek başarıyla silindi',
      deletedSkill: {
        id: id,
        name: skill.name,
        category: skill.category
      }
    })

  } catch (error) {
    console.error('Skill DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}