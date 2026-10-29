'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { IllustrationShield } from '@/components/brand/illustrations'
import { Button, Field, Notice, inputClass } from '@/components/dashboard/ui'

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { n: 1, label: 'Email', color: 'bg-azure' },
  { n: 2, label: 'Code', color: 'bg-warn' },
  { n: 3, label: 'New password', color: 'bg-success' },
]

const STRENGTH = [
  { label: 'At least 8 characters', bar: 'bg-line' },
  { label: 'Weak', bar: 'bg-warn' },
  { label: 'Good', bar: 'bg-azure' },
  { label: 'Strong', bar: 'bg-success' },
]

function strengthOf(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return score
}

function ForgotPasswordContent() {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return
    const id = window.setTimeout(() => setResendTimer((t) => t - 1), 1000)
    return () => window.clearTimeout(id)
  }, [step, resendTimer])

  useEffect(() => {
    if (step === 2) codeRef.current?.focus()
  }, [step])

  const cleanEmail = email.trim().toLowerCase()
  const strength = strengthOf(newPassword)

  const sendCode = async () => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error?.message || body.error || 'We could not send a code.')
    setDevCode(body.data?.devCode || null)
    setResendTimer(60)
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Enter the email you signed up with.')
      return
    }
    setIsLoading(true)
    try {
      await sendCode()
      setInfoMsg('')
      setStep(2)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'We could not send a code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setErrorMsg('')
    try {
      await sendCode()
      setInfoMsg(`A new code is on its way to ${cleanEmail}.`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'We could not resend the code.')
    } finally {
      setIsResending(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMsg('Enter all 6 digits of the code.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: otpCode.trim() }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'That code is not right.')
      setInfoMsg('')
      setStep(3)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'That code is not right or has expired.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (newPassword.length < 8) {
      setErrorMsg('Your password needs at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('The two passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, newPassword, code: otpCode.trim() }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || body.error || 'We could not update your password.')
      setStep(4)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'We could not update your password.')
    } finally {
      setIsLoading(false)
    }
  }

  const titles: Record<Step, { title: string; sub: string }> = {
    1: { title: 'Reset your password', sub: "Enter your email and we'll send you a 6-digit code." },
    2: { title: 'Check your email', sub: `We sent a code to ${cleanEmail}.` },
    3: { title: 'Choose a new password', sub: 'Make it something you have not used here before.' },
    4: { title: 'Password updated', sub: 'You can now sign in with your new password.' },
  }

  return (
    <AuthShell
      topRight={
        <Link href="/login" className="text-sm text-ink font-medium hover:text-azure-600 transition-colors">
          Sign in
        </Link>
      }
    >
      {step < 4 && (
        <div className="flex items-center gap-2 mb-8" aria-label={`Step ${step} of 3`}>
          {STEPS.map((s) => (
            <div key={s.n} className="flex-1">
              <div className="h-1 rounded-full bg-line overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color} transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                  style={{ width: step >= s.n ? '100%' : '0%' }}
                />
              </div>
              <div className={`text-xs mt-2 ${step === s.n ? 'text-ink font-medium' : 'text-subtle'}`}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex justify-center mb-2 cn-rise">
          <IllustrationShield />
        </div>
      )}

      <div key={step} className="cn-rise">
        <h1 className={`text-[28px] font-medium tracking-[-0.02em] leading-tight ${step === 4 ? 'text-center' : ''}`}>
          {titles[step].title}
        </h1>
        <p className={`text-[15px] text-muted mt-2 ${step === 4 ? 'text-center' : ''}`}>{titles[step].sub}</p>
      </div>

      <div className="mt-6 space-y-3">
        {errorMsg && (
          <Notice tone="danger" onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Notice>
        )}
        {infoMsg && <Notice tone="success">{infoMsg}</Notice>}
        {step === 2 && devCode && (
          <Notice tone="warn">
            Development code: <span className="font-medium tabular-nums tracking-widest">{devCode}</span>
          </Notice>
        )}
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="mt-6 space-y-5 cn-rise" style={{ ['--d' as string]: '80ms' }} noValidate>
          <Field label="Email" htmlFor="fp-email">
            <input
              id="fp-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} h-12`}
              required
            />
          </Field>
          <Button type="submit" loading={isLoading} className="w-full !h-12 !text-[15px]">
            {isLoading ? 'Sending code' : 'Send code'}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5 cn-rise" style={{ ['--d' as string]: '80ms' }} noValidate>
          <Field label="6-digit code" htmlFor="fp-code">
            <input
              ref={codeRef}
              id="fp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`${inputClass} h-14 text-center text-2xl tracking-[0.5em] tabular-nums font-medium`}
              required
            />
          </Field>
          <Button type="submit" variant="warm" loading={isLoading} className="w-full !h-12 !text-[15px]">
            {isLoading ? 'Checking code' : 'Verify code'}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtpCode('')
                setErrorMsg('')
              }}
              className="inline-flex items-center gap-1.5 text-muted hover:text-ink cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Change email
            </button>
            {resendTimer > 0 ? (
              <span className="text-subtle tabular-nums">Resend in {resendTimer}s</span>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleResend} loading={isResending}>
                Resend code
              </Button>
            )}
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-4 cn-rise" style={{ ['--d' as string]: '80ms' }} noValidate>
          <Field
            label="New password"
            htmlFor="fp-new"
            hint={
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strength >= i ? STRENGTH[strength].bar : 'bg-line'}`} />
                  ))}
                </div>
                <span className="w-32 text-right">{newPassword ? STRENGTH[strength].label : STRENGTH[0].label}</span>
              </div>
            }
          >
            <div className="relative">
              <input
                id="fp-new"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          </Field>
          <Field
            label="Confirm password"
            htmlFor="fp-confirm"
            hint={
              confirmPassword && confirmPassword === newPassword ? (
                <span className="inline-flex items-center gap-1 text-success-ink">
                  <Check className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : undefined
            }
          >
            <input
              id="fp-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} h-12`}
              required
            />
          </Field>
          <Button type="submit" variant="success" loading={isLoading} className="w-full !h-12 !text-[15px] !mt-6">
            {isLoading ? 'Saving password' : 'Save new password'}
          </Button>
        </form>
      )}

      {step === 4 && (
        <div className="mt-8 cn-rise" style={{ ['--d' as string]: '120ms' }}>
          <Button href={`/login?email=${encodeURIComponent(cleanEmail)}`} className="w-full !h-12 !text-[15px]">
            Sign in
          </Button>
        </div>
      )}

      {step === 1 && (
        <p className="text-sm text-muted text-center mt-8">
          Remembered it?{' '}
          <Link href="/login" className="text-ink font-medium hover:text-azure-600">
            Back to sign in
          </Link>
        </p>
      )}
    </AuthShell>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  )
}
