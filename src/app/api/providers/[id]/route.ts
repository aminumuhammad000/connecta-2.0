import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getPublicProviderById } from '@/lib/server/providers'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const provider = getPublicProviderById(id)

    if (!provider) {
      return errorResponse('Service provider profile not found', 404)
    }

    return successResponse(provider)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch provider profile', 500)
  }
}
