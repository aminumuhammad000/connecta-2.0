import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { bookingStatusUpdateSchema } from '@/lib/validations/marketplace'
import { BookingStatus } from '@/types/database'

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['provider_en_route', 'cancelled'],
  provider_en_route: ['in_progress', 'cancelled'],
  in_progress: ['completion_submitted', 'disputed'],
  completion_submitted: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  disputed: ['completed', 'cancelled'],
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const body = await request.json()
    const validated = bookingStatusUpdateSchema.safeParse({
      bookingId,
      ...body,
    })

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const { newStatus, reason, evidenceKeys } = validated.data
    const supabase = await createClient()

    // 1. Fetch current status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    const currentStatus: BookingStatus = (booking?.status as BookingStatus) || 'confirmed'

    // 2. Validate state machine transition
    const allowed = VALID_TRANSITIONS[currentStatus] || []
    if (!allowed.includes(newStatus as BookingStatus)) {
      return errorResponse(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed: [${allowed.join(', ')}]`,
        400
      )
    }

    // 3. Update status in database
    const updatePayload: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    }

    if (newStatus === 'cancelled') {
      updatePayload.cancellation_reason = reason || 'Cancelled by participant'
      updatePayload.cancelled_at = new Date().toISOString()
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', bookingId)
      .select()
      .single()

    // 4. Record audit event in booking_events
    await supabase.from('booking_events').insert({
      booking_id: bookingId,
      actor_id: booking?.customer_id || '00000000-0000-0000-0000-000000000001',
      event_type: `status_changed_to_${newStatus}`,
      previous_status: currentStatus,
      new_status: newStatus,
      metadata: { reason, evidenceKeys },
    })

    return successResponse({
      bookingId,
      previousStatus: currentStatus,
      newStatus,
      updatedAt: updatePayload.updated_at,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}
