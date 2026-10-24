import { env } from './env'
import crypto from 'crypto'

export type MediaPurpose = 'profile' | 'portfolio' | 'request_attachment' | 'job_evidence' | 'verification'

const FOLDER_MAP: Record<MediaPurpose, string> = {
  profile: 'connecta/profiles',
  portfolio: 'connecta/portfolio',
  request_attachment: 'connecta/requests',
  job_evidence: 'connecta/evidence',
  verification: 'connecta/verification_private',
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export function validateMediaUpload(mimeType: string, sizeBytes: number) {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported media type: ${mimeType}. Allowed: JPEG, PNG, WEBP, PDF`)
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum allowed size of 10MB (got ${(sizeBytes / 1024 / 1024).toFixed(2)}MB)`)
  }
}

export function generateSignedUploadParams(purpose: MediaPurpose, userId: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const folder = FOLDER_MAP[purpose]
  const apiSecret = env.CLOUDINARY_API_SECRET || 'placeholder_secret'

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=connecta_${purpose}`
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  return {
    timestamp,
    folder,
    signature,
    apiKey: env.CLOUDINARY_API_KEY || 'placeholder_key',
    cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'placeholder_cloud',
  }
}
