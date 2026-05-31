import { Mail, Github, Linkedin } from 'lucide-react'
import styles from '@/styles/home/Home.module.css'

export function HomeContact({
  email,
  github,
  linkedin,
}: {
  email: string
  github?: string
  linkedin?: string
}) {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <p className={styles.marker}>
          <span className={styles.markerIndex}>06</span>
          {'  '}
          <span className={styles.markerComment}>{'// section.contact'}</span>
        </p>

        <p className={styles.availability}>
          <span className={styles.dot} />
          şu an yeni projelere açığım
        </p>

        <h2 className={styles.contactTitle}>
          Birlikte <span className={styles.accent}>çalışalım mı?</span>
        </h2>
        <p className={styles.contactSub}>
          Web, mobil veya yazılım projen için aklında bir şey varsa yaz — birlikte konuşalım.
        </p>

        <div className={styles.ctas}>
          <a href={`mailto:${email}`} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Mail size={16} />
            {email}
          </a>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              <Github size={16} />
              GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
