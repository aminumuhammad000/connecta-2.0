'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  CreditCard,
  Wallet,
  ShieldCheck,
  Check,
  ChevronDown,
} from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'
import { ConnectaLoader } from '@/components/brand/ConnectaLoader'
import { IllustrationLedger } from '@/components/brand/illustrations'
import {
  AnimatedNumber,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageHeader,
  Skeleton,
  inputClass,
  stagger,
} from '@/components/dashboard/ui'

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

const FALLBACK_BANKS: BankOption[] = [
  { code: '044', name: 'Access Bank' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '057', name: 'Zenith Bank' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '999992', name: 'OPay Digital Services' },
  { code: '090175', name: 'Moniepoint Microfinance Bank' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
]

const TX_META: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  deposit: { icon: ArrowDownLeft, tone: 'bg-success-50 text-success-ink' },
  withdrawal: { icon: ArrowUpRight, tone: 'bg-sunken text-ink-2' },
  escrow_lock: { icon: Lock, tone: 'bg-azure-50 text-azure-600' },
  escrow_release: { icon: CheckCircle2, tone: 'bg-success-50 text-success-ink' },
}

const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`

export default function DashboardPaymentPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [ledger, setLedger] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [amountInput, setAmountInput] = useState('50000')
  const [isEscrowDeposit, setIsEscrowDeposit] = useState(false)
  const [depositGateway, setDepositGateway] = useState<'flutterwave' | 'instant'>('flutterwave')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusNotice, setStatusNotice] = useState<string | null>(null)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)

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

  const fetchBanks = async () => {
    try {
      const res = await fetch('/api/payments/flutterwave/banks?country=NG')
      if (res.ok) {
        const body = await res.json()
        if (body.data && Array.isArray(body.data)) setBanks(body.data)
      }
    } catch (err) {
      console.warn('Bank list fetch failed:', err)
    }
  }

  useEffect(() => {
    fetchWalletData()
    fetchBanks()

    const searchParams = new URLSearchParams(window.location.search)
    const txRef = searchParams.get('tx_ref') || searchParams.get('txRef')
    const status = searchParams.get('status')

    if (txRef && status === 'successful') {
      window.history.replaceState({}, '', window.location.pathname)
      setIsSubmitting(true)
      setStatusNotice('Confirming your payment…')

      fetch('/api/payments/flutterwave/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txRef }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setStatusNotice('Payment confirmed. Your balance has been updated.')
            fetchWalletData()
          } else {
            setStatusNotice(null)
            setErrorNotice(data.error?.message || 'We could not verify that payment.')
          }
        })
        .catch((err) => {
          setStatusNotice(null)
          setErrorNotice('We could not verify that payment: ' + err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
          setTimeout(() => setStatusNotice(null), 6000)
        })
    } else if (status === 'cancelled') {
      window.history.replaceState({}, '', window.location.pathname)
      setErrorNotice('Checkout was cancelled. No money was taken.')
      setTimeout(() => setErrorNotice(null), 5000)
    }
  }, [])

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
        .then((res) => setAccountName(res.success && res.data?.accountName ? res.data.accountName : 'Verified Connecta Account Holder'))
        .catch(() => setAccountName('Verified Connecta Account Holder'))
        .finally(() => setIsResolvingAccount(false))
    } else {
      setAccountName('')
    }
  }, [accountNumber, selectedBankCode])

  const availableBalanceMinor = wallet?.balanceMinor || 0
  const escrowBalanceMinor = wallet?.escrowBalanceMinor || 0

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
            title: isEscrowDeposit ? 'Milestone Contract Deposit' : 'Connecta Wallet Deposit',
            isEscrow: isEscrowDeposit,
          }),
        })
        const body = await res.json()
        if (!res.ok || !body.data?.link) throw new Error(body.error?.message || 'Could not open the payment page')
        window.location.href = body.data.link
        return
      }

      const res = await fetch('/api/dashboard/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMinor: numeric * 100,
          isEscrow: isEscrowDeposit,
          notes: isEscrowDeposit ? 'Protected vault milestone lock' : 'Wallet balance credit',
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'Deposit failed')

      setIsDepositModalOpen(false)
      setStatusNotice(`${formatMinorToNaira(numeric * 100)} added to your ${isEscrowDeposit ? 'vault' : 'balance'}.`)
      await fetchWalletData()
      setTimeout(() => setStatusNotice(null), 4000)
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : 'Deposit failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = parseInt(amountInput.replace(/[^0-9]/g, '')) || 0
    if (numeric <= 0) return
    if (numeric * 100 > availableBalanceMinor) {
      setErrorNotice('That is more than your available balance.')
      return
    }
    setIsSubmitting(true)
    setErrorNotice(null)

    try {
      const selectedBank = (banks.length ? banks : FALLBACK_BANKS).find((b) => b.code === selectedBankCode)
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
      setStatusNotice(`${formatMinorToNaira(numeric * 100)} is on its way to your bank.`)
      await fetchWalletData()
      setTimeout(() => setStatusNotice(null), 4000)
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : 'Withdrawal failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const refresh = async () => {
    setIsRefreshing(true)
    await fetchWalletData()
    setIsRefreshing(false)
  }

  const visibleLedger = ledger.filter((tx) => tx.type !== 'sparks_grant')
  const bankList = banks.length ? banks : FALLBACK_BANKS

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment"
        title="Your money"
        description="Add funds, protect them for a job, and withdraw to any Nigerian bank."
        actions={
          <>
            <Button
              variant="warm"
              onClick={() => {
                setAmountInput('25000')
                setErrorNotice(null)
                setIsWithdrawModalOpen(true)
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setAmountInput('50000')
                setIsEscrowDeposit(false)
                setErrorNotice(null)
                setIsDepositModalOpen(true)
              }}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Add funds
            </Button>
          </>
        }
      />

      {statusNotice && (
        <Notice tone="success" onClose={() => setStatusNotice(null)}>
          {statusNotice}
        </Notice>
      )}
      {errorNotice && !isDepositModalOpen && !isWithdrawModalOpen && (
        <Notice tone="danger" onClose={() => setErrorNotice(null)}>
          {errorNotice}
        </Notice>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-6 sm:p-7 cn-rise" style={stagger(1, 80)}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted">Available balance</span>
            <span className="w-8 h-8 rounded-lg bg-azure-50 text-azure flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-[34px] leading-none font-medium tracking-[-0.03em] text-ink">
            {isLoading ? <Skeleton className="h-9 w-40" /> : <AnimatedNumber value={availableBalanceMinor / 100} format={naira} />}
          </div>
          <p className="text-[13px] text-muted mt-3">Ready to withdraw to your bank at any time.</p>
        </Card>

        <Card className="p-6 sm:p-7 cn-rise bg-[linear-gradient(160deg,#FFFFFF_40%,#ECFDF5)]" style={stagger(2, 80)}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success cn-live-dot" />
              Protected in vault
            </span>
            <span className="w-8 h-8 rounded-lg bg-success-50 text-success-ink flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-[34px] leading-none font-medium tracking-[-0.03em] text-success-ink">
            {isLoading ? <Skeleton className="h-9 w-40" /> : <AnimatedNumber value={escrowBalanceMinor / 100} format={naira} />}
          </div>
          <p className="text-[13px] text-muted mt-3">Held for your jobs. Released only when you approve.</p>
        </Card>
      </div>

      <Card className="cn-rise" style={stagger(3, 80)}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <h2 className="text-base font-medium text-ink">Activity</h2>
            <p className="text-[13px] text-muted mt-0.5">Deposits, protected funds and payouts</p>
          </div>
          <button
            onClick={refresh}
            title="Refresh"
            aria-label="Refresh activity"
            className="w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center">
            <ConnectaLoader size={36} label="Loading activity" />
          </div>
        ) : visibleLedger.length > 0 ? (
          <ul className="divide-y divide-line">
            {visibleLedger.map((tx, idx) => {
              const meta = TX_META[tx.type] || TX_META.withdrawal
              const Icon = meta.icon
              const incoming = tx.type === 'deposit'
              return (
                <li
                  key={tx.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-canvas/60 transition-colors cn-rise"
                  style={stagger(Math.min(idx, 10), 40)}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.tone}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm text-ink truncate">{tx.title}</div>
                      <div className="text-xs text-muted mt-0.5 tabular-nums">
                        {new Date(tx.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
                        {tx.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-medium tabular-nums ${incoming ? 'text-success-ink' : 'text-ink'}`}>
                      {incoming ? '+' : ''}
                      {formatMinorToNaira(tx.amountMinor)}
                    </div>
                    <Badge
                      tone={tx.status === 'completed' ? 'neutral' : tx.status === 'failed' ? 'danger' : 'warn'}
                      className="mt-1 capitalize"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            illustration={<IllustrationLedger />}
            title="No activity yet"
            description="Your deposits, protected funds and payouts will be listed here."
            action={
              <Button variant="secondary" onClick={() => setIsDepositModalOpen(true)}>
                Add your first funds
              </Button>
            }
          />
        )}
      </Card>

      <Modal
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Add funds"
        description="Top up your balance or protect money for an upcoming job."
      >
        <form onSubmit={handleDeposit} className="space-y-5">
          {errorNotice && <Notice tone="danger">{errorNotice}</Notice>}
          <Field label="Amount" htmlFor="deposit-amount">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-lg">₦</span>
              <input
                id="deposit-amount"
                type="number"
                min={1}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className={`${inputClass} h-12 pl-9 text-xl font-medium tabular-nums`}
                required
              />
            </div>
          </Field>

          <div className="flex gap-1.5">
            {['10000', '50000', '100000', '250000'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmountInput(v)}
                className={`flex-1 h-8 rounded-lg text-xs border transition-colors cursor-pointer ${
                  amountInput === v ? 'border-success bg-success-50 text-success-ink' : 'border-line text-ink-2 hover:border-line-strong'
                }`}
              >
                ₦{Number(v).toLocaleString('en-NG')}
              </button>
            ))}
          </div>

          <Field label="Pay with">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'flutterwave', icon: CreditCard, title: 'Flutterwave', sub: 'Card, transfer, USSD' },
                  { id: 'instant', icon: Wallet, title: 'Test credit', sub: 'Sandbox only' },
                ] as const
              ).map((opt) => {
                const active = depositGateway === opt.id
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDepositGateway(opt.id)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      active ? 'border-success ring-4 ring-success/15 bg-surface' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-success-ink' : 'text-muted'}`} />
                    <div className="text-sm font-medium text-ink mt-2.5">{opt.title}</div>
                    <div className="text-xs text-muted">{opt.sub}</div>
                    {active && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-success-ink text-white flex items-center justify-center cn-pop">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Field>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isEscrowDeposit}
              onChange={(e) => setIsEscrowDeposit(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#047857] cursor-pointer"
            />
            <span>
              <span className="block text-sm text-ink">Protect this for a job</span>
              <span className="block text-xs text-muted mt-0.5">The money goes straight into your vault for an upcoming stage.</span>
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setIsDepositModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" loading={isSubmitting}>
              {isSubmitting ? 'Processing' : depositGateway === 'flutterwave' ? 'Continue to payment' : 'Add funds'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw to bank"
        description="Instant transfer to any Nigerian account."
      >
        <form onSubmit={handleWithdraw} className="space-y-5">
          {errorNotice && <Notice tone="danger">{errorNotice}</Notice>}
          <Field label="Amount" htmlFor="withdraw-amount" hint={`Available: ${formatMinorToNaira(availableBalanceMinor)}`}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-lg">₦</span>
              <input
                id="withdraw-amount"
                type="number"
                min={1}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className={`${inputClass} h-12 pl-9 text-xl font-medium tabular-nums`}
                required
              />
            </div>
          </Field>

          <Field label="Bank" htmlFor="withdraw-bank">
            <div className="relative">
              <select
                id="withdraw-bank"
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                className={`${inputClass} appearance-none pr-9 cursor-pointer`}
              >
                {bankList.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            </div>
          </Field>

          <Field
            label="Account number"
            htmlFor="withdraw-account"
            hint={
              isResolvingAccount ? (
                <span className="inline-flex items-center gap-2">
                  <ConnectaLoader size={12} showTrack={false} />
                  Checking account…
                </span>
              ) : accountName ? (
                <span className="inline-flex items-center gap-1.5 text-success-ink cn-fade">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {accountName}
                </span>
              ) : (
                '10 digits'
              )
            }
          >
            <input
              id="withdraw-account"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              className={`${inputClass} tracking-[0.12em] tabular-nums`}
            />
          </Field>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setIsWithdrawModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="warm" loading={isSubmitting} disabled={availableBalanceMinor <= 0}>
              {isSubmitting ? 'Sending' : 'Withdraw'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
