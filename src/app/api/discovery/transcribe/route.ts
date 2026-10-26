import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('file') as File | null

    if (!audioFile) {
      return errorResponse('Audio file is required for voice transcription', 400)
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return errorResponse('Audio file exceeds the maximum 25MB limit', 400)
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.startsWith('placeholder')) {
      return errorResponse('Voice transcription service is temporarily unavailable (AI key not configured). Please type your request.', 503)
    }

    // Forward the audio file to OpenAI Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile, audioFile.name || 'recording.webm')
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('prompt', 'Connecta Nigerian artisan and service marketplace request in Kano, Lagos, Abuja, Hausa or English.')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[Whisper Audio] OpenAI API error:', response.status, errText)
      return errorResponse('Could not transcribe audio. Please try speaking clearly or typing your request.', 502)
    }

    const data = await response.json()
    const transcript = (data.text || '').trim()

    if (!transcript) {
      return errorResponse('No speech could be recognized. Please try speaking again.', 400)
    }

    return successResponse({
      transcript,
    })
  } catch (err: any) {
    console.error('[Whisper Audio] Uncaught error during transcription:', err)
    return errorResponse(err.message || 'Internal server error during speech transcription', 500)
  }
}
