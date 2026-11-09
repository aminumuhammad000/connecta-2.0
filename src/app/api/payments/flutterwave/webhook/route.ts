import { NextRequest, NextResponse } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { getBookingByNumber, updateBooking, addTransaction } from '@/lib/server/db'
import { sendTextMessage } from '@/lib/whatsapp/client'

export async function POST(request: NextRequest) {
  try {
    const signature =
      request.headers.get('verif-hash') || request.headers.get('x-flutterwave-signature')

    if (!flutterwaveService.verifyWebhookHash(signature)) {
      console.warn('[Flutterwave Webhook]: Signature mismatch')
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 })
    }

    const payload = await request.json()
    const data = payload?.data || {}
    const txRef = data.tx_ref || ''
    const status = data.status || ''
    const amount = Number(data.amount || 5000)
    const transactionId = data.id || `flw_${Date.now()}`

    console.log(`[Flutterwave Webhook] Event: ${payload.event}, Status: ${status}, Ref: ${txRef}, Amount: ₦${amount}`)

    if (status === 'successful' || payload.event === 'charge.completed') {
      // Extract booking reference (e.g. from txRef like "CN-KN-1234" or "FLW_CN-2026-6819_1730138")
      const match = txRef.match(/CN-[A-Za-z0-9]+-[A-Za-z0-9]+/)
      const bookingNumber = match ? match[0] : null

      if (bookingNumber) {
        const booking = getBookingByNumber(bookingNumber)
        if (booking) {
          updateBooking(bookingNumber, {
            escrowStatus: 'locked',
            bookingStatus: 'confirmed',
            escrowPaidAt: new Date().toISOString(),
            totalAmountMinor: amount * 100,
          } as any)

          addTransaction({
            userId: booking.customerId,
            title: `Escrow Locked: #${bookingNumber}`,
            type: 'escrow_lock',
            amountMinor: amount * 100,
            currency: 'NGN',
            status: 'completed',
            reference: `FLW-${transactionId}`,
          })

          // Send WhatsApp Payment Receipt to Customer
          const customerPhone = (booking as any).customerPhone
          if (customerPhone) {
            const receipt =
              `🛡️ *Biya Ya Tabbata / Payment Secured in Escrow!* (Ref: *#${bookingNumber}*)\n\n` +
              `✅ An tsare *₦${amount.toLocaleString()}* a cikin Tsaron Escrow na Connecta.\n\n` +
              `📌 *Tsaro:* Kuɗinku na nan a kulle cikin aminci. Ma'aikaci ba zai karɓi ko sisi ba har sai kun duba aikin kuma kun gamsu.\n\n` +
              `Ƙwararren ma'aikacinku *${booking.providerName}* yana nan tafe.`;

            await sendTextMessage(customerPhone, receipt).catch(console.error)
          }

          // Send Escrow Alert to Artisan
          const artisanPhone = (booking as any).artisanPhone || (booking as any).dispatchedArtisanPhone
          if (artisanPhone) {
            const alert =
              `💰 *Kuɗin Aiki Yana Cikin Escrow! / Job Funded!* (Ref: *#${bookingNumber}*)\n\n` +
              `Abokin ciniki ya biya *₦${amount.toLocaleString()}* cikin Connecta Escrow.\n\n` +
              `An ba ku tabbacin samun biya da zarar an kammala aiki kuma abokin ciniki ya duba.`;

            await sendTextMessage(artisanPhone, alert).catch(console.error)
          }
        }
      }
    }

    return NextResponse.json({ status: 'success', received: true }, { status: 200 })
  } catch (err: any) {
    console.error('[Flutterwave Webhook Error]', err)
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 })
  }
}
