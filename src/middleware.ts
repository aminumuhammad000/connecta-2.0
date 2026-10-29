import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import {
  verifyAdminToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth/admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---------------------------------------------------------------------------
  // 1. ADMIN API ROUTE PROTECTION
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api/admin')) {
    // Allow public admin login route
    if (pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)
    const verification = await verifyAdminToken(adminCookie?.value)

    if (!verification.valid) {
      const response = NextResponse.json(
        {
          success: false,
          error:
            verification.reason === 'inactive_timeout'
              ? 'Admin session timed out after 2 hours of inactivity'
              : 'Admin authentication required',
          reason: verification.reason || 'unauthorized',
        },
        { status: 401 }
      )

      if (adminCookie) {
        response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
      }

      return response
    }

    return NextResponse.next()
  }

  // ---------------------------------------------------------------------------
  // 2. ADMIN PAGES ROUTE PROTECTION (/admin, /admin/verification, etc.)
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/admin')) {
    const isAdminLoginPage =
      pathname === '/admin/login' || pathname.startsWith('/admin/login/')

    const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)
    const verification = await verifyAdminToken(adminCookie?.value)

    // Case A: User is on the login page
    if (isAdminLoginPage) {
      // If already authenticated and not timed out, redirect to admin dashboard
      if (verification.valid) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // Case B: User is attempting to access protected admin pages without valid session
    if (!verification.valid) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      if (verification.reason === 'inactive_timeout') {
        loginUrl.searchParams.set('reason', 'inactivity')
      } else if (adminCookie) {
        loginUrl.searchParams.set('reason', 'expired')
      }

      const response = NextResponse.redirect(loginUrl)
      if (adminCookie) {
        response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
      }
      return response
    }
  }

  // ---------------------------------------------------------------------------
  // 3. REGULAR CLIENT & SUPABASE SESSION UPDATE
  // ---------------------------------------------------------------------------
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - brand (brand assets)
     * - images, png, svg, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
