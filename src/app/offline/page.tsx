'use client'

import React from 'react'
import Link from 'next/link'
import { WifiOff, RefreshCw, Home, Shield } from 'lucide-react'

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <main className="min-h-screen bg-[#0A1020] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-md w-full bg-[#111928]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <WifiOff className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/70 mb-3">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          Offline Mode Active
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          No Internet Connection
        </h1>

        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          Connecta is installed on your device. Once your mobile data or Wi-Fi is restored, all features, live chat, and escrow milestones will reconnect automatically.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Reconnecting</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-medium text-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        <p className="text-[11px] text-white/40 mt-6">
          Connecta Progressive Web App • Instant launch with NDIC-insured vault protection
        </p>
      </div>
    </main>
  )
}
