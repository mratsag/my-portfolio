'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import styles from '@/styles/public/BlogSection.module.css'

interface BlogSectionProps {
  blogs?: Array<{
    id: string
    title: string
    excerpt?: string
    content?: string
    image_url?: string
    tags?: string[]
    author?: string
    published_at?: string
    slug?: string
    featured?: boolean
    created_at?: string
  }>
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }



  // Etiketleri çıkar
  const categories = ['all', ...new Set(blogs?.flatMap(b => b.tags || []).filter(Boolean) || [])]

  // Filtreleme
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           blog.tags?.includes(selectedCategory)

    return matchesSearch && matchesCategory
  }) || []

  return (
    <div className={styles.blog} data-theme={theme}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Blog</h1>
            <p className={styles.subtitle}>
              Yazılım, teknoloji ve deneyimlerim hakkında yazılarım
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Blog yazısı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.categoryFilter}>
              <Tag className={styles.filterIcon} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tüm Kategoriler' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.results}>
            {filteredBlogs.length} yazı bulundu
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          {filteredBlogs.length > 0 ? (
            <div className={styles.blogGrid}>
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className={styles.blogCard}>
                  <div className={styles.blogImage}>
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>
                          {blog.title?.charAt(0) || 'B'}
                        </span>
                      </div>
                    )}
                    {blog.featured && (
                      <div className={styles.featuredBadge}>
                        Öne Çıkan
                      </div>
                    )}
                  </div>

                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <div className={styles.blogDate}>
                        <Calendar className={styles.metaIcon} />
                        <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString('tr-TR') : 'Tarih yok'}</span>
                      </div>
                      {blog.author && (
                        <div className={styles.blogAuthor}>
                          <User className={styles.metaIcon} />
                          <span>{blog.author}</span>
                        </div>
                      )}
                    </div>

                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    
                    {blog.excerpt && (
                      <p className={styles.blogExcerpt}>
                        {blog.excerpt}
                      </p>
                    )}

                    {blog.tags && blog.tags.length > 0 && (
                      <div className={styles.blogCategory}>
                        <Tag className={styles.categoryIcon} />
                        <span>{blog.tags.join(', ')}</span>
                      </div>
                    )}

                    <div className={styles.blogFooter}>
                      <Link href={`/blog/${blog.id}`} className={styles.readMore}>
                        <span>Devamını Oku</span>
                        <ArrowRight className={styles.arrowIcon} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>📝</div>
              <h3 className={styles.noResultsTitle}>Blog yazısı bulunamadı</h3>
              <p className={styles.noResultsText}>
                Arama kriterlerinize uygun blog yazısı bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 