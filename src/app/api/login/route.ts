import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { findUserByEmail, upsertUser, ServerUserProfile } from '@/lib/server/db'
import { findUserByEmail as findInStore } from '@/lib/auth/user-store'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email and password are required', 422)
    }

    const cleanEmail = email.toLowerCase().trim()
    let existing: ServerUserProfile | null = findUserByEmail(cleanEmail)

    // Check secondary user-store if not found in db cache
    if (!existing) {
      const stored = findInStore(cleanEmail)
      if (stored) {
        existing = {
          id: stored.id,
          fullName: stored.fullName,
          firstName: stored.firstName,
          lastName: stored.lastName,
          email: stored.email,
          phone: stored.phone || '',
          whatsapp: stored.whatsapp || stored.phone || '',
          password: stored.password,
          role: stored.role === 'provider' ? 'provider' : 'customer',
          activeRole: stored.role === 'provider' ? 'provider' : 'customer',
          accountStatus: 'active',
          country: stored.country || 'Nigeria',
          city: stored.city || 'Lagos',
          currency: stored.currency || 'NGN',
          avatarUrl: stored.avatarUrl,
          headline: stored.headline,
          bio: stored.bio,
          skills: stored.skills,
          createdAt: stored.createdAt,
          updatedAt: stored.createdAt,
        }
        upsertUser(existing)
      }
    }

    // Check Supabase profiles if not found locally
    if (!existing) {
      try {
        const supabase = await createClient()
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle()

        if (data) {
          const role = data.roles?.includes('provider') ? 'provider' : 'customer'
          existing = {
            id: data.id,
            fullName: data.full_name || 'Connecta Member',
            firstName: data.first_name || 'Connecta',
            lastName: data.last_name || 'Member',
            email: data.email,
            phone: data.phone || '',
            whatsapp: data.whatsapp || data.phone || '',
            role,
            activeRole: role,
            accountStatus: data.account_status || 'active',
            country: data.country || 'Nigeria',
            city: data.city || 'Lagos',
            currency: data.currency || 'NGN',
            avatarUrl: data.avatar_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          }
          upsertUser(existing)
        }
      } catch {
        // Supabase query fallback
      }
    }

    // If user does NOT have an account, prompt them to create one
    if (!existing) {
      return errorResponse(
        'No account found with this email address. Please create an account to get started.',
        404,
        {
          code: 'ACCOUNT_NOT_FOUND',
          requiresRegistration: true,
          email: cleanEmail,
        }
      )
    }

    // Check if account has been suspended by Admin
    if (existing.accountStatus === 'suspended') {
      return errorResponse(
        'Your account has been temporarily suspended by Connecta Trust & Safety. Please contact support@myconnecta.ng or your account officer for review.',
        403,
        {
          code: 'ACCOUNT_SUSPENDED',
          isSuspended: true,
          email: cleanEmail,
        }
      )
    }

    // Check password
    if (existing.password && existing.password !== password) {
      return errorResponse('Incorrect password. Please verify and try again.', 401)
    }

    const user = existing

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
