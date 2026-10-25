import { NextRequest } from 'next/server'
import { verifyOtpCode } from '@/lib/auth/otp-store'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400)
    }

    if (!code || typeof code !== 'string') {
      return errorResponse('Verification code is required', 400)
    }

    const cleanCode = code.trim()
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      return errorResponse('Verification code must be exactly 6 digits', 422)
    }

    const verification = verifyOtpCode(email, cleanCode)

    if (!verification.success) {
      return errorResponse(verification.error || 'Invalid code', 400)
    }

    return successResponse({
      verified: true,
      email: email.trim().toLowerCase(),
      verifiedAt: new Date().toISOString(),
      message: 'Email address verified successfully.',
    }, 200)
  } catch (err: any) {
    return errorResponse(err.message || 'Verification failed', 500)
  }
}
