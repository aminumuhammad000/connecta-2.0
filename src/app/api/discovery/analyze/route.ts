import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { processAttachment, ProcessedAttachment } from '@/lib/ai/document-parser'
import { analyzeServiceRequest, matchProviders } from '@/lib/ai/discovery'
import { getAllPublicProviders } from '@/lib/server/providers'

export const maxDuration = 30 // 30 seconds max for multimodal analysis

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let text = ''
    let city: string | null = null
    let verifiedOnly = false
    const processedAttachments: ProcessedAttachment[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      text = (formData.get('text') as string) || ''
      city = (formData.get('city') as string) || null
      verifiedOnly = formData.get('verifiedOnly') === 'true'

      const files = formData.getAll('files') as File[]
      if (files.length > 5) {
        return errorResponse('Maximum 5 attachments allowed per service request', 400)
      }

      for (const file of files) {
        if (!file || typeof file === 'string' || !file.name) continue

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        try {
          const processed = await processAttachment(file.name, file.type, buffer)
          processedAttachments.push(processed)
        } catch (err: any) {
          return errorResponse(err.message || `Failed to process attachment ${file.name}`, 400)
        }
      }
    } else {
      const body = await request.json()
      text = body.text || ''
      city = body.city || null
      verifiedOnly = Boolean(body.verifiedOnly)

      if (Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          if (att.base64 && att.name) {
            const buffer = Buffer.from(att.base64.replace(/^data:[^;]+;base64,/, ''), 'base64')
            const processed = await processAttachment(att.name, att.mimeType || 'image/jpeg', buffer)
            processedAttachments.push(processed)
          }
        }
      }
    }

    if (!text.trim() && processedAttachments.length === 0) {
      return errorResponse('Please provide a description, voice transcript, or file attachment to find matching providers.', 400)
    }

    // 1. Run AI request understanding
    const analysis = await analyzeServiceRequest({
      text,
      attachments: processedAttachments,
      cityContext: city,
    })

    // 2. Query Connecta provider database & rank real providers
    const allProviders = getAllPublicProviders({ verifiedOnly })
    const providers = matchProviders(analysis, {
      cityFilter: city,
      verifiedOnly,
      providersList: allProviders,
    })

    return successResponse({
      analysis,
      providers,
      totalMatches: providers.length,
    })
  } catch (err: any) {
    console.error('[Discovery API] Uncaught error during analyze:', err)
    return errorResponse(err.message || 'Internal server error while discovering providers', 500)
  }
}
