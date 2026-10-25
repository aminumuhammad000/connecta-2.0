'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
import {
  DASHBOARD_WALLET_LEDGER,
  formatMinorToNaira,
} from '@/lib/dashboard/data'

export default function DashboardWalletPage() {
  const [ledger, setLedger] = useState(DASHBOARD_WALLET_LEDGER)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [amountInput, setAmountInput] = useState('50000')
  const [statusNotice, setStatusNotice] = useState<string | null>(null)

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = parseInt(amountInput.replace(/[^0-9]/g, '')) || 0
    if (numeric <= 0) return

    const newTx = {
      id: `tx-${Date.now()}`,
      reference: `TX-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'deposit' as const,
      amountMinor: numeric * 100,
      currency: 'NGN',
      status: 'completed' as const,
      description: 'Instant Card / Bank Deposit into Escrow Vault',
      date: 'Just now',
    }
    setLedger([newTx, ...ledger])
    setIsDepositModalOpen(false)
    setStatusNotice(`Successfully deposited ${formatMinorToNaira(numeric * 100)} into Escrow Vault!`)
    setTimeout(() => setStatusNotice(null), 4000)
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = parseInt(amountInput.replace(/[^0-9]/g, '')) || 0
    if (numeric <= 0) return

    const newTx = {
      id: `tx-${Date.now()}`,
      reference: `TX-WTH-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'withdrawal' as const,
      amountMinor: numeric * 100,
      currency: 'NGN',
      status: 'completed' as const,
      description: 'Instant NIBSS Payout to Zenith Bank (****8821)',
      date: 'Just now',
    }
    setLedger([newTx, ...ledger])
    setIsWithdrawModalOpen(false)
    setStatusNotice(`Payout request of ${formatMinorToNaira(numeric * 100)} dispatched to your Zenith Bank account!`)
    setTimeout(() => setStatusNotice(null), 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
            NDPR &amp; CBN Regulated Escrow
          </span>
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
              setAmountInput('35000')
              setIsWithdrawModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-2.5 text-xs font-bold shadow-xs hover:border-slate-400 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* Status Notice Toast */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Balances Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Milestone Escrow Locked */}
        <div className="bg-[#0C513F] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-extrabold">
            <span>Milestone Escrow Vault</span>
            <Lock className="w-4 h-4 text-emerald-300" />
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              ₦480,000
            </div>
            <div className="text-xs text-white/80 font-medium mt-1">
              Locked in active contract #CN-782419
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-white/90">
            <span>Status: Guaranteed Insured</span>
            <span className="font-bold">4 Milestones</span>
          </div>
        </div>

        {/* Card 2: Withdrawable Available Balance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0A1020] tracking-tight">
              ₦345,000
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Ready for instant bank withdrawal
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Payout Account:</span>
            <span className="font-bold text-slate-800">Zenith Bank (****8821)</span>
          </div>
        </div>

        {/* Card 3: Connecta AI Sparks Balance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold">
            <span>Connecta AI Sparks</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0A1020] tracking-tight flex items-baseline gap-2">
              <span>25</span>
              <span className="text-lg text-amber-600 font-bold">Sparks ⚡</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Active matching &amp; brief optimization fuel
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
            <span>+10 Bonus with every verified review</span>
          </div>
        </div>
      </div>

      {/* Ledger History Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-[#0A1020] tracking-tight">
              Transaction Ledger &amp; Escrow Audit Trail
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Every milestone lock, inspection release, and bank transfer is cryptographically verified.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {ledger.length} Recorded Transactions
          </span>
        </div>

        <div className="space-y-3">
          {ledger.map((tx) => {
            const isCredit = tx.type === 'escrow_release' || tx.type === 'deposit'
            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'escrow_hold'
                        ? 'bg-blue-100 text-[#1A73E8]'
                        : tx.type === 'escrow_release'
                        ? 'bg-emerald-100 text-[#10B981]'
                        : tx.type === 'deposit'
                        ? 'bg-emerald-100 text-[#0C513F]'
                        : 'bg-amber-100 text-[#F59E0B]'
                    }`}
                  >
                    {tx.type === 'escrow_hold' && <Lock className="w-4 h-4" />}
                    {tx.type === 'escrow_release' && <CheckCircle2 className="w-4 h-4" />}
                    {tx.type === 'deposit' && <ArrowDownLeft className="w-4 h-4" />}
                    {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="font-extrabold text-[#0A1020] sm:text-sm">
                      {tx.description}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Ref: {tx.reference} • {tx.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black ${
                      isCredit ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {isCredit ? '+' : '-'}{formatMinorToNaira(tx.amountMinor)}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0C513F]">
                    {tx.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div>
              <h3 className="text-xl font-black text-[#0A1020]">Deposit into Escrow Vault</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fund your escrow account via Paystack / Flutterwave card or instant bank transfer.
              </p>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Deposit Amount (NGN)</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-[#0C513F]"
                    placeholder="50,000"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 text-[11px] text-emerald-800 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% covered by Connecta Escrow Vault Guarantee.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#0C513F] text-white hover:bg-[#083b2e] shadow-md cursor-pointer"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div>
              <h3 className="text-xl font-black text-[#0A1020]">Request Bank Payout</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Instant withdrawal to your linked Nigerian commercial bank account.
              </p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Withdrawal Amount (NGN)</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-[#0C513F]"
                    placeholder="35,000"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Maximum available: ₦345,000
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-1">
                <div className="font-extrabold text-[#0A1020]">Receiving Bank:</div>
                <div className="text-slate-600">Zenith Bank PLC • 1029384821</div>
                <div className="text-[11px] text-emerald-700 font-bold">Estimated arrival: 2 - 10 minutes</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#0A1020] text-white hover:bg-[#10B981] shadow-md cursor-pointer"
                >
                  Authorize Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
