import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const eventType = payload?.type

    if (!eventType) {
      return errorResponse('Missing event type in webhook', 400)
    }

    const supabase = await createClient()

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const data = payload.data
      const userId = data.id
      const email = data.email_addresses?.[0]?.email_address || null
      const phone = data.phone_numbers?.[0]?.phone_number || ''
      const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Connecta User'
      const roles = data.public_metadata?.roles || ['customer']

      await supabase.from('profiles').upsert({
        id: userId,
        full_name: fullName,
        email,
        phone,
        roles,
        updated_at: new Date().toISOString(),
      })
    } else if (eventType === 'user.deleted') {
      const userId = payload.data?.id
      if (userId) {
        // Soft delete / mark account status as deleted
        await supabase
          .from('profiles')
          .update({ account_status: 'deleted', updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
    }

    return successResponse({ received: true, event: eventType })
  } catch (err: any) {
    return errorResponse(err.message || 'Webhook processing failed', 500)
  }
}
