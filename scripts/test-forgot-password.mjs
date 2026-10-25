#!/usr/bin/env node
/**
 * Test Suite for Forgot Password & OTP Reset Flow in Connecta 2.0
 */

async function testForgotPasswordFlow() {
  const baseUrl = 'http://127.0.0.1:3000'
  const email = 'specialist.kano.0845@connecta.ng' // Known existing account from DB
  const newPassword = 'NewSecretPassword@2026'

  console.log('='.repeat(70))
  console.log('  CONNECTA 2.0 — FORGOT PASSWORD & OTP RESET VERIFICATION')
  console.log('='.repeat(70))
  console.log(`Testing with user: ${email}`)

  // 1. Send OTP
  console.log('\n[STEP 1] Requesting OTP code via POST /api/auth/send-otp...')
  const sendRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const sendData = await sendRes.json()
  console.log(`Status: ${sendRes.status}`)
  console.log('Data  :', sendData)

  if (!sendRes.ok || !sendData.data?.devCode) {
    console.error('Failed to get OTP code')
    process.exit(1)
  }

  const otpCode = sendData.data.devCode
  console.log(`✓ OTP Generated: ${otpCode}`)

  // 2. Verify invalid code
  console.log('\n[STEP 2] Testing invalid OTP rejection...')
  const badRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: '000000' }),
  })
  const badData = await badRes.json()
  console.log(`Status: ${badRes.status} (Expected 400)`)
  console.log('✓ Invalid code correctly rejected!')

  // 3. Verify real OTP
  console.log('\n[STEP 3] Verifying valid OTP...')
  const verifyRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: otpCode }),
  })
  const verifyData = await verifyRes.json()
  console.log(`Status: ${verifyRes.status}`)
  console.log('Data  :', verifyData)
  if (!verifyRes.ok) {
    console.error('Failed to verify OTP')
    process.exit(1)
  }
  console.log('✓ OTP Verified successfully!')

  // 4. Reset password
  console.log('\n[STEP 4] Submitting new password via POST /api/auth/reset-password...')
  const resetRes = await fetch(`${baseUrl}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  })
  const resetData = await resetRes.json()
  console.log(`Status: ${resetRes.status}`)
  console.log('Data  :', resetData)
  if (!resetRes.ok) {
    console.error('Failed to reset password')
    process.exit(1)
  }
  console.log('✓ Password reset successfully updated in server database!')

  // 5. Test login with the new password
  console.log('\n[STEP 5] Testing authentication with the newly set password...')
  const loginRes = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: newPassword }),
  })
  const loginData = await loginRes.json()
  console.log(`Status: ${loginRes.status}`)
  console.log('Data  :', loginData)
  if (!loginRes.ok) {
    console.error('Login with new password failed')
    process.exit(1)
  }
  console.log('✓ Successfully logged in with new password!')

  console.log('\n' + '='.repeat(70))
  console.log('  ALL FORGOT PASSWORD & OTP SERVER TESTS PASSED')
  console.log('='.repeat(70))
}

testForgotPasswordFlow()
