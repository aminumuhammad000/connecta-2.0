'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { AuthRedirecting, AuthShell, GoogleButton, OrDivider } from '@/components/auth/AuthShell'
import { useGoogleAuth } from '@/components/auth/useGoogleAuth'
import { Button, Field, Notice, inputClass } from '@/components/dashboard/ui'

const REMEMBER_KEY = 'connecta_remember_email'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExpired = searchParams.get('expired') === '1'

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountNotFound, setAccountNotFound] = useState(false)
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.removeItem('connecta_remember_password')
      const saved = localStorage.getItem(REMEMBER_KEY)
      if (saved && !searchParams.get('email')) setEmail(saved)
    } catch {}
    // Only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToDashboard = (message: string) => {
    setRedirectMessage(message)
    router.push('/dashboard')
  }

  const { startGoogle, isGoogleLoading } = useGoogleAuth({
    role: 'client',
    onSuccess: (data) => goToDashboard(data.isNewUser ? 'Welcome to Connecta' : 'Welcome back'),
    onError: setError,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setAccountNotFound(false)

    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 404 || data.error?.details?.code === 'ACCOUNT_NOT_FOUND') {
          setAccountNotFound(true)
          setIsSubmitting(false)
          return
        }
        throw new Error(data.error?.message || data.error || 'That email and password do not match.')
      }

      try {
        if (rememberMe) localStorage.setItem(REMEMBER_KEY, email.trim().toLowerCase())
        else localStorage.removeItem(REMEMBER_KEY)
      } catch {}

      const firstName = (data.data?.user?.fullName || '').split(' ')[0]
      goToDashboard(firstName ? `Welcome back, ${firstName}` : 'Welcome back')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That email and password do not match.')
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      topRight={
        <span className="text-sm text-muted">
          <span className="hidden sm:inline">New to Connecta? </span>
          <Link href="/register" className="text-ink font-medium hover:text-azure-600 transition-colors">
            Create account
          </Link>
        </span>
      }
    >
      {redirectMessage && <AuthRedirecting message={redirectMessage} />}

      <div className="cn-rise">
        <h1 className="text-[28px] font-medium tracking-[-0.02em] leading-tight">Welcome back</h1>
        <p className="text-[15px] text-muted mt-2">Sign in to your dashboard.</p>
      </div>

      <div className="mt-7 space-y-3">
        {isExpired && <Notice tone="warn">Your session ended. Please sign in again.</Notice>}
        {accountNotFound && (
          <Notice tone="azure" onClose={() => setAccountNotFound(false)}>
            There&apos;s no account for <span className="font-medium">{email}</span> yet.{' '}
            <Link href={`/register?email=${encodeURIComponent(email)}`} className="underline font-medium">
              Create one in a minute
            </Link>
          </Notice>
        )}
        {error && (
          <Notice tone="danger" onClose={() => setError(null)}>
            {error}
          </Notice>
        )}
      </div>

      <div className="mt-5 cn-rise" style={{ ['--d' as string]: '60ms' }}>
        <GoogleButton onClick={startGoogle} loading={isGoogleLoading} />
      </div>

      <OrDivider label="or with email" />

      <form onSubmit={handleLogin} className="space-y-4 cn-rise" style={{ ['--d' as string]: '120ms' }} noValidate>
        <Field label="Email" htmlFor="l-email">
          <input
            id="l-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} h-12`}
            required
          />
        </Field>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="l-password" className="text-[13px] font-medium text-ink-2">
              Password
            </label>
            <Link href="/forgot-password" className="text-[13px] text-azure-600 hover:text-azure font-medium">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              id="l-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} h-12 pr-11`}
              required
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
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-azure cursor-pointer"
          />
          Remember my email
        </label>

        <Button type="submit" loading={isSubmitting} className="w-full !h-12 !text-[15px] !mt-6">
          {isSubmitting ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
