import { createClient } from './supabase/client'

export function subscribeToBookingUpdates(
  bookingId: string,
  onUpdate: (payload: { newStatus: string; eventType: string }) => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`booking:${bookingId}`)
    .on(
      'broadcast',
      { event: 'booking_status_change' },
      ({ payload }) => {
        onUpdate(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: any) => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'broadcast',
      { event: 'new_message' },
      ({ payload }) => {
        onNewMessage(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
