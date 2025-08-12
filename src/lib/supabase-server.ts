// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = () => createServerClient(
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
      setAll(cookiesToSet) {
        // Cookie setting is handled by middleware
        // This is only called in Server Components where we can't set cookies
        console.warn('Cookie setting attempted in Server Component - handled by middleware')
      },
    },
  }
) 