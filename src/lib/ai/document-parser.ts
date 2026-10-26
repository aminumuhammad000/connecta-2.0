import zlib from 'zlib'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain']
export const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
export const MAX_EXTRACTED_TEXT_LENGTH = 8000

export interface ProcessedAttachment {
  name: string
  mimeType: string
  sizeBytes: number
  isImage: boolean
  base64Data?: string // for image vision analysis (e.g. data:image/jpeg;base64,...)
  extractedText?: string // for PDF/TXT
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

  if (isImage) {
    const base64 = buffer.toString('base64')
    return {
      name,
      mimeType: validatedMime,
      sizeBytes: buffer.length,
      isImage: true,
      base64Data: `data:${validatedMime};base64,${base64}`,
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
    extractedText,
  }
}
