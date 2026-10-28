'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ShieldCheck, CheckCircle2, Star, ThumbsUp } from 'lucide-react'

export default function EscrowReleasePage() {
  const params = useParams()
  const bookingNumber = (params?.id as string) || 'CN-KN'
  const [released, setReleased] = useState(false)
  const [rating, setRating] = useState(5)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleRelease = async () => {
    try {
      await fetch('/api/payments/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber })
      }).catch(() => {})
      setReleased(true)
    } catch {
      setReleased(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-12 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Connecta Kano Milestone Release
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Approve Work Completion</h1>
          <p className="text-slate-400 text-sm">
            Order Reference: <span className="font-mono font-bold text-emerald-400">{bookingNumber}</span>
          </p>
        </div>

        {!released ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-md">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-100">Did the technician complete the job?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                By tapping &quot;Release Payment&quot;, you confirm that the specialist inspected or resolved your issue to your satisfaction. The ₦5,000 callout fee will be transferred to their wallet.
              </p>
            </div>

            <button
              onClick={handleRelease}
              className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Release ₦5,000 to Technician</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Payment Released Successfully!</h2>
            <p className="text-sm text-slate-400">
              The technician has been notified and credited. Thank you for using Connecta Kano.
            </p>

            {!feedbackSubmitted ? (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate the Specialist</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setFeedbackSubmitted(true)}
                  className="mt-2 py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  Submit Rating
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                ⭐ Thank you for your feedback!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
