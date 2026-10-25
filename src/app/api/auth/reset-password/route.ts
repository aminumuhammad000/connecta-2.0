import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { isEmailVerifiedForReset, consumeVerifiedEmailForReset, verifyOtpCode } from '@/lib/auth/otp-store'
import { updateUserPassword, findUserByEmail } from '@/lib/server/db'
import { findUserByEmail as findInStore, saveUser as saveInStore } from '@/lib/auth/user-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword, code } = body

    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400)
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return errorResponse('New password must be at least 8 characters long', 422)
    }

    const cleanEmail = email.trim().toLowerCase()

    // Verify either prior OTP verification or inline OTP code
    let verified = isEmailVerifiedForReset(cleanEmail)
    if (!verified && code) {
      const result = verifyOtpCode(cleanEmail, code)
      verified = result.success
    }

    if (!verified) {
      return errorResponse('Verification code required or has expired. Please verify your email first.', 401)
    }

    // Check if user exists
    const user = findUserByEmail(cleanEmail)
    if (!user) {
      return errorResponse('No account registered with this email address.', 404)
    }

    // Update password in master server database
    const updated = updateUserPassword(cleanEmail, newPassword)
    if (!updated) {
      return errorResponse('Failed to update password. Please try again.', 500)
    }

    // Also update in secondary user-store
    try {
      const stored = findInStore(cleanEmail)
      if (stored) {
        stored.password = newPassword
        saveInStore(stored)
      }
    } catch {
      // Ignore secondary store error
    }

    // Consume OTP verification
    consumeVerifiedEmailForReset(cleanEmail)

    return successResponse({
      message: 'Password successfully updated! You can now sign in with your new credentials.',
      email: cleanEmail,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Password reset failed', 500)
  }
}
