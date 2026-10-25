'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function RegisterRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    const step = searchParams.get('step') || (role ? 'contact_info' : 'role')
    if (role) {
      router.replace(`/onboarding?step=${step}&role=${role}`)
    } else {
      router.replace(`/onboarding?step=${step}`)
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center font-bold text-xs text-slate-400">
      Redirecting to Connecta Onboarding...
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC]" />}>
      <RegisterRedirect />
    </Suspense>
  )
}
