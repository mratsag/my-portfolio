// src/lib/types.ts

export interface Profile {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    bio?: string
    title?: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
    instagram?: string
    phone?: string
    created_at: string
    updated_at: string
  }
  
  export interface Project {
    id: string
    title: string
    slug: string
    description: string
    content?: string
    image_url?: string
    demo_url?: string
    github_url?: string
    technologies: string[]
    featured: boolean
    status: 'draft' | 'published'
    created_at: string
    updated_at: string
    user_id: string
  }
  
  export interface Experience {
    id: string
    title: string
    company: string
    location?: string
    description: string
    start_date: string
    end_date?: string
    current: boolean
    order_index: number
    created_at: string
    updated_at: string
    user_id: string
  }
  
  export interface Skill {
    id: string
    name: string
    category: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    order_index: number
    created_at: string
    updated_at: string
    user_id: string
  }
  
  export interface Blog {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    image_url?: string
    author?: string
    published: boolean
    reading_time?: number
    views?: number
    tags: string[]
    created_at: string
    updated_at: string
    user_id: string
  }
  
  export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    image_url?: string
    published: boolean
    reading_time?: number
    tags: string[]
    created_at: string
    updated_at: string
    user_id: string
  }
  
  export interface Message {
    id: string
    name: string
    email: string
    subject?: string
    message: string
    read: boolean
    created_at: string
  }
  
  export interface DashboardStats {
    projects: number
    experiences: number
    skills: number
    messages: number
    unreadMessages: number
  }
  
  export interface FormState<T = unknown> {
    loading: boolean
    error: string | null
    success: boolean
    data: T | null
  }