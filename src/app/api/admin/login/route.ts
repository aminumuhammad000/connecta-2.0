import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateAdmin,
  createAdminSessionPayload,
  signAdminToken,
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  ADMIN_INACTIVITY_LIMIT_MS,
} from '@/lib/auth/admin-auth'
import { findUserByEmail as findInDatabase } from '@/lib/server/db'
import { findUserByEmail as findInStore, saveUser } from '@/lib/auth/user-store'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const adminEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    let hasConnectaAccount = Boolean(
      findInDatabase(adminEmail) || findInStore(adminEmail)
    )

    if (!hasConnectaAccount) {
      try {
        const supabase = await createClient()
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', adminEmail)
          .maybeSingle()
        hasConnectaAccount = Boolean(data)
      } catch {
        // Local stores remain the account lookup fallback when Supabase is unavailable.
      }
    }

    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'admin@connecta.ng').trim().toLowerCase()

    // Ensure configured administrator account is seeded in user-store
    if (!hasConnectaAccount && adminEmail === expectedAdminEmail) {
      saveUser({
        id: 'adm-001',
        fullName: 'Malam Aminu Danbatta',
        firstName: 'Malam Aminu',
        lastName: 'Danbatta',
        email: adminEmail,
        phone: '+2348030000001',
        whatsapp: '+2348030000001',
        password: process.env.ADMIN_PASSWORD || 'Connecta@Admin2026!',
        role: 'admin',
        country: 'Nigeria',
        city: 'Kano',
        currency: 'NGN',
        avatarUrl: '/brand/svg/connecta-icon.svg',
        businessName: 'Connecta Kano Administration',
        headline: 'Lead Platform Administrator & Escrow Supervisor',
        bio: 'Official administrator account for Connecta platform governance, trade artisan verification, and escrow administration.',
        createdAt: '2026-01-01T00:00:00.000Z',
        welcomeSparks: 500,
      })
      hasConnectaAccount = true
    }

    if (!hasConnectaAccount) {
      return NextResponse.json(
        {
          success: false,
          requiresRegistration: true,
          error: 'Create a Connecta account with this administrator email before accessing the admin portal.',
        },
        { status: 403 }
      )
    }

    const authResult = await authenticateAdmin(adminEmail, password)

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Invalid administrator credentials' },
        { status: 401 }
      )
    }

    const sessionPayload = createAdminSessionPayload(authResult.user)
    const token = await signAdminToken(sessionPayload)

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role,
      },
      session: {
        expiresInSeconds: Math.floor(ADMIN_INACTIVITY_LIMIT_MS / 1000), // 7200 seconds (2 hours)
        lastActiveAt: sessionPayload.lastActiveAt,
      },
    })

    const cookieOptions = getAdminCookieOptions(process.env.NODE_ENV === 'production')
    response.cookies.set(ADMIN_COOKIE_NAME, token, cookieOptions)

    return response
  } catch (err: unknown) {
    console.error('[Admin Login Error]:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error
          ? err.message
          : 'An unexpected error occurred during admin authentication',
      },
      { status: 500 }
    )
  }
}
