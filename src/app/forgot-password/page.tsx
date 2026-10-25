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
} from 'lucide-react'
import {
  ConnectaCornerHelix,
  Sphere3D,
  SparkleStar,
} from '@/components/Connecta3DDecoration'

function ForgotPasswordContent() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Resend OTP countdown
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

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      setResendTimer(60)
      setCanResend(false)
      setSuccessMsg(`A 6-digit verification code has been dispatched to ${email}`)
    }, 800)
  }

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
      setSuccessMsg('Code verified! Please create your new secure password.')
    }, 700)
  }

  // STEP 2: Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setResendTimer(60)
      setCanResend(false)
      setSuccessMsg(`A fresh verification code was sent to ${email}`)
    }, 600)
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
    setTimeout(() => {
      setIsLoading(false)
      setStep(4)
      setSuccessMsg('Your password has been successfully reset!')
    }, 900)
  }

  const strength = getStrengthLabel()

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] relative flex flex-col justify-between overflow-hidden selection:bg-[#4D78FF]/20">
      {/* Ambient 3D Brand Decorations */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-45 -mr-16 -mt-16 z-0">
        <ConnectaCornerHelix className="w-[260px] h-[260px]" />
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-none opacity-40 z-0 hidden lg:block">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <defs>
            <radialGradient id="sphereGradForgot" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#8B7CFF" />
              <stop offset="60%" stopColor="#4D78FF" />
              <stop offset="100%" stopColor="#0A1020" />
            </radialGradient>
            <filter id="connectaSphereShadowForgot" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.35 0" />
            </filter>
          </defs>
          <Sphere3D cx={90} cy={90} r={46} gradientId="sphereGradForgot" shadowDx={0} shadowDy={10} />
          <SparkleStar x={148} y={42} size={22} fill="#F59E0B" />
        </svg>
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-36 h-9">
            <Image
              src="/brand/svg/connecta-logo.svg"
              alt="Connecta Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A1020] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-7 sm:p-9 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D78FF]/10 text-[#4D78FF] text-[11px] font-bold border border-[#4D78FF]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Password Recovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'New Password'}
              {step === 4 && 'Password Reset!'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {step === 1 && 'Enter your registered email address to receive a secure recovery code.'}
              {step === 2 && `Enter the 6-digit verification code sent to ${email}`}
              {step === 3 && 'Choose a strong, unique password to safeguard your Connecta workspace.'}
              {step === 4 && 'Your credentials have been updated. You can now sign in.'}
            </p>
          </div>

          {/* Feedback messages */}
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

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Registered Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-2 focus:ring-[#4D78FF]/15 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
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
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">6-Digit Code</label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-[#4D78FF] hover:underline"
                  >
                    Change email
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm tracking-widest font-mono text-center text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-2 focus:ring-[#4D78FF]/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn&apos;t receive a code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#4D78FF] hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-slate-400 font-semibold">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length < 4}
                className="w-full py-3.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
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
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-2 focus:ring-[#4D78FF]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Password Strength:</span>
                    <span className={`font-bold ${strength.textClass}`}>{strength.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-2 focus:ring-[#4D78FF]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
                className="w-full py-3.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
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
            <div className="text-center space-y-5 animate-in fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#0A1020]">Ready to Sign In</h3>
                <p className="text-xs text-slate-500">
                  Your new password is now active. Please sign in to access your dashboard.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Security footnote */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Encrypted Token Verification</span>
          </div>
        </div>
      </main>
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
