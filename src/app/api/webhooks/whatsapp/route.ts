import { NextRequest, NextResponse } from 'next/server'
import { handleIncomingWhatsAppMessage } from '@/lib/whatsapp/intake'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'connecta_whatsapp_secret_2026'

/**
 * GET: Meta Webhook Challenge Handshake
 * Meta sends hub.mode, hub.challenge, and hub.verify_token to confirm endpoint ownership.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('[WhatsApp Webhook Verification Request]:', { mode, token, challenge })

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook Verified Successfully!]')
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  console.warn('[WhatsApp Webhook Verification Failed]: Token mismatch or invalid mode')
  return new NextResponse('Forbidden', { status: 403 })
}

/**
 * POST: Meta Webhook Event Processor
 * Receives incoming customer messages, delivery statuses, and button clicks.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate that this is a WhatsApp Business Account event
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const entries = body.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []

      for (const change of changes) {
        if (change.field !== 'messages') continue

        const value = change.value
        if (!value) continue

        const contacts = value.contacts || []
        const messages = value.messages || []

        // Process each incoming message
        for (const message of messages) {
          const contact = contacts.find((c: any) => c.wa_id === message.from) || contacts[0]
          try {
            await handleIncomingWhatsAppMessage(message, contact)
          } catch (msgErr: any) {
            console.error('[Error handling message]:', msgErr.message)
          }
        }
      }
    }

    // Always acknowledge 200 OK promptly to Meta
    return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 })
  } catch (err: any) {
    console.error('[WhatsApp Webhook Error]:', err.message)
    // Return 200 to prevent Meta from spamming retries on broken payloads
    return NextResponse.json({ status: 'error', error: err.message }, { status: 200 })
  }
}
