'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  Briefcase,
  Loader2,
} from 'lucide-react'
import {
  ConnectaCornerHelix,
  Sphere3D,
  SparkleStar,
} from '@/components/Connecta3DDecoration'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExpired = searchParams.get('expired') === '1'
  const roleParam = searchParams.get('role') || 'client'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [activeRole, setActiveRole] = useState<'client' | 'provider'>(
    roleParam === 'provider' ? 'provider' : 'client'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.')
      return
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setIsLoading(true)

    // Simulate authentication / API login verification
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setSuccessMsg('Welcome back! Initializing your workspace...')
      setTimeout(() => {
        if (activeRole === 'provider') {
          router.push('/admin/verification')
        } else {
          router.push('/requests/new')
        }
      }, 700)
    } catch {
      setErrorMsg('Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSuccessMsg(`Authenticated via Google as ${activeRole === 'provider' ? 'Specialist' : 'Client'}`)
      setTimeout(() => {
        router.push('/')
      }, 700)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] relative flex flex-col justify-between overflow-hidden selection:bg-[#4D78FF]/20">
      {/* Ambient 3D Brand Decorations */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-45 -mr-16 -mt-16 z-0">
        <ConnectaCornerHelix className="w-[260px] h-[260px]" />
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-none opacity-40 z-0 hidden lg:block">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <defs>
            <radialGradient id="sphereGradLogin" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#8B7CFF" />
              <stop offset="60%" stopColor="#4D78FF" />
              <stop offset="100%" stopColor="#0A1020" />
            </radialGradient>
            <filter id="connectaSphereShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.35 0" />
            </filter>
          </defs>
          <Sphere3D cx={90} cy={90} r={46} gradientId="sphereGradLogin" />
          <SparkleStar x={148} y={42} size={22} fill="#F59E0B" />
          <SparkleStar x={34} y={130} size={16} fill="#10B981" />
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

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">Don&apos;t have an account?</span>
          <Link
            href="/onboarding?step=role"
            className="text-xs font-extrabold px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0A1020] transition-colors shadow-xs"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-7 sm:p-9 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D78FF]/10 text-[#4D78FF] text-[11px] font-bold border border-[#4D78FF]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connecta Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in to manage your projects, escrow milestones, and team.
            </p>
          </div>

          {/* Session Expired Notice */}
          {isExpired && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Your session has expired. Please sign in again to continue safely.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Pill Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-[#F5F7FC] p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveRole('client')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'client'
                  ? 'bg-white text-[#0A1020] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#4D78FF]" />
              <span>Client / Hirer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('provider')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'provider'
                  ? 'bg-white text-[#0A1020] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Specialist / Pro</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-[#4D78FF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm text-[#4D78FF] focus:ring-0 w-3.5 h-3.5 border-slate-300"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in as {activeRole === 'provider' ? 'Specialist' : 'Client'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-2xs hover:border-slate-300 hover:shadow-xs cursor-pointer group active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Escrow Guarantee Notice */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>256-bit SSL Escrow Encrypted Workspace</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
