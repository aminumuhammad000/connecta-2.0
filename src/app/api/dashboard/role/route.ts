import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser, upsertUser } from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json().catch(() => ({}))
    const requestedRole = body.role as 'client' | 'provider'

    const targetRole = requestedRole
      ? (requestedRole === 'provider' ? 'provider' : 'customer')
      : (user.activeRole === 'provider' ? 'customer' : 'provider')

    user.activeRole = targetRole
    upsertUser(user)

    const response = successResponse({
      activeRole: user.activeRole === 'provider' ? 'provider' : 'client',
      user: {
        id: user.id,
        fullName: user.fullName,
        activeRole: user.activeRole,
      },
    })

    response.cookies.set('connecta_role', user.activeRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to toggle role', 500)
  }
}
