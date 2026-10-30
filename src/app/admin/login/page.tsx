'use client'

import React, { useState, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import { Spinner } from '@/components/brand/ConnectaLoader'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectUrl = searchParams.get('redirect') || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both administrator email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || 'Authentication failed. Please verify your credentials.'
        )
        setLoading(false)
        return
      }

      router.push(redirectUrl)
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-block relative w-44 h-11">
          <Image
            src="/brand/svg/connecta-logo.svg"
            alt="Connecta Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {errorMessage && (
          <div role="alert" className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@connecta.ng"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider">
                Admin Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0C513F] hover:bg-[#0f644e] active:scale-[0.99] text-white font-medium text-sm shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

      </div>

    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 font-sans">
      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-500 text-sm">
            <Spinner className="w-10 h-10 mx-auto" colored />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
