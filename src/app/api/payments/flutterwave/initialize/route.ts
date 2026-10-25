import { NextRequest } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, email, name, phone, redirectUrl } = body

    if (!amount || amount <= 0) {
      return errorResponse('Valid deposit amount is required', 400)
    }

    const txRef = `CN_DEP_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    const finalRedirectUrl =
      redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://myconnecta.ng'}/dashboard/wallet`

    const result = await flutterwaveService.initializePayment({
      txRef,
      amount: Number(amount),
      currency: currency || 'NGN',
      email: email || 'user@myconnecta.ng',
      name: name || 'Connecta Member',
      phone: phone || '',
      redirectUrl: finalRedirectUrl,
      title: 'Connecta Escrow Deposit',
      description: `Funding wallet with ${currency || 'NGN'} ${amount}`,
    })

    return successResponse(
      {
        link: result.data?.link,
        txRef,
        amount: Number(amount),
        currency: currency || 'NGN',
      },
      200
    )
  } catch (err: any) {
    return errorResponse(err.message || 'Payment initialization failed', 500)
  }
}
