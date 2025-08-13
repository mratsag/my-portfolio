import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Session kontrolü
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dashboard istatistiklerini al
    const [
      projectsCount,
      experiencesCount,
      skillsCount,
      messagesCount,
      blogsCount
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true })
    ])

    // Son aktiviteleri al
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('id, title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentMessages } = await supabase
      .from('messages')
      .select('id, name, subject, created_at, read')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentBlogs } = await supabase
      .from('blogs')
      .select('id, title, created_at, published')
      .order('created_at', { ascending: false })
      .limit(3)

    // Bugünkü mesajları al
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    const { data: todayMessages } = await supabase
      .from('messages')
      .select('id, created_at')
      .ilike('created_at', `${todayString}%`)

    // Okunmamış mesajları al
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('read', false)

    // Dashboard verilerini döndür
    const dashboardData = {
      stats: {
        projects: projectsCount.count || 0,
        experiences: experiencesCount.count || 0,
        skills: skillsCount.count || 0,
        messages: messagesCount.count || 0,
        blogs: blogsCount.count || 0,
        todayMessages: todayMessages?.length || 0,
        unreadMessages: unreadMessages?.length || 0
      },
      recentActivities: {
        projects: recentProjects || [],
        messages: recentMessages || [],
        blogs: recentBlogs || []
      }
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 