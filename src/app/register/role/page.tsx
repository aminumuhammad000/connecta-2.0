'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function RegisterRoleRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role) {
      router.replace(`/onboarding?step=role&role=${role}`)
    } else {
      router.replace('/onboarding?step=role')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center font-bold text-xs text-slate-400">
      Loading Connecta Role Selection...
    </div>
  )
}

export default function RegisterRolePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC]" />}>
      <RegisterRoleRedirect />
    </Suspense>
  )
}
