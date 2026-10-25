import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getOrCreateWallet,
  getUserTransactions,
} from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const wallet = getOrCreateWallet(user.id, user.activeRole === 'provider' ? 10 : 25, user.currency)
    const transactions = getUserTransactions(user.id)

    return successResponse({
      wallet: {
        id: wallet.id,
        balanceMinor: wallet.balanceMinor,
        escrowBalanceMinor: wallet.escrowBalanceMinor,
        sparksBalance: wallet.sparksBalance,
        currency: wallet.currency,
      },
      transactions,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch wallet', 500)
  }
}
