import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { findUserByEmail, readDatabase, upsertUser, ServerUserProfile } from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email and password are required', 422)
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = findUserByEmail(cleanEmail)

    let user: ServerUserProfile

    if (existing) {
      if (existing.password && existing.password !== password) {
        return errorResponse('Incorrect password. Please verify and try again.', 401)
      }
      user = existing
    } else {
      // If user doesn't exist yet, register them as an active user
      const db = readDatabase()
      const role = cleanEmail.includes('specialist') || cleanEmail.includes('pro') ? 'provider' : 'customer'
      const parts = cleanEmail.split('@')[0].split('.')
      const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Connecta'
      const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Member'

      user = {
        id: crypto.randomUUID(),
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email: cleanEmail,
        phone: '+2348000000000',
        password,
        role,
        activeRole: role,
        accountStatus: 'active',
        country: 'Nigeria',
        city: 'Kano',
        currency: 'NGN',
        headline: role === 'provider' ? 'Certified Specialist Pro' : 'Hiring Client Workspace',
        companyName: role === 'customer' ? `${firstName} Holdings` : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      upsertUser(user)
    }

    const response = successResponse({
      message: 'Authentication successful. Redirecting to your workspace...',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        activeRole: user.activeRole,
        city: user.city,
      },
    })

    // Set persistent session cookies
    response.cookies.set('connecta_session', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    })

    response.cookies.set('connecta_role', user.activeRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    })

    return response
  } catch (err: any) {
    return errorResponse(err.message || 'Login failed', 500)
  }
}
