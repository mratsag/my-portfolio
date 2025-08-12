// src/app/api/admin/profile/route.ts
import { createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Profil bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Profil bilgilerini al
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profil yoksa oluştur
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
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
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    if (session.user.email && !emailRegex.test(session.user.email)) {
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

    // Profili güncelle veya oluştur
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        email: session.user.email || '',
        ...updateData,
        created_at: new Date().toISOString() // Sadece yeni kayıtlar için
      })
      .select()
      .single()

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