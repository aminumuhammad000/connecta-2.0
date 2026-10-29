import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  signAdminToken,
  verifyAdminToken,
  authenticateAdmin,
  createAdminSessionPayload,
  ADMIN_INACTIVITY_LIMIT_MS,
  DEFAULT_ADMIN,
  getAdminCookieOptions,
} from '../src/lib/auth/admin-auth.ts'

describe('Admin Security Cryptographic & Session Suite', () => {
  test('Session payload initialization has 2-hour window', () => {
    const payload = createAdminSessionPayload(DEFAULT_ADMIN)
    assert.equal(payload.role, 'admin')
    assert.equal(payload.email, 'admin@connecta.ng')
    assert.equal(payload.expiresAt - payload.lastActiveAt, ADMIN_INACTIVITY_LIMIT_MS)
  })

  test('HMAC-SHA256 Token Signing & Verification', async () => {
    const payload = createAdminSessionPayload(DEFAULT_ADMIN)
    const token = await signAdminToken(payload)
    assert.ok(token)
    assert.equal(token.split('.').length, 2)

    const verification = await verifyAdminToken(token)
    assert.equal(verification.valid, true)
    assert.equal(verification.payload?.adminId, DEFAULT_ADMIN.id)
    assert.equal(verification.payload?.email, DEFAULT_ADMIN.email)
  })

  test('Inactivity detection after 2 hours (7200 seconds)', async () => {
    const payload = createAdminSessionPayload(DEFAULT_ADMIN)
    // Simulate inactivity of 2 hours and 5 seconds
    const expiredPayload = {
      ...payload,
      lastActiveAt: Date.now() - (ADMIN_INACTIVITY_LIMIT_MS + 5000),
    }
    const token = await signAdminToken(expiredPayload)
    const verification = await verifyAdminToken(token)

    assert.equal(verification.valid, false)
    assert.equal(verification.reason, 'inactive_timeout')
  })

  test('Active session renewal within 2 hours succeeds', async () => {
    const payload = createAdminSessionPayload(DEFAULT_ADMIN)
    // 30 minutes of activity elapsed
    const recentPayload = {
      ...payload,
      lastActiveAt: Date.now() - 30 * 60 * 1000,
    }
    const token = await signAdminToken(recentPayload)
    const verification = await verifyAdminToken(token)

    assert.equal(verification.valid, true)
    assert.ok(verification.payload)
  })

  test('Tampered token signature is rejected', async () => {
    const payload = createAdminSessionPayload(DEFAULT_ADMIN)
    const token = await signAdminToken(payload)
    const [body, sig] = token.split('.')
    const tampered = `${body}.${sig.slice(0, -4)}XXXX`
    const verification = await verifyAdminToken(tampered)
    assert.equal(verification.valid, false)
    assert.equal(verification.reason, 'invalid')
  })

  test('Admin cookie attributes conform to strict security standard', () => {
    const options = getAdminCookieOptions(true)
    assert.equal(options.httpOnly, true)
    assert.equal(options.secure, true)
    assert.equal(options.sameSite, 'lax')
    assert.equal(options.maxAge, 7200)
    assert.equal(options.path, '/')
  })
})
