// src/app/api/admin/messages/[id]/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tek mesaj getir
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

    const { data: message, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      }
      console.error('Message fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mesajı okundu olarak işaretle (eğer okunmamışsa)
    if (!message.read) {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id)
      
      message.read = true
    }

    return NextResponse.json({ message })

  } catch (error) {
    console.error('Message GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mesaj durumunu güncelle
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
    const { read } = body

    // Validation
    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'read field must be boolean' },
        { status: 400 }
      )
    }

    // Check if message exists
    const { data: existingMessage, error: fetchError } = await supabase
      .from('messages')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Update message
    const { data: message, error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Message update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message,
      result: `Mesaj ${read ? 'okundu' : 'okunmadı'} olarak işaretlendi`
    })

  } catch (error) {
    console.error('Message PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Mesaj sil
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

    // Check if message exists
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('id, name, email')
      .eq('id', id)
      .single()

    if (fetchError || !message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Delete message
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Message delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Mesaj başarıyla silindi',
      deletedMessage: {
        id: id,
        name: message.name,
        email: message.email
      }
    })

  } catch (error) {
    console.error('Message DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}