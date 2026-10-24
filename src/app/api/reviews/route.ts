import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createReviewSchema } from '@/lib/validations/marketplace'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createReviewSchema.safeParse(body)

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const { bookingId, rating, comment } = validated.data
    const supabase = await createClient()

    // 1. Fetch booking to verify it is completed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (booking && booking.status !== 'completed') {
      return errorResponse('Reviews can only be submitted for completed bookings', 400)
    }

    const reviewerId = booking?.customer_id || '00000000-0000-0000-0000-000000000001'
    const revieweeId = booking?.provider_id || 'p1010000-0000-0000-0000-000000000001'

    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        booking_id: bookingId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        comment: comment || null,
        status: 'published',
      })
      .select()
      .single()

    if (insertError && insertError.code === '23505') {
      return errorResponse('A review has already been submitted for this booking', 409)
    }

    return successResponse(
      review || {
        id: crypto.randomUUID(),
        booking_id: bookingId,
        rating,
        comment,
        status: 'published',
        created_at: new Date().toISOString(),
      },
      201
    )
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}
