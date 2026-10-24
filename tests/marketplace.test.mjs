import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// 1. Quote Minor Units Calculation Logic
function calculateQuoteTotal({ lineItems, laborMinor, materialsMinor, visitFeeMinor, discountMinor }) {
  const itemsTotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPriceMinor, 0)
  const total = itemsTotal + laborMinor + materialsMinor + visitFeeMinor - discountMinor
  if (total < 0) throw new Error('Quote total cannot be negative')
  return total
}

// 2. Booking State Machine Logic
const VALID_TRANSITIONS = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['provider_en_route', 'cancelled'],
  provider_en_route: ['in_progress', 'cancelled'],
  in_progress: ['completion_submitted', 'disputed'],
  completion_submitted: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  disputed: ['completed', 'cancelled'],
}

function transitionBookingStatus(currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || []
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from '${currentStatus}' to '${newStatus}'`)
  }
  return newStatus
}

// 3. Media Validation Logic
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_BYTES = 10 * 1024 * 1024

function validateMedia(mime, sizeBytes) {
  if (!ALLOWED_MIME.includes(mime)) {
    throw new Error('Unsupported MIME type')
  }
  if (sizeBytes > MAX_BYTES) {
    throw new Error('File exceeds 10MB limit')
  }
  return true
}

// 4. Review Eligibility
function validateReviewEligibility(bookingStatus, existingReviewExists) {
  if (bookingStatus !== 'completed') {
    throw new Error('Booking must be completed to leave a review')
  }
  if (existingReviewExists) {
    throw new Error('Review already submitted for this booking')
  }
  return true
}

describe('Connecta 2.0 Marketplace Logic Tests', () => {
  test('Quote calculations in kobo integer minor units', () => {
    const quote = {
      lineItems: [
        { description: 'Replacement Pipe', quantity: 2, unitPriceMinor: 250000 }, // ₦5,000
        { description: 'Sealant Tape', quantity: 1, unitPriceMinor: 100000 },      // ₦1,000
      ],
      laborMinor: 500000,     // ₦5,000
      materialsMinor: 0,
      visitFeeMinor: 200000,   // ₦2,000
      discountMinor: 50000,    // ₦500
    }

    const total = calculateQuoteTotal(quote)
    // 500,000 + 100,000 + 500,000 + 200,000 - 50,000 = 1,250,000 kobo (₦12,500)
    assert.equal(total, 1250000)
  })

  test('Booking state machine: valid happy path', () => {
    let status = 'pending_confirmation'
    status = transitionBookingStatus(status, 'confirmed')
    assert.equal(status, 'confirmed')

    status = transitionBookingStatus(status, 'provider_en_route')
    assert.equal(status, 'provider_en_route')

    status = transitionBookingStatus(status, 'in_progress')
    assert.equal(status, 'in_progress')

    status = transitionBookingStatus(status, 'completion_submitted')
    assert.equal(status, 'completion_submitted')

    status = transitionBookingStatus(status, 'completed')
    assert.equal(status, 'completed')
  })

  test('Booking state machine: rejects skipping completion submission', () => {
    assert.throws(
      () => transitionBookingStatus('in_progress', 'completed'),
      /Invalid transition from 'in_progress' to 'completed'/
    )
  })

  test('Review eligibility rules', () => {
    // Should fail if in progress
    assert.throws(
      () => validateReviewEligibility('in_progress', false),
      /Booking must be completed/
    )

    // Should fail if duplicate
    assert.throws(
      () => validateReviewEligibility('completed', true),
      /Review already submitted/
    )

    // Should succeed if completed and first review
    assert.equal(validateReviewEligibility('completed', false), true)
  })

  test('Media upload constraints: 10MB limit and MIME validation', () => {
    assert.equal(validateMedia('image/jpeg', 5 * 1024 * 1024), true)

    assert.throws(
      () => validateMedia('application/x-executable', 1024),
      /Unsupported MIME type/
    )

    assert.throws(
      () => validateMedia('image/png', 15 * 1024 * 1024),
      /File exceeds 10MB limit/
    )
  })
})
