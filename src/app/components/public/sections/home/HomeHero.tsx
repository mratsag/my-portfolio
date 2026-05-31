'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui'

type HeroProfile = {
  full_name?: string
  bio?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
  avatar_url?: string
}

const ROLES = ['Software Developer', 'Full-Stack Developer', 'Mobile Developer', 'Bilgisayar Mühendisi']

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function HomeHero({ profile, currentCompany }: { profile?: HeroProfile; currentCompany?: string }) {
  const reduce = useReducedMotion()
  const [roleIdx, setRoleIdx] = useState(0)
  const [time, setTime] = useState('')
  const [avatarError, setAvatarError] = useState(false)

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
    const fmt = () =>
      setTime(
        new Intl.DateTimeFormat('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Istanbul',
        }).format(new Date()),
      )
    fmt()
    const id = setInterval(fmt, 30000)
    return () => clearInterval(id)
  }, [])

  const entrance = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
        }

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* ince grid arka plan dokusu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at top, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[75rem] px-6 pb-20 pt-28 sm:pt-32">
        {/* üst meta satırı */}
        <motion.div
          {...entrance(0)}
          className="mb-12 flex items-center justify-between font-mono text-xs text-muted"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {currentCompany ? `@ ${currentCompany}` : 'Yeni projelere açık'}
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <MapPin size={12} /> {location}
            {time && ` · ${time}`}
          </span>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* SOL — tipografi */}
          <div>
            <motion.p {...entrance(0.05)} className="mb-4 font-mono text-sm text-accent">
              {'// merhaba, ben'}
            </motion.p>

            <motion.h1
              {...entrance(0.1)}
              className="font-semibold leading-[0.92] tracking-tight text-ink text-[clamp(2.75rem,9vw,6.5rem)]"
            >
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="text-accent">{lastName}</span>
                </>
              )}
            </motion.h1>

            {/* rol rotator */}
            <motion.div
              {...entrance(0.18)}
              className="mt-6 flex h-7 items-center font-mono text-base text-muted sm:text-lg"
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

            <motion.p {...entrance(0.26)} className="mt-6 max-w-md text-base leading-relaxed text-muted">
              {bio}
            </motion.p>

            <motion.div {...entrance(0.34)} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/contact" size="lg">
                İletişime geç <ArrowUpRight size={18} />
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                Projeleri gör
              </Button>
              <div className="ml-1 flex items-center gap-1">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2"
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                <a
                  href={`mailto:${email}`}
                  aria-label="E-posta"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2"
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* SAĞ — portre (mono caption + canlı saat) */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.94 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 },
                })}
            className="hidden lg:block"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-card border border-line bg-surface-2">
              {profile?.avatar_url && !avatarError ? (
                <Image
                  src={profile.avatar_url}
                  alt={fullName}
                  fill
                  sizes="320px"
                  className="object-cover"
                  onError={() => setAvatarError(true)}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-semibold text-muted">
                  {initials(fullName)}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-surface/80 px-4 py-2.5 font-mono text-xs text-muted backdrop-blur">
                <span>{location.split(',')[0]}</span>
                <span>{time || '—'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
