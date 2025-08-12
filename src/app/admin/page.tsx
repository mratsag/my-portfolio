// src/app/admin/page.tsx

import { createSupabaseServerClient } from '@/lib/supabase-server'
import StatsCard from './dashboard/components/StatsCard'
import RecentActivity from './dashboard/components/RecentActivity'
import QuickActions from './dashboard/components/QuickActions'

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()
  
  // İstatistikleri al
  const [projectsCount, experiencesCount, skillsCount, messagesCount] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
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

  // Blog yazılarını al
  const { data: recentBlogs } = await supabase
    .from('blogs')
    .select('id, title, created_at, published')
    .order('created_at', { ascending: false })
    .limit(3)

  // Bugünkü mesajları al - daha basit yaklaşım
  const today = new Date()
  const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD formatı
  
  const { data: todayMessages } = await supabase
    .from('messages')
    .select('id, created_at')
    .ilike('created_at', `${todayString}%`)

  // Debug için
  console.log('Bugünkü mesaj sayısı:', todayMessages?.length || 0)
  console.log('Bugünün tarihi:', todayString)

  // Okunmamış mesajları al
  const { data: unreadMessages } = await supabase
    .from('messages')
    .select('id')
    .eq('read', false)

  const stats = [
    {
      name: 'Toplam Projeler',
      value: projectsCount.count || 0,
      change: '+12%',
      changeType: 'increase' as const,
      icon: 'projects' as const
    },
    {
      name: 'Deneyimler',
      value: experiencesCount.count || 0,
      change: '+2',
      changeType: 'increase' as const,
      icon: 'experiences' as const
    },
    {
      name: 'Yetenekler',
      value: skillsCount.count || 0,
      change: '+5',
      changeType: 'increase' as const,
      icon: 'skills' as const
    },
    {
      name: 'Okunmamış Mesajlar',
      value: unreadMessages?.length || 0,
      change: `${todayMessages?.length || 0} yeni`,
      changeType: 'increase' as const,
      icon: 'messages' as const
    }
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Hoş geldin, Murat! 👋</h1>
        <p>
          Portfolio yönetim panelindesin. Bugün ne yapmak istiyorsun?
        </p>
      </div>



      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity - 2/3 width */}
        <div>
          <RecentActivity 
            recentProjects={recentProjects || []}
            recentMessages={recentMessages || []}
          />
        </div>

        {/* Quick Actions - 1/3 width */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Additional Dashboard Widgets */}
      <div className="dashboard-widgets">
        {/* Site Performance */}
        <div className="widget-card">
          <h3 className="widget-title">
            Bugünkü Özet
          </h3>
          <div className="widget-content">
            <div className="widget-stat">
              <span className="widget-stat-label">Site ziyareti</span>
              <span className="widget-stat-value">
                {Math.floor((projectsCount.count || 0) * 3 + (experiencesCount.count || 0) * 2 + (skillsCount.count || 0) * 1)}
              </span>
            </div>
            <div className="widget-stat">
              <span className="widget-stat-label">Yeni mesaj</span>
              <span className="widget-stat-value">
                {todayMessages?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="widget-card">
          <h3 className="widget-title">
            Son Blog Yazıları
          </h3>
          <div className="widget-content">
            {recentBlogs && recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => {
                const daysAgo = Math.floor((Date.now() - new Date(blog.created_at).getTime()) / (1000 * 60 * 60 * 24))
                const getTimeText = (days: number) => {
                  if (days === 0) return 'Bugün'
                  if (days === 1) return '1 gün önce'
                  if (days < 7) return `${days} gün önce`
                  if (days < 30) return `${Math.floor(days / 7)} hafta önce`
                  return `${Math.floor(days / 30)} ay önce`
                }
                
                return (
                  <div key={blog.id} className="blog-item">
                    <div className={`blog-status ${blog.published ? 'green' : 'yellow'}`}></div>
                    <div className="blog-content">
                      <p className="blog-title">{blog.title}</p>
                      <p className="blog-date">{getTimeText(daysAgo)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="blog-item">
                <div className="blog-content">
                  <p className="blog-title">Henüz blog yazısı yok</p>
                  <p className="blog-date">İlk yazınızı ekleyin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}