import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.startsWith('placeholder')) {
      return errorResponse('OpenAI API key is not configured for voice transcription.', 500)
    }

    const contentType = request.headers.get('content-type') || ''
    let audioBuffer: Buffer | null = null
    let filename = 'audio.webm'
    let mimeType = 'audio/webm'

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return errorResponse('No audio file provided in request', 400)
      }
      filename = file.name || 'audio.webm'
      mimeType = file.type || 'audio/webm'
      const arrayBuffer = await file.arrayBuffer()
      audioBuffer = Buffer.from(arrayBuffer)
    } else {
      const body = await request.json().catch(() => ({}))
      if (body.base64) {
        const cleanBase64 = body.base64.replace(/^data:[^;]+;base64,/, '')
        audioBuffer = Buffer.from(cleanBase64, 'base64')
        filename = body.filename || 'audio.webm'
        mimeType = body.mimeType || 'audio/webm'
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return errorResponse('Audio data is required', 400)
    }

    // Prepare Whisper API request
    const whisperFormData = new FormData()
    const blob = new Blob([audioBuffer], { type: mimeType })
    whisperFormData.append('file', blob, filename)
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append(
      'prompt',
      'Connecta Nigerian artisan technical fault description, electrician, plumber, solar inverter, generator, AC repair, Lagos, Kano, Abuja.'
    )

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperFormData,
    })

    if (!whisperRes.ok) {
      const errText = await whisperRes.text()
      console.error('[Whisper API Error]:', errText)
      return errorResponse(`Whisper transcription failed: ${whisperRes.statusText}`, 502)
    }

    const whisperData = await whisperRes.json()
    const transcript = whisperData.text || ''

    return successResponse({
      transcript: transcript.trim(),
    })
  } catch (err: any) {
    console.error('[Transcribe API Error]:', err)
    return errorResponse(err.message || 'Failed to transcribe audio', 500)
  }
}
