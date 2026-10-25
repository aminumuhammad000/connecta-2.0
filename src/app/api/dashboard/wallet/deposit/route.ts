import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
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
    const { amountMinor, isEscrowDeposit, title } = body

    if (!amountMinor || amountMinor <= 0) {
      return errorResponse('Valid deposit amount is required', 422)
    }

    const amount = Number(amountMinor)
    const isEscrow = Boolean(isEscrowDeposit)

    // Update wallet
    const updatedWallet = updateWalletBalance(
      user.id,
      isEscrow ? 0 : amount,
      isEscrow ? amount : 0
    )

    // Record transaction
    const tx = addTransaction({
      userId: user.id,
      title: title || (isEscrow ? 'Escrow Vault Safeguard Deposit' : 'Direct Wallet Funding'),
      type: isEscrow ? 'escrow_lock' : 'deposit',
      amountMinor: amount,
      currency: user.currency || 'NGN',
      status: 'completed',
      reference: `DEP-${Date.now().toString().slice(-8)}`,
    })

    return successResponse({
      message: 'Deposit confirmed and credited to Connecta Vault!',
      wallet: updatedWallet,
      transaction: tx,
    }, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Deposit failed', 500)
  }
}
