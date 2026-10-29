import { NextRequest, NextResponse } from 'next/server'
import {
  verifyAdminToken,
  signAdminToken,
  ADMIN_COOKIE_NAME,
  ADMIN_INACTIVITY_LIMIT_MS,
  getAdminCookieOptions,
} from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  const token = cookie?.value

  const verification = await verifyAdminToken(token)

  if (!verification.valid || !verification.payload) {
    return NextResponse.json(
      {
        authenticated: false,
        reason: verification.reason || 'unauthorized',
        message:
          verification.reason === 'inactive_timeout'
            ? 'Admin session timed out after 2 hours of inactivity'
            : 'Admin authentication required',
      },
      { status: 401 }
    )
  }

  const now = Date.now()
  const inactiveDuration = now - verification.payload.lastActiveAt
  const remainingInactivityMs = Math.max(0, ADMIN_INACTIVITY_LIMIT_MS - inactiveDuration)
  const remainingSeconds = Math.floor(remainingInactivityMs / 1000)

  return NextResponse.json({
    authenticated: true,
    user: {
      id: verification.payload.adminId,
      email: verification.payload.email,
      name: verification.payload.name,
      role: verification.payload.role,
    },
    session: {
      lastActiveAt: verification.payload.lastActiveAt,
      remainingInactivitySeconds: remainingSeconds,
      maxInactivitySeconds: Math.floor(ADMIN_INACTIVITY_LIMIT_MS / 1000), // 7200 seconds
    },
  })
}

// Heartbeat / Touch endpoint to renew activity timestamp when admin is active
export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  const token = cookie?.value

  const verification = await verifyAdminToken(token)

  if (!verification.valid || !verification.payload) {
    const res = NextResponse.json(
      {
        success: false,
        reason: verification.reason || 'unauthorized',
        message: 'Admin session is invalid or expired. Please log in again.',
      },
      { status: 401 }
    )
    res.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
    return res
  }

  // Update lastActiveAt to now
  const now = Date.now()
  const updatedPayload = {
    ...verification.payload,
    lastActiveAt: now,
    expiresAt: now + ADMIN_INACTIVITY_LIMIT_MS,
  }

  const newToken = await signAdminToken(updatedPayload)

  const response = NextResponse.json({
    success: true,
    message: 'Admin session heartbeat updated',
    remainingInactivitySeconds: Math.floor(ADMIN_INACTIVITY_LIMIT_MS / 1000),
  })

  const cookieOptions = getAdminCookieOptions(process.env.NODE_ENV === 'production')
  response.cookies.set(ADMIN_COOKIE_NAME, newToken, cookieOptions)

  return response
}
