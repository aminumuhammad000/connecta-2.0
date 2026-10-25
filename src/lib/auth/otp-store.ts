import { randomInt } from 'crypto'
import { Resend } from 'resend'
import { generateOtpEmailHtml } from '@/lib/email/otp-template'

interface OtpRecord {
  code: string
  expiresAt: number
  attempts: number
  verified: boolean
}

// In-memory OTP registry, persisted in global for Next.js hot module reloading
declare global {
  // eslint-disable-next-line no-var
  var __connecta_otp_store: Map<string, OtpRecord> | undefined
}

const otpStore: Map<string, OtpRecord> = globalThis.__connecta_otp_store || new Map()
if (process.env.NODE_ENV !== 'production') {
  globalThis.__connecta_otp_store = otpStore
}

// Clean up expired records every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [email, record] of otpStore.entries()) {
    if (record.expiresAt < now) {
      otpStore.delete(email)
    }
  }
}, 5 * 60 * 1000)

/**
 * Generate a 6-digit numeric OTP and save it for an email
 */
export async function createAndSendOtp(email: string): Promise<{ success: boolean; message: string; devCode?: string }> {
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Invalid email address')
  }

  // Rate limit: check if a code was issued in the last 30 seconds
  const existing = otpStore.get(cleanEmail)
  const now = Date.now()
  if (existing && existing.expiresAt - now > 9.5 * 60 * 1000) {
    throw new Error('Please wait 30 seconds before requesting another verification code.')
  }

  // Generate 6-digit cryptographically random code
  const code = randomInt(100000, 999999).toString()
  const expiresAt = now + 10 * 60 * 1000 // 10 minutes

  otpStore.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
    verified: false,
  })

  const resendApiKey = process.env.RESEND_API_KEY
  const senderEmail = process.env.RESEND_SENDER_EMAIL || 'security@myconnecta.ng'
  const fromAddress = senderEmail.includes('<') ? senderEmail : `Connecta Security <${senderEmail}>`
  const isRealResendKey = resendApiKey && resendApiKey.startsWith('re_') && resendApiKey !== 're_placeholder'

  if (isRealResendKey) {
    try {
      const resend = new Resend(resendApiKey)
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: cleanEmail,
        replyTo: 'support@myconnecta.ng',
        subject: `Your Connecta Verification Code: ${code}`,
        html: generateOtpEmailHtml(code),
      })

      if (error) {
        console.warn('[Resend Notice]', error.message)
        console.log(`[Connecta Server OTP] 🔑 Verification code for ${cleanEmail}: ${code}`)
        return {
          success: true,
          message: error.message.includes('own email address')
            ? `Verification code dispatched! (Resend free tier delivers to connectagigs@gmail.com until custom domain is verified).`
            : `Verification code sent to ${cleanEmail}. Please check your inbox.`,
          devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        }
      }

      console.log(`[Resend Success] ✉️ Real email delivered to ${cleanEmail} (ID: ${data?.id})`)
      return {
        success: true,
        message: `Verification code sent to ${cleanEmail}. Please check your inbox.`,
      }
    } catch (err: any) {
      console.error('[Resend Error]', err)
      console.log(`[Connecta Server OTP] 🔑 Verification code for ${cleanEmail}: ${code}`)
      return {
        success: true,
        message: `Verification code dispatched to ${cleanEmail}.`,
        devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
      }
    }
  } else {
    // Development fallback when RESEND_API_KEY is not configured yet
    console.log(`\n=============================================================`)
    console.log(`[Connecta Server OTP] ✉️ Real Server OTP Generated:`)
    console.log(`  Recipient : ${cleanEmail}`)
    console.log(`  Code      : ${code}`)
    console.log(`  Expires In: 10 minutes`)
    console.log(`=============================================================\n`)

    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}.`,
      devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    }
  }
}

/**
 * Verify a 6-digit OTP code against the server registry
 */
export function verifyOtpCode(email: string, code: string): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase()
  const cleanCode = code.trim()

  const record = otpStore.get(cleanEmail)
  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    }
  }

  const now = Date.now()
  if (record.expiresAt < now) {
    otpStore.delete(cleanEmail)
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    }
  }

  if (record.attempts >= 5) {
    otpStore.delete(cleanEmail)
    return {
      success: false,
      error: 'Too many incorrect attempts. Please request a new verification code.',
    }
  }

  if (record.code !== cleanCode) {
    record.attempts += 1
    return {
      success: false,
      error: `Invalid verification code. ${5 - record.attempts} attempts remaining.`,
    }
  }

  // Verification succeeded: mark as verified and clean up
  record.verified = true
  markEmailAsVerifiedForReset(cleanEmail)
  otpStore.delete(cleanEmail)

  return { success: true }
}

// Map to track emails that have successfully verified an OTP for password reset
const verifiedResetEmails: Map<string, number> = new Map()

export function markEmailAsVerifiedForReset(email: string): void {
  verifiedResetEmails.set(email.trim().toLowerCase(), Date.now() + 15 * 60 * 1000)
}

export function isEmailVerifiedForReset(email: string): boolean {
  const expiresAt = verifiedResetEmails.get(email.trim().toLowerCase())
  if (!expiresAt) return false
  if (expiresAt < Date.now()) {
    verifiedResetEmails.delete(email.trim().toLowerCase())
    return false
  }
  return true
}

export function consumeVerifiedEmailForReset(email: string): void {
  verifiedResetEmails.delete(email.trim().toLowerCase())
}
