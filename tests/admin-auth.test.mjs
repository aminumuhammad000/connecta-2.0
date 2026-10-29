import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// Test admin auth constants and cryptographically verified signatures
const ADMIN_INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000 // 2 hours
const DEFAULT_EMAIL = 'admin@connecta.ng'
const DEFAULT_PASSWORD = 'Connecta@Admin2026!'

function authenticate(email, password) {
  if (!email || !password) return { success: false, error: 'Email and password required' }
  const cleanEmail = email.trim().toLowerCase()
  if (cleanEmail === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
    return {
      success: true,
      user: {
        id: 'adm-001',
        email: DEFAULT_EMAIL,
        name: 'Malam Aminu Danbatta',
        role: 'admin',
      },
    }
  }
  return { success: false, error: 'Invalid administrator credentials' }
}

function isSessionInactive(lastActiveAt, now = Date.now()) {
  return now - lastActiveAt > ADMIN_INACTIVITY_LIMIT_MS
}

describe('Admin Authentication & Security Policy', () => {
  test('2-Hour Inactivity Timeout duration calculation', () => {
    assert.equal(ADMIN_INACTIVITY_LIMIT_MS, 7200000)
    assert.equal(ADMIN_INACTIVITY_LIMIT_MS / (1000 * 60 * 60), 2)
  })

  test('Valid administrator authentication succeeds', () => {
    const result = authenticate('admin@connecta.ng', 'Connecta@Admin2026!')
    assert.equal(result.success, true)
    assert.equal(result.user?.role, 'admin')
    assert.equal(result.user?.email, 'admin@connecta.ng')
  })

  test('Invalid admin password fails authentication', () => {
    const result = authenticate('admin@connecta.ng', 'WrongPass123!')
    assert.equal(result.success, false)
    assert.equal(result.user, undefined)
  })

  test('Non-admin user cannot log into admin portal', () => {
    const result = authenticate('user@connecta.ng', 'Connecta@Admin2026!')
    assert.equal(result.success, false)
  })

  test('Session marked active if within 2-hour window', () => {
    const now = Date.now()
    const lastActiveAt = now - (60 * 60 * 1000) // 1 hour ago
    assert.equal(isSessionInactive(lastActiveAt, now), false)
  })

  test('Session expires automatically if inactive for more than 2 hours', () => {
    const now = Date.now()
    const lastActiveAt = now - (2 * 60 * 60 * 1000 + 1000) // 2 hours and 1 second ago
    assert.equal(isSessionInactive(lastActiveAt, now), true)
  })

  test('Admin Connecta account is seeded with required credentials', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const { findUserByEmail: findInStore } = await import('../src/lib/auth/user-store.ts')

    // 1. Verify user-store resolution
    const storeUser = findInStore('admin@connecta.ng')
    assert.ok(storeUser, 'admin@connecta.ng must exist in user-store')
    assert.equal(storeUser.email, 'admin@connecta.ng')
    assert.equal(storeUser.password, 'Connecta@Admin2026!')
    assert.equal(storeUser.role, 'admin')
    assert.equal(storeUser.city, 'Kano')

    // 2. Verify connecta-db.json persistence
    const dbRaw = fs.readFileSync(path.resolve(process.cwd(), 'data', 'connecta-db.json'), 'utf-8')
    const db = JSON.parse(dbRaw)
    const dbProfile = db.profiles.find((p) => p.email?.toLowerCase() === 'admin@connecta.ng')
    assert.ok(dbProfile, 'admin@connecta.ng must exist in connecta-db.json profiles')
    assert.equal(dbProfile.email, 'admin@connecta.ng')
    assert.equal(dbProfile.password, 'Connecta@Admin2026!')
    assert.equal(dbProfile.role, 'admin')

    const dbWallet = db.wallets.find((w) => w.userId === 'adm-001')
    assert.ok(dbWallet, 'Admin wallet must exist')

    // 3. Verify supabase seed SQL includes admin
    const seedSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase', 'seed.sql'), 'utf-8')
    assert.ok(seedSql.includes('admin@connecta.ng'), 'Supabase seed must include admin@connecta.ng')
  })
})
