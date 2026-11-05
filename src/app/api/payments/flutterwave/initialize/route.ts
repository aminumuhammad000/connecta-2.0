import { NextRequest } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser } from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    const body = await request.json()
    const rawAmount = body.amount ?? (body.amountMinor ? body.amountMinor / 100 : undefined)
    const amount = Number(rawAmount)

    if (!amount || amount <= 0) {
      return errorResponse('Valid deposit amount is required', 400)
    }

    const isEscrow = Boolean(body.isEscrow || body.isEscrowDeposit)
    const txRef = `CN${isEscrow ? 'ESC' : 'DEP'}${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const origin = request.headers.get('origin') || request.nextUrl.origin || 'http://localhost:3000'
    const finalRedirectUrl = body.redirectUrl || `${origin}/dashboard/payment`

    const email = body.email || user?.email || 'customer@myconnecta.ng'
    const name = body.name || user?.fullName || 'Connecta Member'
    const phone = body.phone || user?.phone || ''
    const currency = (body.currency || user?.currency || 'NGN').toUpperCase()

    const result = await flutterwaveService.initializePayment({
      txRef,
      amount,
      currency,
      email,
      name,
      phone,
      redirectUrl: finalRedirectUrl,
      title: body.title || (isEscrow ? 'Connecta Milestone Vault Safeguard' : 'Connecta Wallet Deposit'),
      description: body.description || `Funding wallet with ${currency} ${amount.toLocaleString()}`,
    })

    if (!result?.data?.link) {
      return errorResponse(result?.message || 'Failed to initialize payment checkout with Flutterwave', 502)
    }

    return successResponse(
      {
        link: result.data.link,
        txRef,
        amount,
        currency,
      },
      200
    )
  } catch (err: any) {
    return errorResponse(err.message || 'Payment initialization failed', 500)
  }
}
