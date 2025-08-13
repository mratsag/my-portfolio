import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get unread message count
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)

    if (error) {
      console.error('Error fetching unread messages count:', error)
      return NextResponse.json({ error: 'Failed to fetch unread messages count' }, { status: 500 })
    }

    return NextResponse.json({ 
      unreadCount: count || 0 
    })

  } catch (error) {
    console.error('Error in messages stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 