'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Calendar, MapPin, GraduationCap, Award, Code, Database, Globe } from 'lucide-react'
import styles from '@/styles/public/AboutSection.module.css'

interface AboutSectionProps {
  profile?: {
    full_name?: string
    title?: string
    bio?: string
    email?: string
    location?: string
    avatar_url?: string
    github?: string
    linkedin?: string
    website?: string
  }
  experiences?: Array<{
    id: string
    title: string
    company: string
    location?: string
    start_date: string
    end_date?: string
    description?: string
    technologies?: string[]
  }> | null
  skills?: Array<{
    id: string
    name: string
    level: string
    category?: string
  }> | null
  education?: Array<{
    id: string
    institution: string
    school?: string
    degree: string
    field: string
    start_date: string
    end_date?: string
    description?: string
  }> | null
}

export default function AboutSection({ profile, experiences, skills, education }: AboutSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Profil fotoğrafı URL'sine timestamp ekleyerek cache'i bypass et
  const getAvatarUrl = (url?: string) => {
    if (!url) return undefined
    const timestamp = Date.now()
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}t=${timestamp}`
  }

  if (!mounted) {
    return null
  }

  const skillCategories = {
    'Frontend': skills?.filter(skill => skill.category === 'frontend') || [],
    'Backend': skills?.filter(skill => skill.category === 'backend') || [],
    'Database': skills?.filter(skill => skill.category === 'database') || [],
    'DevOps': skills?.filter(skill => skill.category === 'devops') || [],
    'Other': skills?.filter(skill => !skill.category || skill.category === 'other') || []
  }

  return (
    <div className={styles.about} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.avatarSection}>
              {profile?.avatar_url ? (
                <img
                  src={getAvatarUrl(profile.avatar_url)}
                  alt={profile.full_name || 'Profile'}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span className={styles.avatarText}>
                    {(profile?.full_name || 'M').charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className={styles.heroText}>
              <h1 className={styles.title}>
                {profile?.full_name || 'Murat Sağ'}
              </h1>
              <h2 className={styles.subtitle}>
                {profile?.title || 'Software Developer & Computer Engineering Student'}
              </h2>
              <p className={styles.description}>
                {profile?.bio || 'Java, Python, C, Dart ve C# gibi programlama dillerinde deneyim sahibi, React.js ve Spring Boot teknolojileriyle projeler geliştiren bir yazılım geliştirici.'}
              </p>
              
              <div className={styles.info}>
                {profile?.location && (
                  <div className={styles.infoItem}>
                    <MapPin className={styles.infoIcon} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className={styles.infoItem}>
                    <Calendar className={styles.infoIcon} />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className={styles.tabsSection}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
              onClick={() => setActiveTab('about')}
            >
              Hakkımda
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'experience' ? styles.active : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Deneyim
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Yetenekler
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'education' ? styles.active : ''}`}
              onClick={() => setActiveTab('education')}
            >
              Eğitim
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className={styles.aboutContent}>
                <div className={styles.bioSection}>
                  <h3 className={styles.sectionTitle}>Hakkımda</h3>
                  <p className={styles.bioText}>
                    {profile?.bio || 'Merhaba! Ben Murat Sağ, yazılım geliştirme konusunda tutkulu bir bilgisayar mühendisliği öğrencisiyim. Modern web teknolojileri ve mobil uygulama geliştirme alanlarında deneyim sahibiyim.'}
                  </p>
                  <p className={styles.bioText}>
                    React.js, Next.js, TypeScript gibi frontend teknolojileri ile Spring Boot, Node.js gibi backend teknolojilerinde projeler geliştiriyorum. Ayrıca mobil uygulama geliştirme konusunda da deneyimim bulunuyor.
                  </p>
                </div>

                <div className={styles.statsSection}>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{experiences?.length || 0}</div>
                    <div className={styles.statLabel}>Deneyim</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{skills?.length || 0}</div>
                    <div className={styles.statLabel}>Yetenek</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{education?.length || 0}</div>
                    <div className={styles.statLabel}>Eğitim</div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className={styles.experienceContent}>
                <h3 className={styles.sectionTitle}>Deneyim</h3>
                <div className={styles.timeline}>
                  {experiences?.map((experience, index) => (
                    <div key={experience.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot}></div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <h4 className={styles.timelineTitle}>{experience.title}</h4>
                          <span className={styles.timelineCompany}>{experience.company}</span>
                        </div>
                        <div className={styles.timelinePeriod}>
                          {new Date(experience.start_date).toLocaleDateString('tr-TR')} - 
                          {experience.end_date ? new Date(experience.end_date).toLocaleDateString('tr-TR') : 'Devam ediyor'}
                        </div>
                        <p className={styles.timelineDescription}>
                          {experience.description}
                        </p>
                        {experience.technologies && (
                          <div className={styles.timelineTechnologies}>
                            {experience.technologies.map((tech: string, techIndex: number) => (
                              <span key={techIndex} className={styles.techTag}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className={styles.skillsContent}>
                <h3 className={styles.sectionTitle}>Yetenekler</h3>
                <div className={styles.skillsGrid}>
                  {Object.entries(skillCategories).map(([category, categorySkills]) => (
                    <div key={category} className={styles.skillCategory}>
                      <h4 className={styles.categoryTitle}>{category}</h4>
                      <div className={styles.skillsList}>
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className={styles.skillItem}>
                            <div className={styles.skillInfo}>
                              <span className={styles.skillName}>{skill.name}</span>
                              <span className={`${styles.skillLevel} ${styles[`level-${skill.level}`]}`}>
                                {skill.level === 'expert' ? 'Uzman' : 
                                 skill.level === 'advanced' ? 'İleri' :
                                 skill.level === 'intermediate' ? 'Orta' : 'Başlangıç'}
                              </span>
                            </div>
                            <div className={styles.skillBar}>
                              <div 
                                className={styles.skillProgress} 
                                style={{ width: `${skill.level === 'expert' ? 100 : 
                                                   skill.level === 'advanced' ? 80 :
                                                   skill.level === 'intermediate' ? 60 : 40}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className={styles.educationContent}>
                <h3 className={styles.sectionTitle}>Eğitim</h3>
                <div className={styles.educationList}>
                  {education?.map((edu) => (
                    <div key={edu.id} className={styles.educationItem}>
                      <div className={styles.educationIcon}>
                        <GraduationCap className={styles.graduationIcon} />
                      </div>
                      <div className={styles.educationContent}>
                        <h4 className={styles.educationTitle}>{edu.degree}</h4>
                        <p className={styles.educationSchool}>{edu.school}</p>
                        <p className={styles.educationPeriod}>
                          {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Devam ediyor'}
                        </p>
                        {edu.description && (
                          <p className={styles.educationDescription}>{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 