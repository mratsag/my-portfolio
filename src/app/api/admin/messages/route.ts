// src/app/api/admin/messages/route.ts
import { createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Tüm mesajları getir
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
              // Server Component'ten çağrıldıysa ignore
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all' // all, read, unread
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`)
    }

    // Read status filter
    if (filter === 'read') {
      query = query.eq('read', true)
    } else if (filter === 'unread') {
      query = query.eq('read', false)
    }

    // Sorting
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending })

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: messages, error, count } = await query

    if (error) {
      console.error('Messages fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // İstatistikleri hesapla
    const { data: stats } = await supabase
      .from('messages')
      .select('read')

    const totalMessages = stats?.length || 0
    const unreadMessages = stats?.filter(m => !m.read).length || 0
    const readMessages = totalMessages - unreadMessages

    return NextResponse.json({
      messages: messages || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats: {
        total: totalMessages,
        read: readMessages,
        unread: unreadMessages
      }
    })

  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Toplu işlemler (mark as read/unread, delete multiple)
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
              // Server Component'ten çağrıldıysa ignore
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
    const { action, messageIds } = body

    if (!action || !messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'Action ve messageIds gereklidir' },
        { status: 400 }
      )
    }

    let result
    switch (action) {
      case 'markAsRead':
        result = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', messageIds)
        break

      case 'markAsUnread':
        result = await supabase
          .from('messages')
          .update({ read: false })
          .in('id', messageIds)
        break

      case 'delete':
        result = await supabase
          .from('messages')
          .delete()
          .in('id', messageIds)
        break

      default:
        return NextResponse.json(
          { error: 'Geçersiz action' },
          { status: 400 }
        )
    }

    if (result.error) {
      console.error('Bulk operation error:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: `${messageIds.length} mesaj başarıyla ${action === 'delete' ? 'silindi' : 'güncellendi'}`,
      affectedCount: messageIds.length
    })

  } catch (error) {
    console.error('Messages bulk operation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}