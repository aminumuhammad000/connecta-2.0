import { NextRequest } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountNumber, bankCode } = body

    if (!accountNumber || !bankCode) {
      return errorResponse('Account number and bank code are required', 400)
    }

    const resolved = await flutterwaveService.resolveAccount(accountNumber, bankCode)
    return successResponse(resolved, 200)
  } catch (err: any) {
    return errorResponse(err.message || 'Account resolution failed', 500)
  }
}
