import { NextRequest } from 'next/server'
import { createAndSendOtp } from '@/lib/auth/otp-store'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400)
    }

    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return errorResponse('Invalid email address format', 422)
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
