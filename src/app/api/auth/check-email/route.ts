import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { findUserByEmail as findInDb } from '@/lib/server/db'
import { findUserByEmail as findInStore } from '@/lib/auth/user-store'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = body?.email

    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400)
    }

    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return errorResponse('Invalid email address format', 422)
    }

    // 1. Check local server database & user store (instant synchronous response)
    const localUser = findInDb(cleanEmail) || findInStore(cleanEmail)
    if (localUser) {
      return successResponse({
        registered: true,
        message: 'This email is already registered. Please log in.',
      })
    }

    // 2. Check Supabase profiles table with quick 500ms timeout
    try {
      const supabaseQuery = (async () => {
        const supabase = await createClient()
        return await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', cleanEmail)
          .maybeSingle()
      })()

      const timeout = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 500))
      const res = await Promise.race([supabaseQuery, timeout])

      if (res?.data) {
        return successResponse({
          registered: true,
          message: 'This email is already registered. Please log in.',
        })
      }
    } catch {
      // Fallback if Supabase is unavailable in current environment
    }

    return successResponse({
      registered: false,
      message: 'Email is available',
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to verify email availability', 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return errorResponse('Email address parameter is required', 400)
    }

    const cleanEmail = email.trim().toLowerCase()
    const localUser = findInDb(cleanEmail) || findInStore(cleanEmail)
    if (localUser) {
      return successResponse({
        registered: true,
        message: 'This email is already registered. Please log in.',
      })
    }

    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (data) {
        return successResponse({
          registered: true,
          message: 'This email is already registered. Please log in.',
        })
      }
    } catch {
      // Fallback
    }

    return successResponse({
      registered: false,
      message: 'Email is available',
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to verify email', 500)
  }
}
