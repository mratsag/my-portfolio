// src/app/api/admin/profile/route.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Profil bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Profil bilgilerini al
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profil yoksa oluştur
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            email: '',
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) {
          console.error('Profile creation error:', createError)
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }

        return NextResponse.json({ profile: newProfile })
      }
      
      console.error('Profile fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Profil bilgilerini güncelle
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const {
      full_name,
      bio,
      title,
      location,
      website,
      linkedin,
      github,
      instagram,
      phone,
      avatar_url
    } = body

    // Validation
    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ad Soyad gereklidir' }, 
        { status: 400 }
      )
    }

    // URL validasyonu
    const urlFields = { website, linkedin, github, instagram }
    for (const [field, url] of Object.entries(urlFields)) {
      if (url && url.trim() !== '') {
        try {
          new URL(url)
        } catch {
          return NextResponse.json(
            { error: `${field} için geçerli bir URL giriniz` },
            { status: 400 }
          )
        }
      }
    }

    // E-posta validasyonu (basit)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (body.email && !emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      )
    }

    const updateData = {
      full_name: full_name.trim(),
      bio: bio?.trim() || null,
      title: title?.trim() || null,
      location: location?.trim() || null,
      website: website?.trim() || null,
      linkedin: linkedin?.trim() || null,
      github: github?.trim() || null,
      instagram: instagram?.trim() || null,
      phone: phone?.trim() || null,
      avatar_url: avatar_url?.trim() || null,
      updated_at: new Date().toISOString()
    }

    // Önce mevcut profili bul
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Profile fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    let profile
    let error

    if (existingProfile) {
      // Mevcut profili güncelle
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', existingProfile.id)
        .select()
        .single()

      profile = updatedProfile
      error = updateError
    } else {
      // Yeni profil oluştur
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          email: body.email || '',
          ...updateData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      profile = newProfile
      error = createError
    }

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      profile,
      message: 'Profil başarıyla güncellendi'
    })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}