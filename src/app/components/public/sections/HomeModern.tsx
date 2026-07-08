import type { Skill, Experience } from '@/lib/types'
import styles from '@/styles/home/Home.module.css'
import { HomeHeroTerminal } from './home/HomeHeroTerminal'
import { HomeAbout } from './home/HomeAbout'
import { HomeCapabilities } from './home/HomeCapabilities'
import { HomeWork } from './home/HomeWork'
import { HomeSkills } from './home/HomeSkills'
import { HomeWriting } from './home/HomeWriting'
import { HomeContact } from './home/HomeContact'

interface WorkProject {
  id: string
  title: string
  slug?: string | null
  description: string
  image_url?: string | null
  technologies?: string[] | null
  created_at: string
}

interface WritingPost {
  id: string
  title: string
  slug?: string | null
  excerpt: string
  tags?: string[] | null
  reading_time?: number | null
  created_at: string
}

interface HomeModernProps {
  profile?: {
    full_name?: string
    title?: string
    bio?: string
    email?: string
    location?: string
    github?: string
    linkedin?: string
    avatar_url?: string
  }
  skills: Skill[]
  experiences: Experience[]
  projectCount: number
  blogCount: number
  projects: WorkProject[]
  posts: WritingPost[]
}

/**
 * Ana sayfa — codedgar-tarzı. Tüm CSS izole: src/styles/home/Home.module.css
 * (Tailwind utility'leri yerine modül; renkler token'larla → dark mode korunur.)
 */
export default function HomeModern({
  profile,
  skills,
  experiences,
  projectCount,
  blogCount,
  projects,
  posts,
}: HomeModernProps) {
  const email = profile?.email || 'murat@muratsag.com'

  const stats = [
    { value: `${projectCount}+`, label: 'Proje', detail: 'tamamlanmış iş' },
    { value: `${skills.length}`, label: 'Teknoloji', detail: 'aktif kullandığım' },
    { value: `${experiences.length}`, label: 'Deneyim', detail: 'iş / staj' },
    { value: `${blogCount}`, label: 'Yazı', detail: 'blogda' },
  ]

  return (
    <main className={styles.page}>
      <HomeHeroTerminal profile={profile} projectCount={projectCount} skillCount={skills.length} />
      <HomeSkills />
      <HomeAbout profile={profile} stats={stats} />
      <HomeCapabilities />
      <HomeWork projects={projects} />
      <HomeWriting posts={posts} />
      <HomeContact email={email} github={profile?.github} linkedin={profile?.linkedin} />
    </main>
  )
}
