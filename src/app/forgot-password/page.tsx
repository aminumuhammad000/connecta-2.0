'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
} from 'lucide-react'

function ForgotPasswordContent() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasLower = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  const getStrengthLabel = () => {
    if (!newPassword) return { text: 'Empty', color: 'bg-slate-200', textClass: 'text-slate-400', width: '0%' }
    if (strengthScore <= 2) return { text: 'Weak', color: 'bg-rose-500', textClass: 'text-rose-600', width: '25%' }
    if (strengthScore === 3) return { text: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-600', width: '50%' }
    if (strengthScore === 4) return { text: 'Good', color: 'bg-[#4D78FF]', textClass: 'text-[#4D78FF]', width: '75%' }
    return { text: 'Strong', color: 'bg-[#10B981]', textClass: 'text-[#10B981]', width: '100%' }
  }

  // STEP 1: Request Real Server OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setDevCode(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid registered email address.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.error?.message || body.error || 'Failed to dispatch verification code')
      }

      setStep(2)
      setResendTimer(60)
      setCanResend(false)
      setSuccessMsg(body.data?.message || `A 6-digit verification code has been dispatched to ${cleanEmail}`)
      if (body.data?.devCode) {
        setDevCode(body.data.devCode)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const cleanCode = otpCode.trim()
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setErrorMsg('Please enter the complete 6-digit verification code.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: cleanCode,
        }),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.error?.message || body.error || 'Invalid verification code')
      }

      setStep(3)
      setSuccessMsg('Email verified! Please create your new secure password.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.')
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.error?.message || body.error || 'Failed to resend code')
      }

      setResendTimer(60)
      setCanResend(false)
      setSuccessMsg(`A fresh verification code was sent to ${email}`)
      if (body.data?.devCode) {
        setDevCode(body.data.devCode)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.')
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!hasMinLength) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please recheck.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
          code: otpCode.trim(),
        }),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.error?.message || body.error || 'Failed to update password')
      }

      setStep(4)
      setSuccessMsg('Your password has been successfully reset!')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const strength = getStrengthLabel()

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Sleek Top Header Bar (matches Onboarding & Login) */}
      <header className="w-full bg-[#F5F7FC]/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-36 h-8 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:inline">
              Remember your password?
            </span>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#053F28] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Header Heading */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight leading-[1.1]">
            {step === 1 && 'Reset your password'}
            {step === 2 && 'Enter verification code'}
            {step === 3 && 'Create new password'}
            {step === 4 && 'Password reset!'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            {step === 1 && 'Enter your registered email address to receive an official 6-digit recovery code.'}
            {step === 2 && `Enter the 6-digit code sent to ${email} to authorize your password change.`}
            {step === 3 && 'Choose a strong, unique password to safeguard your Connecta escrow workspace.'}
            {step === 4 && 'Your credentials have been securely updated. You can now access your dashboard.'}
          </p>

          {/* Stepper Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${
                    step >= 1 ? 'bg-[#0A1020] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  1
                </span>
                <span className={step === 1 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>Email</span>
              </div>
              <div className="w-6 h-0.5 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${
                    step >= 2 ? 'bg-[#0A1020] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  2
                </span>
                <span className={step === 2 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>Code</span>
              </div>
              <div className="w-6 h-0.5 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${
                    step >= 3 ? 'bg-[#0A1020] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </span>
                <span className={step === 3 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>New Password</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Frame matching Onboarding & Login */}
        <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dev Mode Code Helper (helps user test quickly when email server is simulated) */}
          {devCode && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verification Code: <strong className="font-mono text-sm tracking-widest">{devCode}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(devCode)}
                className="text-[11px] font-extrabold text-[#0C513F] hover:underline"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@company.ng"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#4D78FF] focus:ring-4 focus:ring-[#4D78FF]/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    6-Digit Verification Code *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setDevCode(null)
                    }}
                    className="text-xs font-bold text-[#4D78FF] hover:underline"
                  >
                    Change email
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl py-3.5 px-4 text-center tracking-[0.35em] text-lg sm:text-xl font-black text-slate-900 focus:bg-white focus:outline-none focus:border-[#4D78FF] focus:ring-4 focus:ring-[#4D78FF]/10 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn&apos;t receive a code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#4D78FF] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <span className="text-slate-400 font-semibold">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#4D78FF] focus:ring-4 focus:ring-[#4D78FF]/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Password Strength:</span>
                    <span className={`font-bold ${strength.textClass}`}>{strength.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                    <div className={hasMinLength ? 'text-[#10B981] font-bold' : 'text-slate-400'}>
                      ✓ 8+ Characters
                    </div>
                    <div className={hasUpper && hasLower ? 'text-[#10B981] font-bold' : 'text-slate-400'}>
                      ✓ Upper &amp; Lower case
                    </div>
                    <div className={hasNumber ? 'text-[#10B981] font-bold' : 'text-slate-400'}>
                      ✓ Numbers (0-9)
                    </div>
                    <div className={hasSpecial ? 'text-[#10B981] font-bold' : 'text-slate-400'}>
                      ✓ Special symbol (!@#$)
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#4D78FF] focus:ring-4 focus:ring-[#4D78FF]/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="text-[11px] font-bold flex items-center gap-1 pt-0.5">
                    {newPassword === confirmPassword ? (
                      <span className="text-[#10B981] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !hasMinLength || newPassword !== confirmPassword}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="text-center space-y-6 py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0C513F] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-[#0A1020]">Password Successfully Updated</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto">
                  Your new credentials are now active on the Connecta platform. Please proceed to sign in.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Sign In with New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Security footnote */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Connecta 2.0 Escrow &amp; Data Privacy Protocols</span>
          </div>
        </div>
      </main>

      {/* Footer (matches Login) */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <span>&copy; {new Date().getFullYear()} Connecta Marketplace. Regulated Escrow &amp; Verification Protocol.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-800 hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-800 hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  )
}
