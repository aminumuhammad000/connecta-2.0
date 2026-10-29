/**
 * Connecta 2.0 - Admin Authentication & Session Management
 *
 * Implements strict administrator authentication with a 2-hour inactivity timeout.
 * Compatible with Edge Runtime (Middleware) and Node.js Server Runtime (API / SSR).
 */

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
  avatarUrl?: string
}

export interface AdminSessionPayload {
  adminId: string
  email: string
  name: string
  role: 'admin'
  issuedAt: number // epoch ms
  lastActiveAt: number // epoch ms
  expiresAt: number // epoch ms
}

export const ADMIN_COOKIE_NAME = 'connecta_admin_session'
export const ADMIN_INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000 // 2 hours in ms (7,200,000 ms)
export const ADMIN_MAX_SESSION_MS = 24 * 60 * 60 * 1000 // 24 hours absolute max cap

export const DEFAULT_ADMIN: AdminUser = {
  id: 'adm-001',
  email: process.env.ADMIN_EMAIL || 'admin@connecta.ng',
  name: 'Malam Aminu Danbatta',
  role: 'admin',
  avatarUrl: '/brand/svg/connecta-icon.svg',
}

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || 'connecta-admin-secret-vault-2026'

// Base64Url helpers compatible with Edge & Node
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }
  const utf8 = unescape(encodeURIComponent(str))
  return btoa(utf8)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8')
  }
  return decodeURIComponent(escape(atob(base64)))
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(SECRET_KEY)
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

/**
 * Sign an admin session payload and return a secure token: payload.signature
 */
export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  const jsonStr = JSON.stringify(payload)
  const encodedPayload = base64UrlEncode(jsonStr)
  const encoder = new TextEncoder()
  const data = encoder.encode(encodedPayload)
  const key = await getCryptoKey()
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, data)
  const encodedSignature = arrayBufferToBase64Url(signatureBuffer)
  return `${encodedPayload}.${encodedSignature}`
}

/**
 * Verify and parse an admin session token.
 * Validates HMAC signature and checks for 2-hour inactivity expiration.
 */
export async function verifyAdminToken(
  token: string | null | undefined
): Promise<{ valid: boolean; payload?: AdminSessionPayload; reason?: 'missing' | 'invalid' | 'inactive_timeout' | 'expired' }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing' }
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    return { valid: false, reason: 'invalid' }
  }

  const [encodedPayload, encodedSignature] = parts

  try {
    const key = await getCryptoKey()
    const encoder = new TextEncoder()
    const data = encoder.encode(encodedPayload)

    // Decode provided signature
    let sigBase64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/')
    while (sigBase64.length % 4) sigBase64 += '='
    const binarySig = atob(sigBase64)
    const sigBytes = new Uint8Array(binarySig.length)
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i)
    }

    const isValidSig = await crypto.subtle.verify('HMAC', key, sigBytes, data)
    if (!isValidSig) {
      return { valid: false, reason: 'invalid' }
    }

    const jsonStr = base64UrlDecode(encodedPayload)
    const payload: AdminSessionPayload = JSON.parse(jsonStr)

    // Role check
    if (payload.role !== 'admin') {
      return { valid: false, reason: 'invalid' }
    }

    const now = Date.now()

    // 2-hour inactivity check:
    const inactiveDuration = now - payload.lastActiveAt
    if (inactiveDuration > ADMIN_INACTIVITY_LIMIT_MS) {
      return { valid: false, payload, reason: 'inactive_timeout' }
    }

    // Absolute expiration check
    if (now > payload.expiresAt) {
      return { valid: false, payload, reason: 'expired' }
    }

    return { valid: true, payload }
  } catch {
    return { valid: false, reason: 'invalid' }
  }
}

/**
 * Validates admin credentials against configured admin environment or database
 */
export async function authenticateAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  if (!email || !pass) {
    return { success: false, error: 'Email and password are required' }
  }

  const cleanEmail = email.trim().toLowerCase()
  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const expectedPassword = DEFAULT_ADMIN_PASSWORD

  if (!expectedEmail || !expectedPassword) {
    return { success: false, error: 'Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.' }
  }

  // Check default / configured super admin
  if (cleanEmail === expectedEmail && pass === expectedPassword) {
    return {
      success: true,
      user: {
        id: 'adm-001',
        email: expectedEmail,
        name: 'Malam Aminu Danbatta',
        role: 'admin',
        avatarUrl: '/brand/svg/connecta-icon.svg',
      },
    }
  }

  return { success: false, error: 'Invalid administrator email or password' }
}

/**
 * Creates a fresh AdminSessionPayload with 2-hour inactivity timestamp
 */
export function createAdminSessionPayload(user: AdminUser): AdminSessionPayload {
  const now = Date.now()
  return {
    adminId: user.id,
    email: user.email,
    name: user.name,
    role: 'admin',
    issuedAt: now,
    lastActiveAt: now,
    expiresAt: now + ADMIN_INACTIVITY_LIMIT_MS,
  }
}

/**
 * Returns cookie settings for the admin session
 */
export function getAdminCookieOptions(isProduction: boolean = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(ADMIN_INACTIVITY_LIMIT_MS / 1000), // 7200 seconds (2 hours)
  }
}
