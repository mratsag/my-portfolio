import type { ComponentType } from 'react'
import {
  SiKubernetes,
  SiDocker,
  SiHetzner,
  SiPostgresql,
  SiMysql,
  SiNextdotjs,
  SiSpringboot,
  SiApachekafka,
  SiGit,
  SiDotnet,
  SiGo,
  SiVercel,
  SiPython,
  SiC,
  SiCplusplus,
  SiDart,
  SiFlutter,
  SiSupabase,
  SiBlender,
  SiRender,
  SiReact,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { Hash, Database, Cloud } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'

type IconComp = ComponentType<{ size?: number; className?: string }>

// Hero altı şeritte görünecek teknolojiler (sıra önemli).
const TECHS = [
  'Java',
  'Kubernetes',
  'Docker',
  'Hetzner',
  'SQL',
  'PostgreSQL',
  'MySQL',
  'Next.js',
  'Spring Boot',
  'Kafka',
  'Azure',
  'Git',
  'C#',
  'Go',
  'Vercel',
  'Python',
  'C',
  'C++',
  'Dart',
  'Flutter',
  'Supabase',
  'Cloud Compare',
  'Blender',
  'Render',
  'React.js',
]

const ICON_MAP: Record<string, IconComp> = {
  java: FaJava,
  kubernetes: SiKubernetes,
  docker: SiDocker,
  hetzner: SiHetzner,
  sql: Database,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  next: SiNextdotjs,
  'next.js': SiNextdotjs,
  'spring boot': SiSpringboot,
  kafka: SiApachekafka,
  azure: Cloud,
  git: SiGit,
  'c#': SiDotnet,
  go: SiGo,
  vercel: SiVercel,
  python: SiPython,
  c: SiC,
  'c++': SiCplusplus,
  dart: SiDart,
  flutter: SiFlutter,
  supabase: SiSupabase,
  blender: SiBlender,
  render: SiRender,
  react: SiReact,
  'react.js': SiReact,
}

function iconFor(name: string): IconComp {
  return ICON_MAP[name.trim().toLowerCase()] || Hash
}

function Chip({ name }: { name: string }) {
  const Icon = iconFor(name)
  return (
    <span className={styles.chip}>
      <Icon size={24} className={styles.chipIcon} />
      {name}
    </span>
  )
}

/** Hero altı tek-sıra, büyük, monokrom logolu, kayan teknoloji şeridi. */
export function HomeSkills() {
  return (
    <div className={styles.band}>
      <div className={styles.marquee} aria-label="Teknolojiler">
        <div className={styles.track} data-marquee>
          {[...TECHS, ...TECHS].map((t, i) => (
            <Chip key={`${t}-${i}`} name={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
