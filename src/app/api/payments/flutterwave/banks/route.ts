import { NextRequest } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { successResponse, errorResponse } from '@/lib/api/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || 'NG'

    const banks = await flutterwaveService.getBankList(country)
    return successResponse(banks, 200)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch bank list', 500)
  }
}
