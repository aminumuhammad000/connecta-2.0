import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import VerificationClientView from './VerificationClientView'

export const metadata: Metadata = {
  title: 'Provider Verification Queue | Connecta Admin',
  description: 'Review government IDs and trade guild credentials for Kano service providers.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1020] text-white flex items-center justify-center font-bold">
          Loading Verification Center...
        </div>
      }
    >
      <VerificationClientView />
    </Suspense>
  )
}
