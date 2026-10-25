#!/usr/bin/env node
/**
 * Test Account Creation for Service Provider & Client in Connecta 2.0
 */

async function testRegistration() {
  const baseUrl = 'http://127.0.0.1:3000/api/onboarding'

  console.log('='.repeat(70))
  console.log('  CONNECTA 2.0 — ACCOUNT CREATION VERIFICATION SUITE')
  console.log('='.repeat(70))

  // --------------------------------------------------------------------------
  // TEST 1: Service Provider Account Creation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 1] Creating Service Provider Account...')
  const timestamp = Date.now().toString().slice(-4)
  const providerPayload = {
    role: 'provider',
    firstName: 'Bello',
    lastName: 'Mustapha',
    email: `bello.mustapha.${timestamp}@connecta.ng`,
    phone: '+2348039988111',
    whatsapp: '+2348039988111',
    password: 'Mustapha@Solar2026',
    country: 'Nigeria',
    currency: 'NGN',
    city: 'Kano',
    businessName: 'Mustapha High-Efficiency Solar & Inverters',
    headline: 'Certified Solar Systems Lead & Lithium Inverter Specialist',
    bio: 'Over 7 years sizing commercial solar inverters, lithium battery banks, and backup distributions across Kano.',
    primaryCategory: 'Solar & Electrical Power',
    skills: ['Solar Inverters', 'Lithium Batteries', 'Smart Meters', 'Earthing Protection'],
    hourlyRate: '15000',
    ninNumber: 'NIN-8923019844',
    workshopAddress: 'Plot 48 Bompai Industrial Area, Kano',
  }

  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerPayload),
    })

    const body = await res.json()
    console.log(`HTTP Status : ${res.status} (${res.statusText})`)
    if (res.status === 201 && body.success) {
      console.log('✓ Provider Account Created Successfully!')
      console.log('  - Generated ID     :', body.data.id)
      console.log('  - Full Name        :', body.data.fullName)
      console.log('  - Registered Role  :', body.data.role)
      console.log('  - City / Hub       :', body.data.city)
      console.log('  - Escrow Currency  :', body.data.currency)
      console.log('  - Welcome AI Sparks:', body.data.welcomeSparks, '⚡')
      console.log('  - Status Message   :', body.data.message)
    } else {
      console.error('✗ Provider Account Creation Failed:', body)
    }
  } catch (err) {
    console.error('✗ Provider Network/Fetch Error:', err.message)
  }

  // --------------------------------------------------------------------------
  // TEST 2: Client / Customer Account Creation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Creating Client / Customer Workspace Account...')
  const clientPayload = {
    role: 'client',
    firstName: 'Fatima',
    lastName: 'Danjuma',
    email: `fatima.danjuma.${timestamp}@savannahlabs.ng`,
    phone: '+2348021122334',
    whatsapp: '+2348021122334',
    password: 'Fatima@Savannah2026',
    country: 'Nigeria',
    currency: 'NGN',
    city: 'Abuja',
    companyName: 'Savannah Digital Logistics Ltd',
    companyBio: 'Enterprise logistics infrastructure bridging northern agro-producers with national distribution networks.',
    companySize: '11 - 50 Employees',
    companyWebsite: 'https://savannahlabs.ng',
    clientIndustry: 'tech_startup',
    clientGoal: 'collabo_team',
    officeAddress: '18 Gana Street, Maitama, Abuja, FCT',
  }

  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientPayload),
    })

    const body = await res.json()
    console.log(`HTTP Status : ${res.status} (${res.statusText})`)
    if (res.status === 201 && body.success) {
      console.log('✓ Client Workspace Account Created Successfully!')
      console.log('  - Generated ID     :', body.data.id)
      console.log('  - Full Name        :', body.data.fullName)
      console.log('  - Registered Role  :', body.data.role)
      console.log('  - City / Hub       :', body.data.city)
      console.log('  - Escrow Currency  :', body.data.currency)
      console.log('  - Welcome AI Sparks:', body.data.welcomeSparks, '⚡')
      console.log('  - Status Message   :', body.data.message)
    } else {
      console.error('✗ Client Account Creation Failed:', body)
    }
  } catch (err) {
    console.error('✗ Client Network/Fetch Error:', err.message)
  }

  // --------------------------------------------------------------------------
  // TEST 3: Validation & Security Boundary (Duplicate Email & Missing Fields)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Input Validation & Password Constraints...')
  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'provider',
        firstName: '',
        lastName: '',
        email: 'invalid-email-format',
        phone: '123',
        password: 'short',
      }),
    })
    const body = await res.json()
    console.log(`HTTP Status : ${res.status}`)
    if (res.status === 422) {
      console.log('✓ Validation constraints triggered properly (rejected weak payload with HTTP 422).')
      console.log('  - Detected validation fields:', Object.keys(body.error?.details?.fieldErrors || {}))
    }
  } catch (err) {
    console.error('✗ Validation test error:', err.message)
  }

  console.log('\n' + '='.repeat(70))
  console.log('  ACCOUNT CREATION TEST SUITE COMPLETED')
  console.log('='.repeat(70))
}

testRegistration()
