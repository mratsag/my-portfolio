// src/app/api/admin/skills/route.ts

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tüm yetenekleri getir
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const groupBy = searchParams.get('groupBy') || 'category'

    let query = supabase
      .from('skills')
      .select('*')
      .eq('user_id', session.user.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: skills, error } = await query

    if (error) {
      console.error('Skills fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group skills by category if requested
    if (groupBy === 'category') {
      const grouped = (skills || []).reduce((acc, skill) => {
        const category = skill.category || 'Diğer'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(skill)
        return acc
      }, {} as Record<string, typeof skills>)

      // Get categories and stats
      const categories = Object.keys(grouped).sort()
      const totalSkills = skills?.length || 0
      const skillsByLevel = (skills || []).reduce((acc, skill) => {
        acc[skill.level] = (acc[skill.level] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return NextResponse.json({
        skills: skills || [],
        grouped,
        categories,
        stats: {
          total: totalSkills,
          categories: categories.length,
          byLevel: skillsByLevel,
          byCategory: Object.keys(grouped).map(cat => ({
            category: cat,
            count: grouped[cat].length
          }))
        }
      })
    }

    return NextResponse.json({
      skills: skills || [],
      stats: {
        total: skills?.length || 0
      }
    })

  } catch (error) {
    console.error('Skills GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Yeni yetenek oluştur
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Check if skill with same name and category already exists
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .eq('name', name.trim())
      .eq('category', category.trim())
      .eq('user_id', session.user.id)
      .single()

    if (existingSkill) {
      return NextResponse.json(
        { error: 'Bu kategori için aynı isimde yetenek zaten mevcut' },
        { status: 409 }
      )
    }

    // Get next order index for this category
    const { data: maxOrderSkill } = await supabase
      .from('skills')
      .select('order_index')
      .eq('category', category.trim())
      .eq('user_id', session.user.id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextOrderIndex = (maxOrderSkill?.order_index || 0) + 1

    const skillData = {
      name: name.trim(),
      category: category.trim(),
      level,
      order_index: nextOrderIndex,
      user_id: session.user.id
    }

    const { data: skill, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single()

    if (error) {
      console.error('Skill creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ skill }, { status: 201 })

  } catch (error) {
    console.error('Skills POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Toplu sıralama güncelleme
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { skills } = body

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Skills array gereklidir' },
        { status: 400 }
      )
    }

    // Update order indexes
    const updates = skills.map((skill, index) => ({
      id: skill.id,
      order_index: index + 1
    }))

    // Batch update
    for (const update of updates) {
      await supabase
        .from('skills')
        .update({ order_index: update.order_index })
        .eq('id', update.id)
        .eq('user_id', session.user.id)
    }

    return NextResponse.json({
      message: 'Sıralama başarıyla güncellendi',
      updatedCount: updates.length
    })

  } catch (error) {
    console.error('Skills reorder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}