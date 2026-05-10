// src/app/admin/page.tsx

import { createSupabaseServerClient } from '@/lib/supabase-server'
import StatsCard from './dashboard/components/StatsCard'
import RecentActivity from './dashboard/components/RecentActivity'
import QuickActions from './dashboard/components/QuickActions'

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()

  // Bu ayın ilk günü ve bugünün başlangıcı (ISO)
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // Toplam ve bu ay eklenen sayıları paralel al
  const [
    projectsCount,
    experiencesCount,
    skillsCount,
    monthProjects,
    monthExperiences,
    monthSkills,
    monthMessages,
    todayMessages,
    unreadMessages,
    blogsForViews,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
    supabase.from('experiences').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
    supabase.from('skills').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
    supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
    supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', startOfToday),
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
    supabase.from('blogs').select('views'),
  ])

  // Son aktiviteler
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

  // Toplam blog görüntülenme — tüm blog.views toplamı
  const totalBlogViews = (blogsForViews.data ?? []).reduce(
    (sum, b: { views?: number | null }) => sum + (b.views ?? 0),
    0
  )

  const todayMessagesCount = todayMessages.count || 0
  const unreadMessagesCount = unreadMessages.count || 0
  const messagesThisMonth = monthMessages.count || 0

  const stats = [
    {
      name: 'Toplam Projeler',
      value: projectsCount.count || 0,
      change: `+${monthProjects.count || 0}`,
      changeType: 'increase' as const,
      icon: 'projects' as const
    },
    {
      name: 'Deneyimler',
      value: experiencesCount.count || 0,
      change: `+${monthExperiences.count || 0}`,
      changeType: 'increase' as const,
      icon: 'experiences' as const
    },
    {
      name: 'Yetenekler',
      value: skillsCount.count || 0,
      change: `+${monthSkills.count || 0}`,
      changeType: 'increase' as const,
      icon: 'skills' as const
    },
    {
      name: 'Okunmamış Mesajlar',
      value: unreadMessagesCount,
      change: `+${messagesThisMonth}`,
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
        {/* Site Özeti — gerçek verilerden */}
        <div className="widget-card">
          <h3 className="widget-title">
            Site Özeti
          </h3>
          <div className="widget-content">
            <div className="widget-stat">
              <span className="widget-stat-label">Toplam blog görüntülenme</span>
              <span className="widget-stat-value">
                {totalBlogViews.toLocaleString()}
              </span>
            </div>
            <div className="widget-stat">
              <span className="widget-stat-label">Bugün gelen mesaj</span>
              <span className="widget-stat-value">
                {todayMessagesCount}
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
