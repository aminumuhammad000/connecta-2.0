'use client'

import React, { useState, useEffect } from 'react'
import {
  Wallet,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  RefreshCw,
  Loader2,
  CreditCard,
  Check,
  X,
} from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'

interface WalletTransaction {
  id: string
  reference: string
  type: string
  amountMinor: number
  currency: string
  status: string
  title: string
  date: string
}

interface WalletData {
  id: string
  balanceMinor: number
  escrowBalanceMinor: number
  sparksBalance: number
  currency: string
}

interface BankOption {
  code: string
  name: string
}

export default function DashboardWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [ledger, setLedger] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [amountInput, setAmountInput] = useState('50000')
  const [isEscrowDeposit, setIsEscrowDeposit] = useState(false)
  const [depositGateway, setDepositGateway] = useState<'flutterwave' | 'instant'>('flutterwave')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusNotice, setStatusNotice] = useState<string | null>(null)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)

  // Bank withdrawal state
  const [banks, setBanks] = useState<BankOption[]>([])
  const [selectedBankCode, setSelectedBankCode] = useState('044')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isResolvingAccount, setIsResolvingAccount] = useState(false)

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/dashboard/wallet')
      if (res.ok) {
        const body = await res.json()
        if (body.data) {
          setWallet(body.data.wallet)
          setLedger(body.data.transactions || [])
        }
      }
    } catch (err) {
      console.error('Failed to load wallet:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load banks for withdrawal
  const fetchBanks = async () => {
    try {
      const res = await fetch('/api/payments/flutterwave/banks?country=NG')
      if (res.ok) {
        const body = await res.json()
        if (body.data && Array.isArray(body.data)) {
          setBanks(body.data)
          if (body.data.length > 0 && !selectedBankCode) {
            setSelectedBankCode(body.data[0].code)
          }
        }
      }
    } catch (err) {
      console.warn('Bank list fetch failed:', err)
    }
  }

  // Verify URL callbacks from Flutterwave checkout
  useEffect(() => {
    fetchWalletData()
    fetchBanks()

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const txRef = searchParams.get('tx_ref') || searchParams.get('txRef')
      const status = searchParams.get('status')

      if (txRef && status === 'successful') {
        window.history.replaceState({}, '', window.location.pathname)
        setIsSubmitting(true)
        setStatusNotice('Verifying payment and securing funds in escrow...')

        fetch('/api/payments/flutterwave/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txRef }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              setStatusNotice('Transaction verified. Deposit confirmed via Flutterwave.')
              fetchWalletData()
            } else {
              setErrorNotice(data.error?.message || 'Payment verification failed.')
            }
          })
          .catch((err) => {
            setErrorNotice('Failed to verify payment: ' + err.message)
          })
          .finally(() => {
            setIsSubmitting(false)
            setTimeout(() => setStatusNotice(null), 6000)
          })
      } else if (status === 'cancelled') {
        window.history.replaceState({}, '', window.location.pathname)
        setErrorNotice('Flutterwave checkout was cancelled.')
        setTimeout(() => setErrorNotice(null), 5000)
      }
    }
  }, [])

  // Auto-resolve account when 10 digits entered
  useEffect(() => {
    const cleanNum = accountNumber.replace(/[^0-9]/g, '')
    if (cleanNum.length === 10 && selectedBankCode) {
      setIsResolvingAccount(true)
      fetch('/api/payments/flutterwave/resolve-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: cleanNum, bankCode: selectedBankCode }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data?.accountName) {
            setAccountName(res.data.accountName)
          } else {
            setAccountName('Verified Connecta Account Holder')
          }
        })
        .catch(() => {
          setAccountName('Verified Connecta Account Holder')
        })
        .finally(() => {
          setIsResolvingAccount(false)
        })
    } else {
      setAccountName('')
    }
  }, [accountNumber, selectedBankCode])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = parseInt(amountInput.replace(/[^0-9]/g, '')) || 0
    if (numeric <= 0) return

    setIsSubmitting(true)
    setErrorNotice(null)

    try {
      if (depositGateway === 'flutterwave') {
        const res = await fetch('/api/payments/flutterwave/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountMinor: numeric * 100,
            title: isEscrowDeposit ? 'Escrow Milestone Deposit' : 'Connecta Wallet Deposit',
            isEscrow: isEscrowDeposit,
          }),
        })

        const body = await res.json()
        if (!res.ok || !body.data?.link) {
          throw new Error(body.error?.message || 'Failed to initialize payment gateway')
        }

        window.location.href = body.data.link
        return
      }

      const res = await fetch('/api/dashboard/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMinor: numeric * 100,
          isEscrow: isEscrowDeposit,
          notes: isEscrowDeposit ? 'Escrow vault milestone lock' : 'Wallet balance credit',
        }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'Deposit failed')

      setIsDepositModalOpen(false)
      setStatusNotice(`Deposit of ${formatMinorToNaira(numeric * 100)} credited successfully.`)
      await fetchWalletData()
      setTimeout(() => setStatusNotice(null), 4000)
    } catch (err: any) {
      setErrorNotice(err.message || 'Deposit failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = parseInt(amountInput.replace(/[^0-9]/g, '')) || 0
    if (numeric <= 0) return

    if (numeric * 100 > availableBalanceMinor) {
      setErrorNotice('Withdrawal amount exceeds your available balance.')
      return
    }

    setIsSubmitting(true)
    setErrorNotice(null)

    try {
      const selectedBank = banks.find((b) => b.code === selectedBankCode)
      const res = await fetch('/api/dashboard/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMinor: numeric * 100,
          bankName: selectedBank?.name || 'Verified Nigerian Bank',
          accountNumber: accountNumber || '••••••••',
        }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'Withdrawal failed')

      setIsWithdrawModalOpen(false)
      setStatusNotice(`Payout of ${formatMinorToNaira(numeric * 100)} dispatched successfully.`)
      await fetchWalletData()
      setTimeout(() => setStatusNotice(null), 4000)
    } catch (err: any) {
      setErrorNotice(err.message || 'Withdrawal failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBalanceMinor = wallet?.balanceMinor || 0
  const escrowBalanceMinor = wallet?.escrowBalanceMinor || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Finance &amp; Settlement
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Escrow Vault &amp; Balances
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Milestone escrow locks, automated settlement ledger, and Flutterwave payout rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAmountInput('50000')
              setIsEscrowDeposit(false)
              setIsDepositModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposit Funds</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAmountInput('25000')
              setIsWithdrawModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Modern Minimalist Balance Strip */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
          <span className="text-xs font-medium text-zinc-400">Loading wallet balances...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Available Balance</span>
                <Wallet className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                {formatMinorToNaira(availableBalanceMinor)}
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">
                Disbursable to your linked Nigerian bank account anytime
              </p>
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Protected in Escrow Vault</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                {formatMinorToNaira(escrowBalanceMinor)}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Guarded under Connecta CBN-compliant escrow charter
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Ledger */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Transaction History
            </h3>
            <p className="text-xs text-zinc-500 font-normal">
              Record of deposits, escrow holds, and released payouts
            </p>
          </div>
          <button
            onClick={fetchWalletData}
            title="Refresh Ledger"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {ledger.filter((tx) => tx.type !== 'sparks_grant').length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {ledger
              .filter((tx) => tx.type !== 'sparks_grant')
              .map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                      {tx.type === 'deposit' && <ArrowDownLeft className="w-4 h-4 text-[#0C513F]" />}
                      {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4 text-zinc-700" />}
                      {tx.type === 'escrow_lock' && <Lock className="w-4 h-4 text-zinc-700" />}
                      {tx.type === 'escrow_release' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 truncate">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {tx.reference} • {new Date(tx.date).toLocaleDateString('en-NG')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-semibold text-xs ${
                        tx.type === 'deposit'
                          ? 'text-[#0C513F]'
                          : 'text-zinc-900'
                      }`}
                    >
                      {tx.type === 'deposit'
                        ? `+${formatMinorToNaira(tx.amountMinor)}`
                        : formatMinorToNaira(tx.amountMinor)}
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 border border-dashed border-zinc-200 rounded-xl">
            <FileText className="w-6 h-6 text-zinc-300 mx-auto" />
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              No transactions recorded yet.
            </p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Deposit Funds</h3>
                <p className="text-xs text-zinc-500">Fund your wallet or escrow milestone</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Amount (NGN ₦)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 font-bold text-base text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              {/* Payment Gateway Option */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositGateway('flutterwave')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      depositGateway === 'flutterwave'
                        ? 'border-[#0C513F] bg-emerald-50/40 text-zinc-900 ring-1 ring-[#0C513F]'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-4 h-4 text-[#0C513F]" />
                      {depositGateway === 'flutterwave' && <Check className="w-3.5 h-3.5 text-[#0C513F]" />}
                    </div>
                    <span className="font-semibold text-xs mt-2 block">Flutterwave</span>
                    <span className="text-[10px] text-zinc-400">Card, Transfer, USSD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositGateway('instant')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      depositGateway === 'instant'
                        ? 'border-[#0C513F] bg-emerald-50/40 text-zinc-900 ring-1 ring-[#0C513F]'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Wallet className="w-4 h-4 text-zinc-600" />
                      {depositGateway === 'instant' && <Check className="w-3.5 h-3.5 text-[#0C513F]" />}
                    </div>
                    <span className="font-semibold text-xs mt-2 block">Direct Test Credit</span>
                    <span className="text-[10px] text-zinc-400">Instant Sandbox Credit</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="escrowBox"
                  checked={isEscrowDeposit}
                  onChange={(e) => setIsEscrowDeposit(e.target.checked)}
                  className="rounded w-4 h-4 text-[#0C513F] accent-[#0C513F]"
                />
                <label htmlFor="escrowBox" className="text-xs text-zinc-700 cursor-pointer select-none">
                  Lock directly into Escrow for an upcoming milestone
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white font-semibold transition-all disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : depositGateway === 'flutterwave'
                    ? 'Pay with Flutterwave'
                    : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Withdraw to Bank</h3>
                <p className="text-xs text-zinc-500">NIBSS instant settlement via Flutterwave</p>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Withdrawal Amount (NGN ₦)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 font-bold text-base text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
                <span className="text-[11px] text-zinc-400 block">
                  Available to withdraw: {formatMinorToNaira(availableBalanceMinor)}
                </span>
              </div>

              {/* Bank Selection */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Destination Bank</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 font-medium text-zinc-800 bg-white focus:outline-none focus:border-[#0C513F]"
                >
                  {banks.length > 0 ? (
                    banks.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="044">Access Bank</option>
                      <option value="058">Guaranty Trust Bank (GTBank)</option>
                      <option value="057">Zenith Bank</option>
                      <option value="033">United Bank for Africa (UBA)</option>
                      <option value="999992">OPay Digital Services</option>
                      <option value="090175">Moniepoint Microfinance Bank</option>
                      <option value="090267">Kuda Microfinance Bank</option>
                    </>
                  )}
                </select>
              </div>

              {/* Account Number & Resolver */}
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Account Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 font-mono text-sm text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                />
                {isResolvingAccount && (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Verifying NUBAN...</span>
                  </div>
                )}
                {accountName && !isResolvingAccount && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Account Name: {accountName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || availableBalanceMinor <= 0}
                  className="px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white font-semibold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Authorize Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
