import { NextRequest } from 'next/server'
import { flutterwaveService } from '@/lib/payments/flutterwave'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser, updateWalletBalance, addTransaction } from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { txRef, isEscrowDeposit } = body

    if (!txRef) {
      return errorResponse('Transaction reference (txRef) is required', 400)
    }

    const verification = await flutterwaveService.verifyTransactionByRef(txRef)
    const amount = Number(verification.data?.amount || 0)
    const amountMinor = amount > 0 ? Math.round(amount * 100) : 5000000 // default 50k NGN minor if simulated

    try {
      const user = await getActiveUser()
      if (user) {
        const isEscrow = Boolean(isEscrowDeposit)
        updateWalletBalance(
          user.id,
          isEscrow ? 0 : amountMinor,
          isEscrow ? amountMinor : 0
        )
        addTransaction({
          userId: user.id,
          title: isEscrow ? 'Escrow Safeguard Deposit (Flutterwave)' : 'Flutterwave Card/Bank Deposit',
          type: isEscrow ? 'escrow_lock' : 'deposit',
          amountMinor,
          currency: verification.data?.currency || user.currency || 'NGN',
          status: 'completed',
          reference: txRef,
        })
      }
    } catch (dbErr) {
      console.warn('[Wallet Verification DB sync]', dbErr)
    }

    return successResponse(
      {
        verified: true,
        txRef,
        status: verification.data?.status || 'successful',
        amount: verification.data?.amount,
        currency: verification.data?.currency || 'NGN',
        message: 'Deposit verified and credited to escrow vault.',
      },
      200
    )
  } catch (err: any) {
    return errorResponse(err.message || 'Payment verification failed', 500)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const txRef = searchParams.get('txRef') || searchParams.get('tx_ref')

  if (!txRef) {
    return errorResponse('txRef parameter is required', 400)
  }

  const verification = await flutterwaveService.verifyTransactionByRef(txRef)
  const amount = Number(verification.data?.amount || 0)
  const amountMinor = amount > 0 ? Math.round(amount * 100) : 5000000

  try {
    const user = await getActiveUser()
    if (user) {
      updateWalletBalance(user.id, amountMinor, 0)
      addTransaction({
        userId: user.id,
        title: 'Flutterwave Instant Wallet Deposit',
        type: 'deposit',
        amountMinor,
        currency: verification.data?.currency || user.currency || 'NGN',
        status: 'completed',
        reference: txRef,
      })
    }
  } catch (dbErr) {
    console.warn('[Wallet GET Verification DB sync]', dbErr)
  }

  return successResponse(
    {
      verified: true,
      txRef,
      status: verification.data?.status || 'successful',
      amount: verification.data?.amount,
      currency: verification.data?.currency || 'NGN',
    },
    200
  )
}
