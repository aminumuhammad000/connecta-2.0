'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Hammer, Search } from 'lucide-react'
import { AuthRedirecting, AuthShell, GoogleButton, OrDivider } from '@/components/auth/AuthShell'
import { useGoogleAuth } from '@/components/auth/useGoogleAuth'
import { Button, Field, Notice, inputClass } from '@/components/dashboard/ui'

type Role = 'client' | 'provider'

const ROLES: Array<{ value: Role; title: string; icon: React.ComponentType<{ className?: string }>; active: string }> = [
  { value: 'client', title: 'I need a pro', icon: Search, active: 'border-azure ring-4 ring-azure/10 [&_.role-icon]:bg-azure [&_.role-icon]:text-white' },
  { value: 'provider', title: "I'm a professional", icon: Hammer, active: 'border-warn ring-4 ring-warn/15 [&_.role-icon]:bg-warn [&_.role-icon]:text-ink' },
]

function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH = [
  { label: 'At least 8 characters', bar: 'bg-line' },
  { label: 'Weak', bar: 'bg-warn' },
  { label: 'Good', bar: 'bg-azure' },
  { label: 'Strong', bar: 'bg-success' },
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<Role>(searchParams.get('role') === 'provider' ? 'provider' : 'client')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null)

  const goToDashboard = (message: string) => {
    setRedirectMessage(message)
    router.push('/dashboard')
  }

  const { startGoogle, isGoogleLoading } = useGoogleAuth({
    role,
    onSuccess: (data) => goToDashboard(data.isNewUser ? 'Welcome to Connecta' : 'Welcome back'),
    onError: setError,
  })

  const strength = passwordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setAlreadyExists(false)

    const parts = fullName.trim().split(/\s+/).filter(Boolean)
    if (parts.length < 2) {
      setError('Please enter your first and last name.')
      return
    }
    if (password.length < 8) {
      setError('Your password needs at least 8 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          firstName: parts[0],
          lastName: parts.slice(1).join(' '),
          email: email.trim().toLowerCase(),
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) setAlreadyExists(true)
        throw new Error(data.error?.message || data.error || 'We could not create your account.')
      }
      goToDashboard(`Welcome, ${parts[0]}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not create your account.')
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      topRight={
        <span className="text-sm text-muted">
          <span className="hidden sm:inline">Have an account? </span>
          <Link href="/login" className="text-ink font-medium hover:text-azure-600 transition-colors">
            Sign in
          </Link>
        </span>
      }
    >
      {redirectMessage && <AuthRedirecting message={redirectMessage} />}

      <div className="cn-rise">
        <h1 className="text-[28px] font-medium tracking-[-0.02em] leading-tight">Create your account</h1>
        <p className="text-[15px] text-muted mt-2">One minute, and you&apos;re in.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-7 cn-rise" style={{ ['--d' as string]: '60ms' }} role="radiogroup" aria-label="Account type">
        {ROLES.map((r) => {
          const Icon = r.icon
          const active = role === r.value
          return (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(r.value)}
              className={`flex items-center gap-2.5 h-14 px-3 rounded-xl border bg-surface text-left transition-all duration-200 cursor-pointer ${
                active ? r.active : 'border-line hover:border-line-strong'
              }`}
            >
              <span className="role-icon w-8 h-8 rounded-lg bg-sunken text-muted flex items-center justify-center shrink-0 transition-colors duration-200">
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium text-ink">{r.title}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 cn-rise" style={{ ['--d' as string]: '120ms' }}>
        <GoogleButton onClick={startGoogle} loading={isGoogleLoading} label="Sign up with Google" />
      </div>

      <OrDivider label="or with email" />

      {error && (
        <div className="mb-5">
          <Notice tone="danger" onClose={() => setError(null)}>
            {error}
            {alreadyExists && (
              <>
                {' '}
                <Link href={`/login?email=${encodeURIComponent(email)}`} className="underline font-medium">
                  Sign in instead
                </Link>
              </>
            )}
          </Notice>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 cn-rise" style={{ ['--d' as string]: '180ms' }} noValidate>
        <Field label="Full name" htmlFor="r-name">
          <input
            id="r-name"
            type="text"
            autoComplete="name"
            placeholder="Amina Bello"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`${inputClass} h-12`}
            required
          />
        </Field>
        <Field label="Email" htmlFor="r-email">
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} h-12`}
            required
          />
        </Field>
        <Field
          label="Password"
          htmlFor="r-password"
          hint={
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strength >= i ? STRENGTH[strength].bar : 'bg-line'}`}
                  />
                ))}
              </div>
              <span className="w-32 text-right">{password ? STRENGTH[strength].label : STRENGTH[0].label}</span>
            </div>
          }
        >
          <div className="relative">
            <input
              id="r-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} h-12 pr-11`}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-subtle hover:text-ink flex items-center justify-center cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Button type="submit" loading={isSubmitting} className="w-full !h-12 !text-[15px] !mt-6">
          {isSubmitting ? 'Creating your account' : 'Create account'}
        </Button>
      </form>

      <p className="text-xs text-subtle text-center mt-6 leading-relaxed">
        By continuing you agree to our{' '}
        <Link href="/terms" className="text-muted underline underline-offset-2 hover:text-ink">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-muted underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
