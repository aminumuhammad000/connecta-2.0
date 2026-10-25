import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser, readDatabase, writeDatabase } from '@/lib/server/db'

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
    const body = await request.json().catch(() => ({}))
    const { proposalText, quoteAmountMinor } = body

    const db = readDatabase()
    const job = db.service_requests.find((j) => j.id === id)
    if (!job) {
      return errorResponse('Job request not found', 404)
    }

    job.proposalsCount = (job.proposalsCount || 0) + 1
    writeDatabase(db)

    return successResponse({
      message: 'Proposal successfully dispatched to client with Connecta Escrow terms!',
      jobId: id,
      proposalsCount: job.proposalsCount,
      quoteAmountMinor,
      applicant: {
        id: user.id,
        name: user.fullName,
        headline: user.headline,
      },
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to submit proposal', 500)
  }
}
