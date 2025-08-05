// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            try {
              if (typeof document !== 'undefined') {
                return document.cookie.split(';').map(cookie => {
                  const [name, value] = cookie.trim().split('=')
                  return { name, value: value || '' }
                }).filter(cookie => cookie.name && cookie.name.trim() !== '')
              }
              return []
            } catch (error) {
              console.warn('Failed to get cookies:', error)
              return []
            }
          },
          setAll(cookiesToSet) {
            try {
              if (typeof document !== 'undefined') {
                cookiesToSet.forEach(({ name, value, options }) => {
                  let cookieString = `${name}=${value}`
                  if (options) {
                    if (options.path) cookieString += `; path=${options.path}`
                    if (options.domain) cookieString += `; domain=${options.domain}`
                    if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
                    if (options.secure) cookieString += '; secure'
                    if (options.httpOnly) cookieString += '; httpOnly'
                    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`
                  }
                  document.cookie = cookieString
                })
              }
            } catch (error) {
              console.warn('Failed to set cookies:', error)
            }
          },
        },
      }
    )
  }
  return supabaseClient
}

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!