'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, MousePointer2 } from 'lucide-react'

// WebGL sahnesi yalnızca istemcide, lazy yüklenir (SSR yok → blocking yok).
const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

const ROLES = ['Software Developer', 'Full-Stack Developer', 'Mobile Developer', 'Bilgisayar Mühendisi']

type HeroProfile = {
  full_name?: string
  bio?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
}

export function HomeHeroCinematic({
  profile,
  currentCompany,
}: {
  profile?: HeroProfile
  currentCompany?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [roleIdx, setRoleIdx] = useState(0)
  const [time, setTime] = useState('')

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  const fullName = profile?.full_name || 'Murat Sağ'
  const [firstName, ...rest] = fullName.split(' ')
  const lastName = rest.join(' ')
  const email = profile?.email || 'murat@muratsag.com'
  const location = profile?.location || 'Karabük, Türkiye'
  const bio =
    profile?.bio ||
    'Web, mobil ve yazılım çözümleri geliştiriyorum. Temiz kod, iyi tasarım ve ölçülebilir sonuçlara önem veririm.'

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((v) => (v + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const f = () =>
      setTime(
        new Intl.DateTimeFormat('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Istanbul',
        }).format(new Date()),
      )
    f()
    const id = setInterval(f, 30000)
    return () => clearInterval(id)
  }, [])

  const enter = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: d },
        }

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[#070708] text-white">
      {/* 3D sahne — reduced-motion'da statik (tek kare), aksi halde animasyonlu */}
      <motion.div
        style={reduce ? undefined : { scale: sceneScale }}
        className="absolute inset-0 lg:left-[28%]"
      >
        <Scene3D animated={!reduce} />
      </motion.div>

      {/* okunabilirlik için gradient maskeler */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070708] via-[#070708]/85 to-transparent lg:via-[#070708]/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070708] to-transparent"
      />

      {/* içerik — pointer-events-none: boş alanlardan 3D obje sürüklenebilir kalır */}
      <motion.div
        style={reduce ? undefined : { y: yText, opacity }}
        className="pointer-events-none relative mx-auto flex min-h-[100svh] w-full max-w-[75rem] flex-col justify-center px-6 py-28"
      >
        {/* meta satırı */}
        <motion.div {...enter(0)} className="mb-10 flex items-center gap-4 font-mono text-xs text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {currentCompany ? `@ ${currentCompany}` : 'Yeni projelere açık'}
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <MapPin size={12} /> {location}
            {time && ` · ${time}`}
          </span>
        </motion.div>

        <motion.p {...enter(0.05)} className="mb-4 font-mono text-sm text-accent">
          {'// merhaba, ben'}
        </motion.p>

        <motion.h1
          {...enter(0.1)}
          className="font-semibold leading-[0.9] tracking-tight text-[clamp(3rem,10vw,7.5rem)]"
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <span className="text-accent">{lastName}</span>
            </>
          )}
        </motion.h1>

        <motion.div
          {...enter(0.18)}
          className="mt-6 flex h-7 items-center font-mono text-base text-zinc-400 sm:text-lg"
        >
          <span className="mr-2 text-accent">{'>'}</span>
          {reduce ? (
            <span>{ROLES[roleIdx]}</span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {ROLES[roleIdx]}
              </motion.span>
            </AnimatePresence>
          )}
        </motion.div>

        <motion.p {...enter(0.26)} className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
          {bio}
        </motion.p>

        <motion.div {...enter(0.34)} className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            İletişime geç <ArrowUpRight size={18} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 font-medium text-white transition-colors hover:bg-white/10"
          >
            Projeleri gör
          </Link>
          <div className="ml-1 flex items-center gap-1">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <Github size={18} />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <Linkedin size={18} />
              </a>
            )}
            <a
              href={`mailto:${email}`}
              aria-label="E-posta"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <Mail size={18} />
            </a>
          </div>
        </motion.div>

        {!reduce && (
          <motion.div
            {...enter(0.5)}
            className="mt-12 inline-flex items-center gap-2 font-mono text-xs text-zinc-500"
          >
            <MousePointer2 size={13} /> obje ile oyna · sürükle
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
