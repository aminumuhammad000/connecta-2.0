import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getDisputes,
  addDispute,
  ServerDispute,
} from '@/lib/server/db'

export async function GET() {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const disputes = getDisputes(user.id)
    return successResponse(disputes)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch disputes', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const { bookingId, bookingTitle, amountMinor, reason, notes } = body

    if (!reason || !bookingTitle) {
      return errorResponse('Reason and project title are required', 422)
    }

    const disputeId = `DISP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    const newDispute: ServerDispute = {
      id: disputeId,
      disputeNumber: disputeId,
      bookingId: bookingId || 'N/A',
      bookingNumber: bookingId ? `#${bookingId}` : 'Support Inquiry',
      bookingTitle,
      amountMinor: Number(amountMinor) || 0,
      claimantName: user.fullName,
      claimantRole: user.activeRole === 'provider' ? 'Specialist' : 'Client',
      respondentName: 'Connecta Escrow Desk',
      respondentRole: 'Platform Mediation',
      reason,
      status: 'under_review',
      filedDate: new Date().toISOString().split('T')[0],
      lastUpdate: 'Just now (Desk Assigned)',
      evidenceItems: 1,
      notes: notes || 'Awaiting initial evidence review from mediation officer.',
    }

    addDispute(newDispute)

    return successResponse(newDispute, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to submit dispute', 500)
  }
}
