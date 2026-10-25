import { NextRequest, NextResponse } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'

export async function POST(request: NextRequest) {
  try {
    const signature =
      request.headers.get('verif-hash') || request.headers.get('x-flutterwave-signature')

    if (!flutterwaveService.verifyWebhookHash(signature)) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 })
    }

    const payload = await request.json()
    console.log(`[Flutterwave Webhook] Event: ${payload.event}, Status: ${payload.data?.status}, Ref: ${payload.data?.tx_ref}`)

    return NextResponse.json({ status: 'success', received: true }, { status: 200 })
  } catch (err: any) {
    console.error('[Flutterwave Webhook Error]', err)
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 })
  }
}
