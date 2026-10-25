import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getOrCreateWallet,
  updateWalletBalance,
  addTransaction,
} from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const { amountMinor, bankName, accountNumber } = body

    if (!amountMinor || amountMinor <= 0) {
      return errorResponse('Valid withdrawal amount is required', 422)
    }

    const amount = Number(amountMinor)
    const wallet = getOrCreateWallet(user.id, 0, user.currency)

    if (wallet.balanceMinor < amount) {
      return errorResponse('Insufficient available balance for withdrawal', 400)
    }

    // Deduct from available balance
    const updatedWallet = updateWalletBalance(user.id, -amount, 0)

    // Record transaction
    const tx = addTransaction({
      userId: user.id,
      title: `Bank Transfer Payout (${bankName || 'Verified Bank'} - ${accountNumber ? accountNumber.slice(-4) : '••••'})`,
      type: 'withdrawal',
      amountMinor: amount,
      currency: user.currency || 'NGN',
      status: 'completed',
      reference: `WIT-${Date.now().toString().slice(-8)}`,
    })

    return successResponse({
      message: 'Withdrawal successfully initiated to your verified bank account!',
      wallet: updatedWallet,
      transaction: tx,
    }, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Withdrawal failed', 500)
  }
}
