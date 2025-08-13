import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta formatı' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Mesajı veritabanına kaydet
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          read: false
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Mesaj kaydedilirken hata oluştu' },
        { status: 500 }
      )
    }



    return NextResponse.json(
      { 
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.',
        id: data.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 