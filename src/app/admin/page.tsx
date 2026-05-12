// src/app/admin/page.tsx

import Link from 'next/link'
import {
  Code2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Plus,
  FileText,
  TrendingUp,
  Eye,
  ArrowRight,
} from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import styles from '@/styles/components/AdminDashboardAurora.module.css'

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString()

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
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', firstOfMonth),
    supabase
      .from('experiences')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', firstOfMonth),
    supabase
      .from('skills')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', firstOfMonth),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', firstOfMonth),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday),
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
    supabase.from('blogs').select('views'),
  ])

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
      change: monthProjects.count || 0,
      icon: <Code2 size={18} />,
    },
    {
      name: 'Deneyimler',
      value: experiencesCount.count || 0,
      change: monthExperiences.count || 0,
      icon: <Briefcase size={18} />,
    },
    {
      name: 'Yetenekler',
      value: skillsCount.count || 0,
      change: monthSkills.count || 0,
      icon: <GraduationCap size={18} />,
    },
    {
      name: 'Okunmamış Mesaj',
      value: unreadMessagesCount,
      change: messagesThisMonth,
      icon: <MessageSquare size={18} />,
    },
  ]

  const quickActions = [
    {
      name: 'Yeni Proje',
      desc: 'Proje ekle ve yayınla',
      href: '/admin/projects/new',
      icon: <Code2 size={18} />,
    },
    {
      name: 'Yeni Yazı',
      desc: 'Blog yazısı oluştur',
      href: '/admin/blog/new',
      icon: <FileText size={18} />,
    },
    {
      name: 'Yeni Deneyim',
      desc: 'İş deneyimi ekle',
      href: '/admin/experiences/new',
      icon: <Briefcase size={18} />,
    },
    {
      name: 'Yetenekler',
      desc: 'Yetenekleri yönet',
      href: '/admin/skills',
      icon: <GraduationCap size={18} />,
    },
  ]

  const formatRelative = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000)
    if (days === 0) return 'Bugün'
    if (days === 1) return '1 gün önce'
    if (days < 7) return `${days} gün önce`
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`
    return `${Math.floor(days / 30)} ay önce`
  }

  return (
    <div>
      {/* Welcome */}
      <div className={styles.welcome}>
        <p className={styles.welcomeLabel}>Admin / Dashboard</p>
        <h1 className={styles.welcomeTitle}>Hoş geldin, Murat.</h1>
        <p className={styles.welcomeSub}>
          Portfolio yönetim panelindesin. Bugün ne yapmak istiyorsun?
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.name} className={styles.statCard}>
            <div className={styles.statHeader}>
              <p className={styles.statTitle}>{stat.name}</p>
              <div className={styles.statIcon}>{stat.icon}</div>
            </div>
            <p className={styles.statValue}>{stat.value.toLocaleString()}</p>
            <div className={`${styles.statChange} ${stat.change > 0 ? styles.statChangePositive : ''}`}>
              <TrendingUp size={12} />
              <span>+{stat.change} bu ay</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className={styles.contentGrid}>
        {/* Recent activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Son aktiviteler</h2>
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#71717A',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Projeler
              </p>
              <Link href="/admin/projects" className={styles.cardLink}>
                Tümünü gör <ArrowRight size={12} />
              </Link>
            </div>
            <div className={styles.activityList}>
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/projects/${p.id}`}
                    className={styles.activityItem}
                  >
                    <span className={styles.activityDot} />
                    <div className={styles.activityContent}>
                      <p className={styles.activityTitle}>{p.title}</p>
                      <p className={styles.activityMeta}>{formatRelative(p.created_at)}</p>
                    </div>
                    <span
                      className={`${styles.activityBadge} ${p.status === 'published' ? styles.activityBadgePublished : styles.activityBadgeDraft}`}
                    >
                      {p.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </Link>
                ))
              ) : (
                <p className={styles.emptyText}>Henüz proje yok</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#71717A',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Son Mesajlar
              </p>
              <Link href="/admin/messages" className={styles.cardLink}>
                Tümünü gör <ArrowRight size={12} />
              </Link>
            </div>
            <div className={styles.activityList}>
              {recentMessages && recentMessages.length > 0 ? (
                recentMessages.map((m) => (
                  <Link
                    key={m.id}
                    href={`/admin/messages/${m.id}`}
                    className={styles.activityItem}
                  >
                    <span
                      className={`${styles.activityDot} ${m.read ? styles.activityDotMuted : ''}`}
                    />
                    <div className={styles.activityContent}>
                      <p className={styles.activityTitle}>{m.name}</p>
                      <p className={styles.activityMeta}>
                        {m.subject} · {formatRelative(m.created_at)}
                      </p>
                    </div>
                    {!m.read && (
                      <span className={`${styles.activityBadge} ${styles.activityBadgeNew}`}>
                        Yeni
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <p className={styles.emptyText}>Henüz mesaj yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Hızlı işlemler</h2>
          </div>
          <div className={styles.quickActions}>
            {quickActions.map((a) => (
              <Link key={a.name} href={a.href} className={styles.quickAction}>
                <div className={styles.quickActionIcon}>{a.icon}</div>
                <div className={styles.quickActionBody}>
                  <p className={styles.quickActionTitle}>{a.name}</p>
                  <p className={styles.quickActionDesc}>{a.desc}</p>
                </div>
                <Plus size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className={styles.widgetsGrid}>
        {/* Site özet */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Site özeti</h2>
            <Eye size={16} style={{ color: '#71717A' }} />
          </div>
          <div className={styles.widgetStat}>
            <span className={styles.widgetStatLabel}>Toplam blog görüntülenme</span>
            <span className={styles.widgetStatValue}>{totalBlogViews.toLocaleString()}</span>
          </div>
          <div className={styles.widgetStat}>
            <span className={styles.widgetStatLabel}>Bugün gelen mesaj</span>
            <span className={styles.widgetStatValue}>{todayMessagesCount}</span>
          </div>
        </div>

        {/* Recent blogs */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Son blog yazıları</h2>
            <Link href="/admin/blog" className={styles.cardLink}>
              Tümünü gör <ArrowRight size={12} />
            </Link>
          </div>
          <div className={styles.blogList}>
            {recentBlogs && recentBlogs.length > 0 ? (
              recentBlogs.map((b) => (
                <div key={b.id} className={styles.blogRow}>
                  <span
                    className={`${styles.activityDot} ${b.published ? styles.activityDotGreen : ''}`}
                    style={!b.published ? { background: '#F59E0B' } : undefined}
                  />
                  <div className={styles.blogContent}>
                    <p className={styles.blogTitle}>{b.title}</p>
                    <p className={styles.blogDate}>{formatRelative(b.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>Henüz yazı yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
