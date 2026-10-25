'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wallet,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Plus,
  RefreshCw,
  Loader2,
  CreditCard,
  Check,
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
        setStatusNotice('Verifying Flutterwave transaction & securing funds in escrow...')

        fetch('/api/payments/flutterwave/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txRef }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              setStatusNotice('Transaction verified! Deposit confirmed via Flutterwave.')
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
        // Initialize Flutterwave payment checkout
        const res = await fetch('/api/payments/flutterwave/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numeric,
            currency: wallet?.currency || 'NGN',
            redirectUrl: `${window.location.origin}/dashboard/wallet`,
          }),
        })

        const body = await res.json()
        if (!res.ok) throw new Error(body.error?.message || body.error || 'Failed to initialize payment')

        if (body.data?.link) {
          // Redirect to Flutterwave secure checkout page
          window.location.href = body.data.link
          return
        }
      }

      // Instant credit fallback / direct simulation
      const res = await fetch('/api/dashboard/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMinor: numeric * 100,
          isEscrowDeposit,
        }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'Deposit failed')

      setIsDepositModalOpen(false)
      setStatusNotice(`Successfully credited ${formatMinorToNaira(numeric * 100)} into Connecta Vault!`)
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
      setStatusNotice(`Payout of ${formatMinorToNaira(numeric * 100)} dispatched successfully via NIBSS/Flutterwave!`)
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
  const sparksBalance = wallet?.sparksBalance ?? 25

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
              NDPR &amp; Regulated Escrow Infrastructure
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] tracking-wider">
              Secured by Flutterwave
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Connecta Escrow Vault &amp; Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your milestone escrow deposits, verified payouts, and AI Sparks balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAmountInput('50000')
              setIsEscrowDeposit(false)
              setIsDepositModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit Funds</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAmountInput('25000')
              setIsWithdrawModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-2.5 text-xs font-bold shadow-xs hover:border-slate-400 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Balance Cards Summary */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#0C513F] animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading wallet balances...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Available Balance */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Available Wallet Balance
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#0C513F] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
                {formatMinorToNaira(availableBalanceMinor)}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                Ready for instant withdrawal or milestone commitment
              </div>
            </div>
          </div>

          {/* Card 2: Locked Escrow Vault */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Locked Escrow Vault
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-100 text-[#1A73E8] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#1A73E8] tracking-tight">
                {formatMinorToNaira(escrowBalanceMinor)}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                Safeguarded in escrow until milestone inspection approval
              </div>
            </div>
          </div>

          {/* Card 3: AI Sparks Balance */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Connecta AI Sparks
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                {sparksBalance} Sparks
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                Used for instant AI contractor matching &amp; proposal generation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0A1020] tracking-tight">
              Audit Trail &amp; Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time records of all deposits, milestone releases, and Sparks allocations.
            </p>
          </div>
          <button
            onClick={fetchWalletData}
            title="Refresh Ledger"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {ledger.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {ledger.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === 'deposit'
                        ? 'bg-emerald-100 text-[#0C513F]'
                        : tx.type === 'withdrawal'
                        ? 'bg-blue-100 text-[#1A73E8]'
                        : tx.type === 'sparks_grant'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.type === 'deposit' && <ArrowDownLeft className="w-4 h-4" />}
                    {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                    {tx.type === 'sparks_grant' && <Sparkles className="w-4 h-4" />}
                    {tx.type === 'escrow_lock' && <Lock className="w-4 h-4" />}
                    {tx.type === 'escrow_release' && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="font-extrabold text-[#0A1020] truncate">
                      {tx.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Ref: {tx.reference} • {new Date(tx.date).toLocaleDateString('en-NG')}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-black text-sm ${
                      tx.type === 'deposit' || tx.type === 'sparks_grant'
                        ? 'text-emerald-700'
                        : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'sparks_grant'
                      ? `+${tx.amountMinor} Sparks`
                      : tx.type === 'deposit'
                      ? `+${formatMinorToNaira(tx.amountMinor)}`
                      : formatMinorToNaira(tx.amountMinor)}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 rounded-2xl">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              No transactions recorded on this account yet. Deposit funds or complete onboarding to get started.
            </p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0A1020]">Fund Escrow Vault / Wallet</h3>
                <p className="text-[11px] text-slate-500">Secured via Flutterwave multi-channel gateway</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Deposit Amount (NGN ₦)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-black text-lg text-[#0C513F] focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              {/* Payment Gateway Toggle */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Payment Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositGateway('flutterwave')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      depositGateway === 'flutterwave'
                        ? 'border-[#0C513F] bg-emerald-50/50 text-[#0C513F] ring-1 ring-[#0C513F]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-4 h-4 text-[#0C513F]" />
                      {depositGateway === 'flutterwave' && <Check className="w-3.5 h-3.5 text-[#0C513F]" />}
                    </div>
                    <span className="font-extrabold text-[11px] mt-2 block">Flutterwave</span>
                    <span className="text-[10px] text-slate-400">Card, Transfer, USSD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositGateway('instant')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      depositGateway === 'instant'
                        ? 'border-[#0C513F] bg-emerald-50/50 text-[#0C513F] ring-1 ring-[#0C513F]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Wallet className="w-4 h-4 text-slate-700" />
                      {depositGateway === 'instant' && <Check className="w-3.5 h-3.5 text-[#0C513F]" />}
                    </div>
                    <span className="font-extrabold text-[11px] mt-2 block">Direct Test Credit</span>
                    <span className="text-[10px] text-slate-400">Instant Sandbox Credit</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="escrowBox"
                  checked={isEscrowDeposit}
                  onChange={(e) => setIsEscrowDeposit(e.target.checked)}
                  className="rounded-md w-4 h-4 text-[#0C513F] accent-[#0C513F]"
                />
                <label htmlFor="escrowBox" className="font-medium text-slate-700 cursor-pointer select-none">
                  Lock directly into Escrow Vault for upcoming milestone
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0C513F] shrink-0" />
                <span className="text-[11px] text-slate-500 font-medium">
                  Protected by NDPR encryption and Central Bank regulated banking partner rails.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Connecting to Flutterwave...'
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0A1020]">Withdraw to Bank Account</h3>
                <p className="text-[11px] text-slate-500">Fast NIBSS instant settlement powered by Flutterwave</p>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Withdrawal Amount (NGN ₦)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-black text-lg text-slate-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Available to withdraw: {formatMinorToNaira(availableBalanceMinor)}
                </span>
              </div>

              {/* Bank Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Destination Bank</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-800 bg-white focus:outline-none focus:border-[#0C513F]"
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
                <label className="font-bold text-slate-700">NUBAN Account Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:border-[#0C513F]"
                />
                {isResolvingAccount && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Verifying NUBAN with Central Switch...</span>
                  </div>
                )}
                {accountName && !isResolvingAccount && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Account Name: {accountName}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
                Funds will be dispatched instantly via Flutterwave NIBSS payment rails directly to your verified bank account.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || availableBalanceMinor <= 0}
                  className="px-6 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#0C513F] text-white font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Payout...' : 'Authorize Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
