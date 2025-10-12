import { NextResponse, type NextRequest } from 'next/server'
import { betterFetch } from '@better-fetch/fetch'

/**
 * Next.js Middleware
 * Protects admin routes and handles authentication
 *
 * Best practices:
 * - Runs on Edge Runtime (fast)
 * - Checks session for protected routes
 * - Redirects to login if unauthorized
 * - Validates admin role for /admin routes
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  const publicRoutes = ['/login', '/signup', '/api/auth']
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    try {
      // Fetch session using Better Auth
      const { data: session } = await betterFetch<{
        user: {
          id: string
          email: string
          name: string
          role: string
        }
      }>('/api/auth/get-session', {
        baseURL: request.nextUrl.origin,
        headers: {
          // Forward cookies to the API route
          cookie: request.headers.get('cookie') || '',
        },
      })

      // No session - redirect to login
      if (!session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Check if user is admin
      if (session.user.role !== 'ADMIN') {
        // User is authenticated but not admin
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
      }

      // User is authenticated and admin - allow access
      return NextResponse.next()
    } catch (error) {
      // Error checking session - redirect to login
      console.error('Middleware auth error:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

/**
 * Matcher configuration
 * Defines which routes this middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
