import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Admin session terminated successfully',
  })

  // Clear admin cookie
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  return response
}
