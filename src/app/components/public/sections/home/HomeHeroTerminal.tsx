'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'

type HeroProfile = {
  full_name?: string
  title?: string
  location?: string
  avatar_url?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function HomeHeroTerminal({
  profile,
  projectCount,
  skillCount,
}: {
  profile?: HeroProfile
  projectCount: number
  skillCount: number
}) {
  const reduce = useReducedMotion()
  const [avatarError, setAvatarError] = useState(false)

  const fullName = profile?.full_name || 'Murat Sağ'
  const role = profile?.title || 'Yazılım Geliştirici'
  const location = (profile?.location || 'Karabük, Türkiye').split(',')[0]

  const enter = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: d },
        }

  return (
    <section className={styles.hero}>
      <span aria-hidden className={styles.watermark}>
        01
      </span>

      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* SOL — metin */}
          <div>
            <motion.p {...enter(0)} className={styles.init}>
              {'// system.init'}
            </motion.p>

            <motion.p {...enter(0.05)} className={styles.meta}>
              <Link href="/projects" className={styles.metaLink}>
                {projectCount}+ proje
              </Link>
              {'  ·  '}
              {skillCount} teknoloji
              {'  ·  '}
              {location}
            </motion.p>

            <motion.h1 {...enter(0.1)} className={styles.title}>
              Merhaba, ben
              <br />
              {fullName}
            </motion.h1>

            <motion.p {...enter(0.16)} className={styles.role}>
              {role}
            </motion.p>

            <motion.p {...enter(0.22)} className={styles.bio}>
              Fikirleri çalışan ürünlere dönüştürüyorum. Web, mobil ve backend tarafında uçtan uca
              geliştirme yapıyorum.
            </motion.p>

            <motion.div {...enter(0.3)} className={styles.ctas}>
              <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                İletişime geç
              </Link>
              <Link href="/projects" className={`${styles.btn} ${styles.btnOutline}`}>
                Projeler
              </Link>
            </motion.div>
          </div>

          {/* SAĞ — büyük foto */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.97 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 },
                })}
          >
            <div className={styles.photo}>
              {profile?.avatar_url && !avatarError ? (
                <Image
                  src={profile.avatar_url}
                  alt={fullName}
                  fill
                  sizes="(max-width: 1024px) 440px, 45vw"
                  onError={() => setAvatarError(true)}
                  priority
                />
              ) : (
                <span className={styles.photoFallback}>{initials(fullName)}</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollHintText}>{'0x01 // section.about'}</span>
        <ArrowDown size={16} className={styles.bounce} />
      </div>
    </section>
  )
}
