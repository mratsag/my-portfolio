'use client'
// src/app/admin/projects/components/ProjectForm.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  PhotoIcon, 
  LinkIcon, 
  CodeBracketIcon,
  EyeIcon,
  XMarkIcon,
  PlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import ImageUpload from './ImageUpload'
import RichTextEditor from '../../blog/components/RichTextEditor'
import { Project } from '@/lib/types'
import styles from '@/styles/admin/ProjectForm.module.css'

const projectSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(1, 'Açıklama gereklidir').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  content: z.string().min(1, 'Proje detayları gereklidir'),
  demo_url: z.string().refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)'
  }).optional().or(z.literal('')),
  github_url: z.string().refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)'
  }).optional().or(z.literal('')),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(['draft', 'published'])
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
}

const commonTechnologies = [
  // Frontend Frameworks & Libraries
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'SvelteKit', 'Nuxt.js',
  'Gatsby', 'Remix', 'Astro', 'Solid.js', 'Preact', 'Alpine.js',
  
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'Dart', 'R', 'MATLAB', 'Julia',
  'Perl', 'Lua', 'Haskell', 'Elixir', 'Clojure', 'F#', 'Objective-C',
  
  // Backend Frameworks
  'Node.js', 'Express', 'Nest.js', 'Fastify', 'Koa', 'Hapi', 'Adonis.js',
  'Django', 'Flask', 'FastAPI', 'Tornado', 'Bottle', 'CherryPy',
  'Spring Boot', 'Spring MVC', 'Spring Security', 'Micronaut', 'Quarkus',
  '.NET Core', '.NET Framework', 'ASP.NET', 'Blazor', 'SignalR',
  'Laravel', 'Symfony', 'CodeIgniter', 'CakePHP', 'Slim',
  'Ruby on Rails', 'Sinatra', 'Hanami', 'Grape',
  'Flask', 'Django REST Framework', 'FastAPI', 'Tornado',
  
  // Database Technologies
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'Oracle',
  'Redis', 'Cassandra', 'CouchDB', 'Neo4j', 'InfluxDB', 'Elasticsearch',
  'DynamoDB', 'Firebase Firestore', 'Supabase', 'PlanetScale', 'CockroachDB',
  'TimescaleDB', 'ArangoDB', 'RethinkDB', 'RavenDB',
  
  // Cloud & DevOps
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'DigitalOcean',
  'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly.io',
  'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI',
  'CircleCI', 'Travis CI', 'ArgoCD', 'Helm', 'Istio',
  
  // Frontend Styling & UI
  'HTML', 'CSS', 'Sass', 'SCSS', 'Less', 'Stylus', 'PostCSS',
  'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design', 'Chakra UI',
  'Mantine', 'NextUI', 'Radix UI', 'Headless UI', 'Framer Motion',
  'Styled Components', 'Emotion', 'CSS Modules', 'CSS-in-JS',
  'Bulma', 'Foundation', 'Semantic UI', 'UIKit', 'Pure CSS',
  
  // State Management & Data Fetching
  'Redux', 'Redux Toolkit', 'Zustand', 'Jotai', 'Recoil', 'XState',
  'Vuex', 'Pinia', 'NgRx', 'MobX', 'Apollo Client', 'React Query',
  'SWR', 'TanStack Query', 'Zustand', 'Valtio', 'Rematch',
  
  // Testing
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'Selenium', 'Puppeteer',
  'Testing Library', 'Mocha', 'Chai', 'Sinon', 'Jasmine', 'Karma',
  'Pytest', 'Unittest', 'Robot Framework', 'JUnit', 'TestNG',
  'NUnit', 'xUnit', 'PHPUnit', 'RSpec', 'Cucumber',
  
  // Build Tools & Bundlers
  'Webpack', 'Vite', 'Rollup', 'Parcel', 'esbuild', 'SWC',
  'Babel', 'TypeScript Compiler', 'Gulp', 'Grunt', 'Browserify',
  
  // Package Managers
  'npm', 'yarn', 'pnpm', 'bun', 'pip', 'poetry', 'conda',
  'Maven', 'Gradle', 'NuGet', 'Composer', 'Bundler', 'Cargo',
  
  // Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
  
  // Mobile Development
  'React Native', 'Flutter', 'Ionic', 'Cordova', 'PhoneGap',
  'Xamarin', 'NativeScript', 'Capacitor', 'Expo', 'Tauri',
  
  // Desktop Development
  'Electron', 'Tauri', 'NW.js', 'Qt', 'WPF', 'WinForms',
  'JavaFX', 'Swing', 'GTK', 'wxWidgets', 'Flutter Desktop',
  
  // AI & Machine Learning
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenAI API',
  'Hugging Face', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
  'Jupyter', 'Colab', 'MLflow', 'Weights & Biases', 'DVC',
  
  // Data Science & Analytics
  'R', 'MATLAB', 'SPSS', 'SAS', 'Tableau', 'Power BI', 'Looker',
  'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'dbt',
  
  // 3D & Graphics
  'Three.js', 'Babylon.js', 'PlayCanvas', 'Unity', 'Unreal Engine',
  'Blender', 'Maya', '3ds Max', 'Cinema 4D', 'Houdini',
  'WebGL', 'OpenGL', 'Vulkan', 'DirectX', 'Metal',
  
  // Game Development
  'Unity', 'Unreal Engine', 'Godot', 'Phaser', 'PixiJS',
  'Matter.js', 'Cannon.js', 'Ammo.js', 'Box2D', 'Chipmunk',
  
  // IoT & Hardware
  'Arduino', 'Raspberry Pi', 'ESP32', 'ESP8266', 'STM32',
  'MicroPython', 'CircuitPython', 'PlatformIO', 'Mbed',
  
  // Blockchain & Web3
  'Solidity', 'Web3.js', 'Ethers.js', 'Hardhat', 'Truffle',
  'OpenZeppelin', 'IPFS', 'Polygon', 'Ethereum', 'Bitcoin',
  
  // Real-time & Communication
  'Socket.io', 'WebSockets', 'SignalR', 'gRPC', 'GraphQL',
  'REST API', 'SOAP', 'WebRTC', 'PeerJS', 'SocketCluster',
  
  // Security
  'JWT', 'OAuth', 'OpenID Connect', 'SAML', 'CORS', 'CSP',
  'Helmet.js', 'bcrypt', 'argon2', 'Passport.js', 'Auth0',
  
  // Monitoring & Logging
  'Sentry', 'LogRocket', 'DataDog', 'New Relic', 'Grafana',
  'Prometheus', 'ELK Stack', 'Winston', 'Pino', 'Morgan',
  
  // Content Management
  'Strapi', 'Sanity', 'Contentful', 'Prismic', 'Ghost',
  'WordPress', 'Drupal', 'Joomla', 'Squarespace', 'Webflow',
  
  // E-commerce
  'Shopify', 'WooCommerce', 'Magento', 'PrestaShop', 'OpenCart',
  'Stripe', 'PayPal', 'Square', 'Adyen', 'Klarna',
  
  // GIS & Mapping
  'Leaflet', 'Mapbox', 'Google Maps', 'OpenLayers', 'D3.js',
  'QGIS', 'ArcGIS', 'PostGIS', 'GeoServer', 'CartoDB',
  
  // Audio & Video
  'Web Audio API', 'MediaRecorder', 'FFmpeg', 'GStreamer',
  'WebRTC', 'HLS', 'DASH', 'Vimeo API', 'YouTube API',
  
  // Documentation
  'Storybook', 'Docusaurus', 'VuePress', 'GitBook', 'ReadTheDocs',
  'Swagger', 'OpenAPI', 'JSDoc', 'TypeDoc', 'Sphinx',
  
  // Performance & Optimization
  'Lighthouse', 'WebPageTest', 'Bundle Analyzer', 'Core Web Vitals',
  'Service Workers', 'PWA', 'CDN', 'Edge Computing', 'Serverless',
  
  // Accessibility
  'ARIA', 'WCAG', 'axe-core', 'Lighthouse Accessibility',
  'Screen Readers', 'Keyboard Navigation', 'Color Contrast',
  
  // Internationalization
  'i18next', 'react-i18next', 'vue-i18n', 'ngx-translate',
  'Intl API', 'Moment.js', 'Day.js', 'date-fns', 'Luxon',
  
  // LIDAR & Point Cloud
  'Potree', 'Three.js Point Cloud', 'PCL (Point Cloud Library)',
  'Open3D', 'CloudCompare', 'PDAL', 'LAStools', 'Fusion 360',
  'MeshLab', 'Blender Point Cloud', 'Unity Point Cloud',
  'Unreal Engine Point Cloud', 'WebGL Point Cloud',
  'LIDAR Processing', 'Point Cloud Visualization', '3D Scanning',
  'Terrain Mapping', 'Building Information Modeling (BIM)',
  'Autodesk ReCap', 'Agisoft Metashape', 'Pix4D', 'DroneDeploy',
  'LiDAR Data Analysis', 'Point Cloud Registration', 'Mesh Generation',
  'Surface Reconstruction', 'Volume Calculation', 'Slope Analysis',
  'Flood Modeling', 'Forest Inventory', 'Urban Planning',
  'Archaeological Survey', 'Geological Mapping', 'Infrastructure Inspection'
]

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(project?.image_url || '')
  const [newTechnology, setNewTechnology] = useState('')
  const [showTechSuggestions, setShowTechSuggestions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      content: project?.content || '',
      demo_url: project?.demo_url || '',
      github_url: project?.github_url || '',
      technologies: project?.technologies || [],
      featured: project?.featured || false,
      status: project?.status || 'draft'
    }
  })

  const watchedTechnologies = watch('technologies')
  const watchedTitle = watch('title')
  const watchedDescription = watch('description')
  const watchedContent = watch('content')

  // image_url is handled separately from the form

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true)
    try {
      const url = project 
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects'
      
      const method = project ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image_url: imageUrl
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/projects')
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const addTechnology = (tech: string) => {
    if (tech && !watchedTechnologies.includes(tech)) {
      setValue('technologies', [...watchedTechnologies, tech])
      setNewTechnology('')
      setShowTechSuggestions(false)
    }
  }

  const removeTechnology = (tech: string) => {
    setValue('technologies', watchedTechnologies.filter(t => t !== tech))
  }

  const handleNewTechnologySubmit = () => {
    if (newTechnology.trim()) {
      addTechnology(newTechnology.trim())
    }
  }

  const filteredSuggestions = commonTechnologies.filter(
    tech => tech.toLowerCase().includes(newTechnology.toLowerCase()) && 
    !watchedTechnologies.includes(tech)
  ).slice(0, 15) // Daha fazla öneri göster

  return (
    <div className={styles.projectFormContainer}>
      <div className={styles.projectFormCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {project ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h2>
          <p className={styles.formSubtitle}>
            Proje bilgilerini ve detaylarını güncelleyin
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContent}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📝 Temel Bilgiler</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <DocumentTextIcon className="w-5 h-5" />
                Proje Başlığı *
              </label>
              <input
                {...register('title')}
                className={styles.inputField}
                placeholder="Örn: E-Ticaret Web Sitesi"
              />
              {errors.title && (
                <p className={styles.errorMessage}>{errors.title.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <DocumentTextIcon className="w-5 h-5" />
                Kısa Açıklama *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={`${styles.inputField} ${styles.textareaField}`}
                placeholder="Projenin kısa açıklaması..."
              />
              {errors.description && (
                <p className={styles.errorMessage}>{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Project Image */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🖼️ Proje Görseli</h3>
            <div className={styles.imageUploadSection}>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                className="image-upload-container"
              />
            </div>
          </div>

          {/* Rich Text Content */}
          <div className={styles.formSection}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={styles.sectionTitle}>📄 Proje Detayları *</h3>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 px-3 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                {showPreview ? (
                  <>
                    <DocumentTextIcon className="w-4 h-4 mr-1" />
                    Düzenle
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Önizle
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className={styles.previewSection}>
                <div dangerouslySetInnerHTML={{ __html: watchedContent }} />
              </div>
            ) : (
              <div className={styles.richTextSection}>
                <RichTextEditor
                  value={watchedContent}
                  onChange={(value) => setValue('content', value)}
                  placeholder="Proje detaylarını yazın... Teknolojiler, özellikler, zorluklar ve çözümler hakkında detaylı bilgi verin."
                />
              </div>
            )}
            {errors.content && (
              <p className={styles.errorMessage}>{errors.content.message}</p>
            )}
          </div>

          {/* URLs */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🔗 Proje Linkleri</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <LinkIcon className="w-5 h-5" />
                  Demo URL
                </label>
                <input
                  {...register('demo_url')}
                  type="url"
                  className={styles.inputField}
                  placeholder="https://example.com"
                />
                {errors.demo_url && (
                  <p className={styles.errorMessage}>{errors.demo_url.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <CodeBracketIcon className="w-5 h-5" />
                  GitHub URL
                </label>
                <input
                  {...register('github_url')}
                  type="url"
                  className={styles.inputField}
                  placeholder="https://github.com/username/repo"
                />
                {errors.github_url && (
                  <p className={styles.errorMessage}>{errors.github_url.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>⚡ Kullanılan Teknolojiler</h3>
            <div className={styles.technologySection}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                💡 300+ teknoloji arasından seçim yapabilirsiniz. Yazmaya başlayın ve kategorilere göre gruplandırılmış önerileri görün.
              </p>
              
              {/* Current Technologies */}
              {watchedTechnologies && watchedTechnologies.length > 0 && (
                <div className="mb-3">
                  <div className={styles.technologyTags}>
                    {watchedTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className={styles.technologyTag}
                      >
                        <CodeBracketIcon className="w-3 h-3 mr-1" />
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-white hover:text-red-200 transition-colors"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    📊 {watchedTechnologies.length} teknoloji seçildi
                  </p>
                </div>
              )}

              {/* Add Technology */}
              <div className="relative">
                <div className={styles.technologyInput}>
                  <input
                    type="text"
                    value={newTechnology}
                    onChange={(e) => {
                      setNewTechnology(e.target.value)
                      setShowTechSuggestions(e.target.value.length > 0)
                    }}
                    onBlur={() => setTimeout(() => setShowTechSuggestions(false), 200)}
                    className="flex-1"
                    placeholder="Teknoloji adı yazın..."
                  />
                  <button
                    type="button"
                    onClick={handleNewTechnologySubmit}
                    className={styles.addButton}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

              {/* Suggestions */}
              {showTechSuggestions && filteredSuggestions.length > 0 && (
                <div className={styles.suggestionsContainer}>
                  <div className={styles.suggestionsHeader}>
                    💡 {filteredSuggestions.length} teknoloji bulundu. Kategorilere göre gruplandırıldı:
                  </div>
                  
                  {/* Frontend & Languages */}
                  {filteredSuggestions.filter(tech => 
                    ['React', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'].includes(tech)
                  ).length > 0 && (
                    <div>
                      <div className={styles.categoryHeader}>
                        🌐 Frontend & Diller
                      </div>
                      {filteredSuggestions.filter(tech => 
                        ['React', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'].includes(tech)
                      ).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className={styles.suggestionItem}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Backend & Databases */}
                  {filteredSuggestions.filter(tech => 
                    ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'].includes(tech)
                  ).length > 0 && (
                    <div>
                      <div className={styles.categoryHeader}>
                        ⚙️ Backend & Veritabanları
                      </div>
                      {filteredSuggestions.filter(tech => 
                        ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'].includes(tech)
                      ).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className={styles.suggestionItem}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Cloud & DevOps */}
                  {filteredSuggestions.filter(tech => 
                    ['Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub', 'Kubernetes', 'Azure', 'Google Cloud'].includes(tech)
                  ).length > 0 && (
                    <div>
                      <div className={styles.categoryHeader}>
                        ☁️ Cloud & DevOps
                      </div>
                      {filteredSuggestions.filter(tech => 
                        ['Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub', 'Kubernetes', 'Azure', 'Google Cloud'].includes(tech)
                      ).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className={styles.suggestionItem}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* LIDAR & 3D */}
                  {filteredSuggestions.filter(tech => 
                    tech.toLowerCase().includes('lidar') || tech.toLowerCase().includes('point cloud') || 
                    tech.toLowerCase().includes('3d') || tech.toLowerCase().includes('potree') ||
                    tech.toLowerCase().includes('blender') || tech.toLowerCase().includes('unity')
                  ).length > 0 && (
                    <div>
                      <div className={styles.categoryHeader}>
                        🎯 LIDAR & 3D Teknolojileri
                      </div>
                      {filteredSuggestions.filter(tech => 
                        tech.toLowerCase().includes('lidar') || tech.toLowerCase().includes('point cloud') || 
                        tech.toLowerCase().includes('3d') || tech.toLowerCase().includes('potree') ||
                        tech.toLowerCase().includes('blender') || tech.toLowerCase().includes('unity')
                      ).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className={styles.suggestionItem}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Other Technologies */}
                  {filteredSuggestions.filter(tech => 
                    !['React', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
                      'Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
                      'Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub', 'Kubernetes', 'Azure', 'Google Cloud'].includes(tech) &&
                    !(tech.toLowerCase().includes('lidar') || tech.toLowerCase().includes('point cloud') || 
                      tech.toLowerCase().includes('3d') || tech.toLowerCase().includes('potree') ||
                      tech.toLowerCase().includes('blender') || tech.toLowerCase().includes('unity'))
                  ).length > 0 && (
                    <div>
                      <div className={styles.categoryHeader}>
                        🔧 Diğer Teknolojiler
                      </div>
                      {filteredSuggestions.filter(tech => 
                        !['React', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
                          'Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
                          'Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub', 'Kubernetes', 'Azure', 'Google Cloud'].includes(tech) &&
                        !(tech.toLowerCase().includes('lidar') || tech.toLowerCase().includes('point cloud') || 
                          tech.toLowerCase().includes('3d') || tech.toLowerCase().includes('potree') ||
                          tech.toLowerCase().includes('blender') || tech.toLowerCase().includes('unity'))
                      ).slice(0, 8).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className={styles.suggestionItem}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>⚙️ Proje Ayarları</h3>
            <div className={styles.settingsSection}>
              <div className={styles.checkboxGroup}>
                <input
                  {...register('featured')}
                  type="checkbox"
                  className={styles.checkboxInput}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Öne çıkan proje olarak göster
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Durum
                </label>
                <select
                  {...register('status')}
                  className={styles.selectField}
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayınla</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className={styles.loadingSpinner}></div>
                  Kaydediliyor...
                </div>
              ) : (
                project ? 'Güncelle' : 'Oluştur'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className={styles.helpSection}>
            <h3 className={styles.helpTitle}>
              💡 Proje Detayları İpuçları
            </h3>
            <ul className={styles.helpList}>
              <li>Projenin amacını ve çözdüğü problemi açıklayın</li>
              <li>Kullanılan teknolojileri ve neden seçildiğini belirtin</li>
              <li>Karşılaştığınız zorlukları ve çözümlerinizi paylaşın</li>
              <li>Projenin özelliklerini ve kullanıcı deneyimini anlatın</li>
              <li>Gelecek planları ve geliştirme fikirlerini ekleyin</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}