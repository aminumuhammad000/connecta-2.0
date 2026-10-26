'use client'

import React, { useState, useEffect, Suspense } from 'react'
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

  // Restore remembered credentials on initial mount
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem('connecta_remember_enabled')
      const savedEmail = localStorage.getItem('connecta_remember_email')
      const savedPassword = localStorage.getItem('connecta_remember_password')
      const savedRole = localStorage.getItem('connecta_remember_role')

      if (isRemembered !== 'false' && savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
        if (savedPassword) {
          setPassword(savedPassword)
        }
        if (savedRole === 'client' || savedRole === 'provider') {
          setActiveRole(savedRole)
        }
      } else if (isRemembered === 'false') {
        setRememberMe(false)
      }
    } catch {
      // localStorage may not be accessible in strict private mode
    }
  }, [])

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Invalid email or password')
      }

      // Save or clear remembered password credentials based on toggle
      try {
        if (rememberMe) {
          localStorage.setItem('connecta_remember_email', email.trim().toLowerCase())
          localStorage.setItem('connecta_remember_password', password)
          localStorage.setItem('connecta_remember_role', activeRole)
          localStorage.setItem('connecta_remember_enabled', 'true')
        } else {
          localStorage.removeItem('connecta_remember_email')
          localStorage.removeItem('connecta_remember_password')
          localStorage.removeItem('connecta_remember_role')
          localStorage.setItem('connecta_remember_enabled', 'false')
        }
      } catch {
        // ignore storage errors
      }

      setSuccessMsg(data.data?.message || 'Welcome back! Initializing your workspace...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 600)
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '89671982625-iuj8vlsdjhcntlpdal9nbn6qi4hn01hf.apps.googleusercontent.com'

  // Listen for Google OAuth hash redirect (e.g. /login#id_token=...)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash && (hash.includes('id_token=') || hash.includes('credential='))) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const idToken = params.get('id_token') || params.get('credential')
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname)
        handleGoogleCredentialResponse({ credential: idToken })
      }
    }
  }, [])

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script')
      script.id = 'google-gsi-client'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      setErrorMsg('No Google credential returned. Please try again.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: response.credential,
          role: activeRole,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Google authentication failed')
      }

      setSuccessMsg(data.data?.message || 'Signed in successfully via Google!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setErrorMsg('')
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      const google = (window as any).google
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One-Tap is suppressed or blocked by browser popup settings, fallback to standard redirect
          const redirectUri = window.location.origin + '/login'
          const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`
          window.location.href = oauthUrl
        }
      })
    } else {
      // Direct OAuth fallback
      const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/login' : ''
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`
      window.location.href = oauthUrl
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Sleek Top Header Bar (matches Onboarding) */}
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
              Don&apos;t have an account?
            </span>
            <Link
              href="/onboarding"
              className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#053F28] transition-colors shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card - Adapts Onboarding Form Layout */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Header Heading matching Onboarding Step Headers */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight leading-[1.1]">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            Sign in to access your escrow vault, verified projects, and regional dispatch.
          </p>
        </div>

        {/* Card Frame matching Onboarding */}
        <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          {/* Session Expired Notice */}
          {isExpired && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Your session has expired. Please sign in again to continue safely.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs sm:text-sm text-rose-800 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs sm:text-sm text-emerald-800 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Pill Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">Account Type</label>
            <div className="grid grid-cols-2 gap-2 bg-[#F5F7FC] p-1.5 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveRole('client')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'client'
                    ? 'bg-[#053F28] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${activeRole === 'client' ? 'text-[#10B981]' : 'text-slate-400'}`} />
                <span>Client / Hirer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole('provider')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'provider'
                    ? 'bg-[#053F28] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${activeRole === 'provider' ? 'text-[#10B981]' : 'text-slate-400'}`} />
                <span>Specialist / Pro</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field - Styled identically to Onboarding */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
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
                  placeholder="e.g. ibrahim.aliyu@connecta.ng"
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#053F28] focus:bg-white focus:ring-4 focus:ring-[#053F28]/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field - Styled identically to Onboarding */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#053F28] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-11 pr-12 py-3.5 sm:py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#053F28] focus:bg-white focus:ring-4 focus:ring-[#053F28]/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setRememberMe(checked)
                    if (!checked) {
                      try {
                        localStorage.removeItem('connecta_remember_email')
                        localStorage.removeItem('connecta_remember_password')
                        localStorage.removeItem('connecta_remember_role')
                        localStorage.setItem('connecta_remember_enabled', 'false')
                      } catch {
                        // ignore
                      }
                    }
                  }}
                  className="w-4 h-4 rounded-md text-[#053F28] focus:ring-[#053F28] border-slate-300"
                />
                <span>Remember password on this device</span>
              </label>
            </div>

            {/* Primary Submit Button - Matching Onboarding Action Buttons */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white font-extrabold text-sm sm:text-base shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {activeRole === 'provider' ? 'Specialist' : 'Client'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Auth Button - Clean Rounded Pill */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-2xs hover:border-slate-300 cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>256-bit SSL Escrow Encrypted Workspace</span>
          </div>
        </div>
      </main>

      {/* Clean Footer Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} Connecta Technologies Ltd. All rights reserved.</span>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
