import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Session kontrolü yap ama hata durumunda sessizce devam et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      // Session yoksa 0 döndür, hata verme
      return NextResponse.json({ unreadCount: 0 })
    }

    // Get unread message count
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)

    if (error) {
      console.error('Error fetching unread messages count:', error)
      return NextResponse.json({ unreadCount: 0 })
    }

    return NextResponse.json({ 
      unreadCount: count || 0 
    })

  } catch (error) {
    console.error('Error in messages stats API:', error)
    return NextResponse.json({ unreadCount: 0 })
  }
} 