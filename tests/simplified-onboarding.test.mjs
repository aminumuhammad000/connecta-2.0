import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { onboardingSchema } from '../src/lib/validations/auth.ts'
import { saveUser, findUserByEmail, getAllUsers } from '../src/lib/auth/user-store.ts'
import { randomUUID } from 'crypto'

describe('Simplified Onboarding & Provider Activation Suite', () => {
  test('1. Minimal Client Registration succeeds with only Name, Email, and Password', () => {
    const rawPayload = {
      firstName: 'Amina',
      lastName: 'Garba',
      email: 'amina.garba@example.com',
      password: 'SecurePassword@2026',
    }

    const result = onboardingSchema.safeParse(rawPayload)
    assert.strictEqual(result.success, true, 'Validation should succeed for minimal client payload')
    if (result.success) {
      assert.strictEqual(result.data.role, 'client', 'Default role must be client')
      assert.strictEqual(result.data.firstName, 'Amina')
      assert.strictEqual(result.data.lastName, 'Garba')
      assert.strictEqual(result.data.country, 'Nigeria')
      assert.strictEqual(result.data.currency, 'NGN')
      assert.strictEqual(result.data.city, 'Lagos')
      assert.strictEqual(result.data.phone, '', 'Phone should default gracefully')
    }
  })

  test('2. Role escalation to "admin" is rejected', () => {
    const maliciousPayload = {
      role: 'admin',
      firstName: 'Hacker',
      lastName: 'BadActor',
      email: 'hacker@example.com',
      password: 'Password@2026',
    }

    const result = onboardingSchema.safeParse(maliciousPayload)
    assert.strictEqual(result.success, false, 'Should reject non-client/provider role')
  })

  test('3. Missing mandatory fields are rejected', () => {
    const invalidPayload = {
      firstName: '',
      lastName: '',
      email: 'not-an-email',
      password: '123',
    }

    const result = onboardingSchema.safeParse(invalidPayload)
    assert.strictEqual(result.success, false, 'Validation should fail')
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      assert.ok(fieldErrors.firstName, 'First name error expected')
      assert.ok(fieldErrors.lastName, 'Last name error expected')
      assert.ok(fieldErrors.email, 'Email format error expected')
      assert.ok(fieldErrors.password, 'Password min length error expected')
    }
  })

  test('4. Existing Client can activate Provider capability on same account ID without duplicate user', () => {
    const testUserId = randomUUID()
    const testEmail = `test.client.${Date.now()}@connecta.ng`

    // Initial client creation
    const initialClient = {
      id: testUserId,
      fullName: 'Sani Umar',
      firstName: 'Sani',
      lastName: 'Umar',
      email: testEmail,
      phone: '',
      role: 'customer',
      country: 'Nigeria',
      city: 'Lagos',
      currency: 'NGN',
      createdAt: new Date().toISOString(),
      welcomeSparks: 25,
    }
    saveUser(initialClient)

    const stored1 = findUserByEmail(testEmail)
    assert.ok(stored1, 'User must exist')
    assert.strictEqual(stored1.id, testUserId)
    assert.strictEqual(stored1.role, 'customer')
    assert.strictEqual(stored1.welcomeSparks, 25)

    // User later activates Provider capability
    const providerActivationPayload = {
      id: testUserId,
      fullName: 'Sani Umar',
      firstName: 'Sani',
      lastName: 'Umar',
      email: testEmail,
      phone: '+2348031112233',
      role: 'provider',
      country: 'Nigeria',
      city: 'Kano',
      currency: 'NGN',
      headline: 'Commercial Inverter & Solar Power Technician',
      primaryCategory: 'Solar & Electrical Power',
      skills: ['Solar Sizing', 'Hybrid Inverters', 'Circuit Tracing'],
      hourlyRateMinor: 1500000,
      workshopAddress: 'Shop 2, Kofar Ruwa Market, Kano',
      createdAt: initialClient.createdAt,
      welcomeSparks: initialClient.welcomeSparks, // Sparks balance preserved
    }
    saveUser(providerActivationPayload)

    // Verify user was updated in place (no duplicate user)
    const stored2 = findUserByEmail(testEmail)
    assert.ok(stored2, 'User must exist')
    assert.strictEqual(stored2.id, testUserId, 'User ID must remain unchanged')
    assert.strictEqual(stored2.role, 'provider', 'Role must reflect provider capability')
    assert.strictEqual(stored2.headline, 'Commercial Inverter & Solar Power Technician')
    assert.deepStrictEqual(stored2.skills, ['Solar Sizing', 'Hybrid Inverters', 'Circuit Tracing'])
    assert.strictEqual(stored2.welcomeSparks, 25, 'Welcome sparks must not be reset')

    // Confirm total user count did not duplicate
    const matchingUsers = getAllUsers().filter((u) => u.email.toLowerCase() === testEmail.toLowerCase())
    assert.strictEqual(matchingUsers.length, 1, 'There must be exactly one user record with this email')
  })

  test('5. Duplicate client registration is detected so user is prompted to log in', () => {
    const existingEmail = `existing-${Date.now()}@connecta.ng`
    saveUser({
      id: crypto.randomUUID(),
      fullName: 'Registered Client',
      firstName: 'Registered',
      lastName: 'Client',
      email: existingEmail,
      phone: '+2348000000000',
      password: 'HashedPassword@2026',
      role: 'customer',
      activeRole: 'customer',
      country: 'Nigeria',
      city: 'Kano',
      currency: 'NGN',
      createdAt: new Date().toISOString(),
      welcomeSparks: 0,
    })

    const found = findUserByEmail(existingEmail)
    assert.ok(found, 'Pre-existing user must be found')
    assert.strictEqual(found.email, existingEmail)

    // A new client attempting to register with this existing email should be flagged
    const isAlreadyRegistered = Boolean(findUserByEmail(existingEmail))
    assert.strictEqual(isAlreadyRegistered, true, 'User with this email already has an account')
  })

  test('6. Non-existent user attempting login is detected and prompted to create account', () => {
    const unknownEmail = `unknown-${Date.now()}@connecta.ng`
    const found = findUserByEmail(unknownEmail)
    assert.strictEqual(found, null, 'Unregistered user must not exist in database')

    // Simulate login verification logic
    const requiresRegistration = !found
    assert.strictEqual(requiresRegistration, true, 'User without account must require registration')
  })
})
