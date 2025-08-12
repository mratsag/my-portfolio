import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { currentPassword, newPassword } = await request.json()

    // Check if password change is requested
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gereklidir' }, { status: 400 })
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword
    })

    if (verifyError) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json({ error: 'Şifre güncellenirken hata oluştu' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Şifre başarıyla güncellendi' 
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 