import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { verifyGoogleToken } from '@/lib/auth/google'
import { findUserByEmail, saveUser, type StoredUser } from '@/lib/auth/user-store'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { findUserById, getOrCreateWallet, upsertUser } from '@/lib/server/db'

function syncToDashboardDb(u: StoredUser) {
  if (!findUserById(u.id)) {
    const role = u.role === 'provider' ? 'provider' : 'customer'
    const now = new Date().toISOString()
    upsertUser({
      id: u.id,
      fullName: u.fullName,
      firstName: u.firstName || u.fullName.split(' ')[0] || 'Connecta',
      lastName: u.lastName || 'Member',
      email: u.email,
      phone: u.phone || '',
      whatsapp: u.whatsapp || u.phone || '',
      role,
      activeRole: role,
      accountStatus: 'active',
      country: u.country || 'Nigeria',
      city: u.city || 'Lagos',
      currency: u.currency || 'NGN',
      avatarUrl: u.avatarUrl || null,
      headline: u.headline,
      createdAt: u.createdAt || now,
      updatedAt: now,
    })
  }
  getOrCreateWallet(u.id, u.role === 'provider' ? 10 : 25, u.currency || 'NGN')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential, role = 'client' } = body

    if (!credential) {
      return errorResponse('Google credential token is required', 400)
    }

    const payload = await verifyGoogleToken(credential)
    const cleanEmail = payload.email.trim().toLowerCase()
    const userRole: 'provider' | 'customer' = role === 'provider' ? 'provider' : 'customer'

    // 1. Check if user already exists in persistent store
    const user = findUserByEmail(cleanEmail)

    if (user) {
      syncToDashboardDb(user)
      const response = successResponse(
        {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          city: user.city,
          avatarUrl: user.avatarUrl || payload.picture,
          isNewUser: false,
          message: `Welcome back, ${user.firstName || user.fullName}!`,
        },
        200
      )

      response.cookies.set('connecta_session', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
        sameSite: 'lax',
      })
      response.cookies.set('connecta_role', user.role, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
        sameSite: 'lax',
      })

      return response
    }

    // 2. New user registering via Google
    const newUserId = randomUUID()
    const firstName = payload.given_name || payload.name.split(' ')[0] || 'Connecta'
    const lastName = payload.family_name || payload.name.split(' ').slice(1).join(' ') || 'Member'
    const fullName = payload.name || `${firstName} ${lastName}`.trim()

    const newUser: StoredUser = {
      id: newUserId,
      fullName,
      firstName,
      lastName,
      email: cleanEmail,
      phone: '',
      whatsapp: '',
      role: userRole,
      country: 'Nigeria',
      city: 'Lagos',
      currency: 'NGN',
      avatarUrl: payload.picture,
      createdAt: new Date().toISOString(),
      welcomeSparks: userRole === 'provider' ? 10 : 25,
      headline: userRole === 'provider' ? 'Verified Specialist' : 'Hiring Client',
    }

    saveUser(newUser)
    syncToDashboardDb(newUser)

    // Synchronize to Supabase if available
    try {
      const supabase = await createClient()
      await supabase.from('profiles').insert({
        id: newUserId,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        roles: [userRole],
        account_status: 'active',
        onboarding_status: 'active',
        country: 'Nigeria',
        country_code: 'NG',
        currency: 'NGN',
        city: 'Lagos',
        avatar_url: payload.picture,
        created_at: new Date().toISOString(),
      })
    } catch {
      // Supabase sync fallback
    }

    const response = successResponse(
      {
        id: newUserId,
        fullName,
        email: cleanEmail,
        role: userRole,
        avatarUrl: payload.picture,
        isNewUser: true,
        message: `Welcome to Connecta, ${firstName}! Your account has been initialized with Google.`,
      },
      201
    )

    response.cookies.set('connecta_session', newUserId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    })
    response.cookies.set('connecta_role', userRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    })

    return response
  } catch (err: any) {
    return errorResponse(err.message || 'Google authentication failed', 500)
  }
}
