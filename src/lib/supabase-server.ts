// src/lib/supabase-server.ts
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerClient = () => createSupabaseServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      async getAll() {
        try {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        } catch (error) {
          console.warn('Failed to get cookies:', error)
          return []
        }
      },
      async setAll(cookiesToSet: Array<{ name: string; value: string; options?: { [key: string]: unknown } }>) {
        try {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch (cookieError) {
              console.warn(`Failed to set cookie ${name}:`, cookieError)
            }
          })
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.warn('Failed to set cookies:', error)
        }
      },
    },
  }
) 