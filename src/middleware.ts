import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// UUID ile gelen proje isteğini slug'a çevirir (varsa). Edge'de, stream başlamadan
// önce çalışır → gerçek HTTP 308 (meta-refresh değil). SEO için kritik: duplicate
// içerik yerine tek canonical URL. (blogs tablosunda slug kolonu yok → sadece projeler.)
async function lookupProjectSlug(id: string): Promise<string | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return null
  try {
    const res = await fetch(
      `${base}/rest/v1/projects?id=eq.${id}&select=slug&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    const rows = (await res.json()) as Array<{ slug?: string | null }>
    return rows?.[0]?.slug || null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Proje detay: /projects/{uuid} → /projects/{slug} (308 kalıcı yönlendirme)
  const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (projectMatch) {
    const idOrSlug = projectMatch[1]
    if (UUID_REGEX.test(idOrSlug)) {
      const slug = await lookupProjectSlug(idOrSlug)
      if (slug && slug !== idOrSlug) {
        return NextResponse.redirect(new URL(`/projects/${slug}`, request.url), 308)
      }
    }
    // slug isteği ya da slug yok → normal render (auth'a girme)
    return NextResponse.next()
  }

  // 2) Auth: yalnızca korumalı alanlarda getUser() çağır (public sayfaları yavaşlatma)
  const needsAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/admin')
  if (!needsAuth) return NextResponse.next()

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
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
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
    // Proje detay sayfaları (UUID → slug 308 yönlendirme)
    '/projects/:path*',
    // Admin routes
    '/admin/:path*',
    // Auth routes
    '/auth/:path*',
    // API routes that need auth
    '/api/admin/:path*',
  ],
}
