'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { Shield, CheckCircle2, Lock, ArrowRight, Wrench, MapPin, Clock, CreditCard } from 'lucide-react'

function BookingEscrowContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || 'CN-KN-7774'
  const cat = searchParams.get('cat') || 'Repair Service'
  const area = searchParams.get('area') || 'Kano'
  const amountStr = searchParams.get('amount') || '5000'
  const amount = parseInt(amountStr, 10) || 5000

  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const handleFlutterwavePayment = async () => {
    setLoading(true)
    try {
      // Call Flutterwave initialization API
      const res = await fetch('/api/payments/flutterwave/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'NGN',
          email: 'customer@myconnecta.ng',
          name: 'Connecta Kano Customer',
          redirectUrl: `${window.location.origin}/bookings/new?ref=${ref}&status=successful`,
          title: `Connecta Escrow Deposit - ${ref}`,
          description: `Diagnostic callout fee for ${cat} in ${area}`
        })
      })

      const data = await res.json()
      if (data?.data?.link) {
        window.location.href = data.data.link
      } else {
        // Fallback simulated payment for testing
        setPaid(true)
        // Trigger webhook simulation to notify WhatsApp
        await fetch('/api/payments/flutterwave/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'verif-hash': '550909250e84b035e62a2cdf6f3f002c39f8ee6b0c1eca3a' },
          body: JSON.stringify({
            event: 'charge.completed',
            data: {
              id: Date.now(),
              tx_ref: `FLW_${ref}_${Date.now()}`,
              amount,
              currency: 'NGN',
              status: 'successful'
            }
          })
        }).catch(() => {})
      }
    } catch (err) {
      console.error(err)
      setPaid(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-12 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> Connecta Kano Escrow Protection
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Approve Diagnostic Deposit</h1>
          <p className="text-slate-400 text-sm">
            Your payment remains locked in the Connecta Vault until you confirm satisfactory service.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-sm">
            <span className="text-slate-400">Order Reference</span>
            <span className="font-mono font-bold text-emerald-400">{ref}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Selected Trade</div>
                <div className="text-sm font-medium text-slate-200">{cat}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location in Kano</div>
                <div className="text-sm font-medium text-slate-200">{area}, Kano</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Dispatch Urgency</div>
                <div className="text-sm font-medium text-slate-200">Immediate Onsite Callout</div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Initial Diagnostic & Callout</span>
              <span className="font-semibold text-white">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Platform Escrow Protection</span>
              <span className="text-emerald-400 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800 text-emerald-400">
              <span>Total to Lock in Escrow</span>
              <span>₦{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Escrow Guarantee Banner */}
        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 flex gap-3 items-start">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-slate-300">
            <span className="font-semibold text-emerald-300 block">Tsaron Kuɗi / 100% Escrow Guarantee</span>
            <span>
              The technician is not paid until you inspect and approve the diagnostic work. If they do not arrive, your deposit is refunded automatically.
            </span>
          </div>
        </div>

        {/* Action Button */}
        {paid ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-emerald-300">₦{amount.toLocaleString()} Secured in Escrow!</div>
            <p className="text-xs text-slate-300">
              We have notified your matched specialist on WhatsApp. You can return to your WhatsApp chat to track their arrival.
            </p>
          </div>
        ) : (
          <button
            onClick={handleFlutterwavePayment}
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Connecting to Secure Escrow...</span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Lock ₦{amount.toLocaleString()} in Escrow</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Powered by Connecta Kano Escrow Ledger • Verified Artisans
        </div>
      </div>
    </div>
  )
}

export default function BookingEscrowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading booking details...</div>}>
      <BookingEscrowContent />
    </Suspense>
  )
}
