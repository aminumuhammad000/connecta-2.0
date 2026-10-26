/**
 * Connecta 2.0 - Google OAuth Authentication Service
 */

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '89671982625-iuj8vlsdjhcntlpdal9nbn6qi4hn01hf.apps.googleusercontent.com'

export interface GoogleTokenPayload {
  email: string
  name: string
  given_name?: string
  family_name?: string
  picture?: string
  sub: string
  email_verified: boolean | string
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
  if (!idToken) {
    throw new Error('Google ID token is required')
  }

  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
    const data = await res.json()

    if (data.error_description || data.error) {
      throw new Error(data.error_description || data.error || 'Invalid Google token')
    }

    // Verify audience matches our Client ID (if configured)
    const aud = data.aud
    if (GOOGLE_CLIENT_ID && aud !== GOOGLE_CLIENT_ID) {
      console.warn(`[Google Auth Warning] Audience mismatch: got ${aud}, expected ${GOOGLE_CLIENT_ID}`)
    }

    return {
      email: data.email.toLowerCase(),
      name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim() || 'Google User',
      given_name: data.given_name || '',
      family_name: data.family_name || '',
      picture: data.picture,
      sub: data.sub,
      email_verified: data.email_verified === 'true' || data.email_verified === true,
    }
  } catch (err: any) {
    console.error('[Google Verification Error]', err)
    throw new Error(err.message || 'Failed to verify Google identity token')
  }
}
