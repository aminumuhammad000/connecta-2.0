import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { generateSignedUploadParams, validateMediaUpload, MediaPurpose } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { purpose, mimeType, sizeBytes } = body

    if (!purpose || !mimeType || !sizeBytes) {
      return errorResponse('purpose, mimeType, and sizeBytes are required', 400)
    }

    // Validate MIME and size constraints
    validateMediaUpload(mimeType, Number(sizeBytes))

    const userId = '00000000-0000-0000-0000-000000000001'
    const signedParams = generateSignedUploadParams(purpose as MediaPurpose, userId)

    return successResponse(signedParams)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to sign media upload', 400)
  }
}
