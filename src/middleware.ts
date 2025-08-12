import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If there's no user and the user is trying to access a protected route,
    // redirect them to the login page
    if (!user && request.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If there's a user and they're trying to access the login page,
    // redirect them to the admin dashboard
    if (user && request.nextUrl.pathname === '/auth/login') {
      const redirectUrl = new URL('/admin', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // Fallback response in case of error
    return NextResponse.next({
      request,
    })
  }
}

export const config = {
  matcher: [
    // Admin routes
    '/admin/:path*',
    // Auth routes
    '/auth/:path*',
    // API routes that need auth
    '/api/admin/:path*',
  ],
}

