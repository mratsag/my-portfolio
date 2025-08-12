// src/app/api/contact/route.ts
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Yeni mesaj gönder (Public endpoint)
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Ad, email ve mesaj alanları zorunludur' }, 
        { status: 400 }
      )
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      )
    }

    // Uzunluk kontrolü
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Ad en fazla 100 karakter olabilir' },
        { status: 400 }
      )
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email en fazla 255 karakter olabilir' },
        { status: 400 }
      )
    }

    if (subject && subject.length > 200) {
      return NextResponse.json(
        { error: 'Konu en fazla 200 karakter olabilir' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Mesaj en fazla 2000 karakter olabilir' },
        { status: 400 }
      )
    }

    // Spam kontrolü - aynı email'den 5 dakikada 1'den fazla mesaj engelle
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const { data: recentMessages, error: checkError } = await supabase
      .from('messages')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .gte('created_at', fiveMinutesAgo)

    if (checkError) {
      console.error('Spam check error:', checkError)
    } else if (recentMessages && recentMessages.length > 0) {
      return NextResponse.json(
        { error: 'Çok fazla mesaj gönderdiniz. Lütfen 5 dakika bekleyiniz.' },
        { status: 429 }
      )
    }

    // Mesajı veritabanına kaydet
    const messageData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject ? subject.trim() : null,
      message: message.trim(),
      read: false,
      created_at: new Date().toISOString()
    }

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single()

    if (error) {
      console.error('Message creation error:', error)
      return NextResponse.json(
        { error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' }, 
        { status: 500 }
      )
    }



    return NextResponse.json({
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağım.',
      id: newMessage.id
    }, { status: 201 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, 
      { status: 500 }
    )
  }
}