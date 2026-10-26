import { NextRequest } from 'next/server'
import { createAndSendOtp } from '@/lib/auth/otp-store'
import { successResponse, errorResponse } from '@/lib/api/response'
import { findUserByEmail as findInDb } from '@/lib/server/db'
import { findUserByEmail as findInStore } from '@/lib/auth/user-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, intent } = body

    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400)
    }

    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return errorResponse('Invalid email address format', 422)
    }

    // Check if user is registering but already has an account
    if (intent === 'registration') {
      const existing = findInDb(cleanEmail) || findInStore(cleanEmail)
      if (existing) {
        return errorResponse('This email is already registered. Please log in.', 409)
      }
    }

    const result = await createAndSendOtp(cleanEmail)
    return successResponse({
      message: result.message,
      devCode: result.devCode,
    }, 200)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to send verification code', 400)
  }
}
