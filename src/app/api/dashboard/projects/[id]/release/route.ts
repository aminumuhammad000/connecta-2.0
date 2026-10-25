import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { releaseMilestone, getActiveUser } from '@/lib/server/db'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const { id } = await context.params
    const body = await request.json()
    const { milestoneId } = body

    if (!milestoneId) {
      return errorResponse('Milestone ID is required', 422)
    }

    const success = releaseMilestone(id, milestoneId)
    if (!success) {
      return errorResponse('Failed to release milestone. Booking or milestone not found, or already released.', 400)
    }

    return successResponse({
      message: 'Milestone escrow successfully verified and released to specialist!',
      bookingId: id,
      milestoneId,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Milestone release failed', 500)
  }
}
