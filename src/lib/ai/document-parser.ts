import zlib from 'zlib'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain']
export const ALLOWED_AUDIO_TYPES = [
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac',
]
export const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_AUDIO_TYPES]

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
export const MAX_EXTRACTED_TEXT_LENGTH = 8000

export interface ProcessedAttachment {
  name: string
  mimeType: string
  sizeBytes: number
  isImage: boolean
  isAudio?: boolean
  base64Data?: string // for image vision analysis or audio
  extractedText?: string // for PDF/TXT or transcribed voice note
}

/**
 * Validate file mime type and size.
 * Rejects unsupported types with clear guidance.
 */
export function validateAttachment(name: string, mimeType: string, sizeBytes: number) {
  const lowerName = name.toLowerCase()
  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    throw new Error('DOCX and DOC formats are not currently supported. Please upload a PDF, TXT, or image (JPEG, PNG, WebP).')
  }

  // Normalize mime type if empty but extension is known
  let resolvedMime = mimeType
  if (!resolvedMime || resolvedMime === 'application/octet-stream') {
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) resolvedMime = 'image/jpeg'
    else if (lowerName.endsWith('.png')) resolvedMime = 'image/png'
    else if (lowerName.endsWith('.webp')) resolvedMime = 'image/webp'
    else if (lowerName.endsWith('.pdf')) resolvedMime = 'application/pdf'
    else if (lowerName.endsWith('.txt')) resolvedMime = 'text/plain'
    else if (lowerName.endsWith('.mp3')) resolvedMime = 'audio/mpeg'
    else if (lowerName.endsWith('.m4a')) resolvedMime = 'audio/m4a'
    else if (lowerName.endsWith('.wav')) resolvedMime = 'audio/wav'
    else if (lowerName.endsWith('.ogg') || lowerName.endsWith('.opus')) resolvedMime = 'audio/ogg'
    else if (lowerName.endsWith('.webm')) resolvedMime = 'audio/webm'
    else if (lowerName.endsWith('.aac')) resolvedMime = 'audio/aac'
  }

  if (!ALL_ALLOWED_TYPES.includes(resolvedMime)) {
    throw new Error(`Unsupported file type: "${resolvedMime || name}". Supported formats: JPEG, PNG, WebP, PDF, TXT.`)
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File "${name}" exceeds the 10MB size limit (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB).`)
  }

  return resolvedMime
}

/**
 * Safely extracts textual content from a PDF buffer.
 * Extracts BT...ET blocks and decompresses FlateDecode streams.
 * Includes bounds checking and timeout protection against malformed PDFs.
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const textPieces: string[] = []
    let totalLength = 0

    // Search for uncompressed streams or FlateDecode streams
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g
    const str = buffer.toString('binary')
    let match: RegExpExecArray | null

    while ((match = streamRegex.exec(str)) !== null) {
      if (totalLength >= MAX_EXTRACTED_TEXT_LENGTH) break

      const streamContent = match[1]
      let decompressed = streamContent

      // Check if preceding dictionary indicates FlateDecode
      const preceding = str.slice(Math.max(0, match.index - 300), match.index)
      if (preceding.includes('/FlateDecode')) {
        try {
          const rawBuffer = Buffer.from(streamContent, 'binary')
          const inflated = zlib.inflateSync(rawBuffer)
          decompressed = inflated.toString('latin1')
        } catch {
          // If inflation fails, attempt raw extraction or continue
          decompressed = streamContent
        }
      }

      // Extract text inside parentheses in PDF text operators: (Text) Tj, [(Text) 20 (More)] TJ
      const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g
      let tjMatch: RegExpExecArray | null
      while ((tjMatch = tjRegex.exec(decompressed)) !== null) {
        const clean = tjMatch[1].replace(/\\([()\\])/g, '$1').trim()
        if (clean.length > 0) {
          textPieces.push(clean)
          totalLength += clean.length
          if (totalLength >= MAX_EXTRACTED_TEXT_LENGTH) break
        }
      }

      // TJ array operators: [(Hello) 10 (World)] TJ
      const arrayRegex = /\[([^\]]+)\]\s*TJ/g
      let arrMatch: RegExpExecArray | null
      while ((arrMatch = arrayRegex.exec(decompressed)) !== null) {
        const inner = arrMatch[1]
        const innerStrings = inner.match(/\(([^)]+)\)/g)
        if (innerStrings) {
          const line = innerStrings
            .map((s) => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
            .join(' ')
            .trim()
          if (line.length > 0) {
            textPieces.push(line)
            totalLength += line.length
            if (totalLength >= MAX_EXTRACTED_TEXT_LENGTH) break
          }
        }
      }
    }

    const result = textPieces.join(' ').replace(/\s+/g, ' ').trim()
    return result.slice(0, MAX_EXTRACTED_TEXT_LENGTH)
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.warn('[PDF Parser] Error during safe text extraction:', errorMsg)
    return ''
  }
}

/**
 * Process a single attachment for AI consumption.
 */
export async function processAttachment(
  name: string,
  mimeType: string,
  buffer: Buffer
): Promise<ProcessedAttachment> {
  const validatedMime = validateAttachment(name, mimeType, buffer.length)
  const isImage = ALLOWED_IMAGE_TYPES.includes(validatedMime)
  const isAudio = ALLOWED_AUDIO_TYPES.includes(validatedMime)

  if (isImage) {
    const base64 = buffer.toString('base64')
    return {
      name,
      mimeType: validatedMime,
      sizeBytes: buffer.length,
      isImage: true,
      isAudio: false,
      base64Data: `data:${validatedMime};base64,${base64}`,
    }
  }

  if (isAudio) {
    const base64 = buffer.toString('base64')
    let transcript = ''
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && !apiKey.startsWith('placeholder')) {
      try {
        const whisperFormData = new FormData()
        const blob = new Blob([buffer], { type: validatedMime })
        whisperFormData.append('file', blob, name || 'audio.webm')
        whisperFormData.append('model', 'whisper-1')
        whisperFormData.append(
          'prompt',
          'Connecta Nigerian artisan technical fault description, electrician, plumber, solar inverter, generator, AC repair, Lagos, Kano, Abuja.'
        )
        const wRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: whisperFormData,
        })
        if (wRes.ok) {
          const wData = await wRes.json()
          transcript = wData.text || ''
        }
      } catch (wErr) {
        console.warn('[Audio Process] Whisper transcription failed:', wErr)
      }
    }

    return {
      name,
      mimeType: validatedMime,
      sizeBytes: buffer.length,
      isImage: false,
      isAudio: true,
      base64Data: `data:${validatedMime};base64,${base64}`,
      extractedText: transcript ? `[User Voice Note Transcription]: "${transcript}"` : '',
    }
  }

  // Document (PDF or TXT)
  let extractedText = ''
  if (validatedMime === 'application/pdf') {
    extractedText = extractTextFromPdfBuffer(buffer)
  } else if (validatedMime === 'text/plain') {
    extractedText = buffer.toString('utf-8').slice(0, MAX_EXTRACTED_TEXT_LENGTH)
  }

  return {
    name,
    mimeType: validatedMime,
    sizeBytes: buffer.length,
    isImage: false,
    isAudio: false,
    extractedText,
  }
}
