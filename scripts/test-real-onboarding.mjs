#!/usr/bin/env node
/**
 * End-to-End Test Suite for Real Onboarding & Authentication
 * Connecta 2.0
 */

async function runTestSuite() {
  const baseUrl = 'http://127.0.0.1:3000'
  const testEmail = `specialist.kano.${Date.now().toString().slice(-4)}@connecta.ng`
  const testPassword = 'Password@Solar2026'

  console.log('='.repeat(70))
  console.log('  CONNECTA 2.0 — REAL SERVER ONBOARDING & AUTH TEST SUITE')
  console.log('='.repeat(70))
  console.log(`Target Email: ${testEmail}`)

  // --------------------------------------------------------------------------
  // TEST 1: Dispatch Real Server OTP
  // --------------------------------------------------------------------------
  console.log('\n[TEST 1] Testing POST /api/auth/send-otp...')
  let otpCode = null

  try {
    const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })

    const body = await res.json()
    console.log(`HTTP Status: ${res.status}`)
    console.log('Response   :', body)

    if (res.status === 200 && body.success) {
      console.log('✓ Real Server OTP Generated Successfully!')
      otpCode = body.data?.devCode
    } else {
      throw new Error(`Failed to send OTP: ${JSON.stringify(body)}`)
    }
  } catch (err) {
    console.error('✗ Test 1 Failed:', err.message)
    process.exit(1)
  }

  // --------------------------------------------------------------------------
  // TEST 2: Reject Invalid OTP
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing POST /api/auth/verify-otp with INVALID code (000000)...')
  try {
    const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, code: '000000' }),
    })

    const body = await res.json()
    console.log(`HTTP Status: ${res.status} (Expected 400 rejection)`)
    console.log('Response   :', body)

    if (res.status === 400 && !body.success) {
      console.log('✓ Invalid OTP code rejected correctly by server!')
    } else {
      throw new Error(`Server did not reject invalid code: ${JSON.stringify(body)}`)
    }
  } catch (err) {
    console.error('✗ Test 2 Failed:', err.message)
    process.exit(1)
  }

  // --------------------------------------------------------------------------
  // TEST 3: Verify Valid Real OTP
  // --------------------------------------------------------------------------
  console.log(`\n[TEST 3] Testing POST /api/auth/verify-otp with REAL code (${otpCode})...`)
  try {
    const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, code: otpCode }),
    })

    const body = await res.json()
    console.log(`HTTP Status: ${res.status}`)
    console.log('Response   :', body)

    if (res.status === 200 && body.success && body.data?.verified) {
      console.log('✓ Email address verified successfully by real server!')
    } else {
      throw new Error(`Verification failed: ${JSON.stringify(body)}`)
    }
  } catch (err) {
    console.error('✗ Test 3 Failed:', err.message)
    process.exit(1)
  }

  // --------------------------------------------------------------------------
  // TEST 4: Real Account Provisioning in /api/onboarding
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing POST /api/onboarding (Real Specialist Account Provisioning)...')
  try {
    const payload = {
      role: 'provider',
      firstName: 'Kabir',
      lastName: 'Gwadabe',
      email: testEmail,
      phone: '+2348039911223',
      whatsapp: '+2348039911223',
      password: testPassword,
      country: 'Nigeria',
      currency: 'NGN',
      city: 'Kano',
      businessName: 'Gwadabe Advanced Solar & Energy Solutions',
      headline: 'Commercial Solar & Battery Inverter Lead Specialist',
      bio: 'Providing 24/7 clean solar backup and three-phase industrial distributions in Kano.',
      primaryCategory: 'Solar & Electrical Power',
      skills: ['Solar Inverters', 'Industrial Three-Phase', 'Surge Arresters'],
      hourlyRate: '18000',
      ninNumber: 'NIN-9928374610',
      workshopAddress: 'Plot 12 Kawaji Industrial Area, Nassarawa, Kano',
    }

    const res = await fetch(`${baseUrl}/api/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await res.json()
    console.log(`HTTP Status: ${res.status}`)
    console.log('Response   :', body)

    if (res.status === 201 && body.success) {
      console.log('✓ Real Specialist Provisioned on Server!')
      console.log('  - Account ID   :', body.data.id)
      console.log('  - Welcome Sparks:', body.data.welcomeSparks, '⚡')
    } else {
      throw new Error(`Onboarding provisioning failed: ${JSON.stringify(body)}`)
    }
  } catch (err) {
    console.error('✗ Test 4 Failed:', err.message)
    process.exit(1)
  }

  // --------------------------------------------------------------------------
  // TEST 5: Real Server Login with Provisioned Account
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing POST /api/auth/login with newly provisioned credentials...')
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    })

    const body = await res.json()
    console.log(`HTTP Status: ${res.status}`)
    console.log('Response   :', body)

    if (res.status === 200 && body.success) {
      console.log('✓ Successfully authenticated against server login endpoint!')
      console.log('  - Authenticated User:', body.data.fullName)
      console.log('  - User Role        :', body.data.role)
      console.log('  - City Hub         :', body.data.city)
    } else {
      throw new Error(`Login failed: ${JSON.stringify(body)}`)
    }
  } catch (err) {
    console.error('✗ Test 5 Failed:', err.message)
    process.exit(1)
  }

  console.log('\n' + '='.repeat(70))
  console.log('  ALL 5 REAL SERVER ONBOARDING & AUTH TESTS PASSED (100% NO DEMO)')
  console.log('='.repeat(70))
}

runTestSuite()
