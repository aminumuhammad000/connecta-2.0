import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createReviewSchema } from '@/lib/validations/marketplace'
import { addPublicProviderReview, getPublicProviderById } from '@/lib/server/providers'
import { getActiveUser } from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')

    if (!providerId) {
      return errorResponse('providerId query parameter is required', 400)
    }

    const provider = getPublicProviderById(providerId)
    if (!provider) {
      return errorResponse('Provider not found', 404)
    }

    return successResponse({
      reviews: provider.reviews,
      averageRating: provider.averageRating,
      reviewCount: provider.reviewCount,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch reviews', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Direct Public Profile Review (When providerId is submitted)
    if (body.providerId) {
      const user = await getActiveUser()
      if (!user) {
        return errorResponse('You must have an active Connecta account to submit a review.', 401)
      }

      const rating = Number(body.rating)
      if (!rating || rating < 1 || rating > 5) {
        return errorResponse('Rating must be between 1 and 5 stars.', 400)
      }

      const comment = typeof body.comment === 'string' ? body.comment.trim() : ''
      if (comment.length < 5) {
        return errorResponse('Please provide a review comment with at least 5 characters.', 400)
      }

      const projectTitle =
        typeof body.projectTitle === 'string' && body.projectTitle.trim()
          ? body.projectTitle.trim()
          : 'Verified Service Milestone'

      const authorName = user.fullName || user.email?.split('@')[0] || 'Verified Client'

      const newReview = addPublicProviderReview(body.providerId, {
        authorName,
        rating,
        comment,
        projectTitle,
      })

      return successResponse(newReview, 201)
    }

    // 2. Booking-based Milestone Review
    const validated = createReviewSchema.safeParse(body)
    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const { bookingId, rating, comment } = validated.data
    const supabase = await createClient()

    // Fetch booking to verify it is completed
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (booking && booking.status !== 'completed') {
      return errorResponse('Reviews can only be submitted for completed bookings', 400)
    }

    const reviewerId = booking?.customer_id || '00000000-0000-0000-0000-000000000001'
    const revieweeId = booking?.provider_id || 'b2010000-0000-0000-0000-000000000001'

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
