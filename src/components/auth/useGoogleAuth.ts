'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Role = 'client' | 'provider'

interface GoogleCredentialResponse {
  credential?: string
}

interface GoogleIdApi {
  initialize: (config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
  }) => void
  prompt: (listener?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void
}

const googleIdApi = () =>
  (window as unknown as { google?: { accounts?: { id?: GoogleIdApi } } }).google?.accounts?.id

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '89671982625-iuj8vlsdjhcntlpdal9nbn6qi4hn01hf.apps.googleusercontent.com'

// The OAuth redirect URI registered with Google is /login, so every redirect-based flow lands there.
function redirectToGoogle(role: Role) {
  const redirectUri = `${window.location.origin}/login`
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=${encodeURIComponent('token id_token')}` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&state=${role}&nonce=${Date.now()}`
  window.location.href = url
}

export function useGoogleAuth({
  role,
  onSuccess,
  onError,
}: {
  role: Role
  onSuccess: (data: { message?: string; isNewUser?: boolean }) => void
  onError: (message: string) => void
}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const roleRef = useRef(role)
  const handlers = useRef({ onSuccess, onError })
  useEffect(() => {
    roleRef.current = role
    handlers.current = { onSuccess, onError }
  })

  const exchange = useCallback(async (credential: string, roleOverride?: Role) => {
    setIsGoogleLoading(true)
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role: roleOverride || roleRef.current }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || data.error || 'Google sign-in failed')
      handlers.current.onSuccess(data.data || {})
    } catch (err) {
      setIsGoogleLoading(false)
      handlers.current.onError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }, [])

  useEffect(() => {
    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script')
      script.id = 'google-gsi-client'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const hash = window.location.hash
    if (hash.includes('id_token=') || hash.includes('credential=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const token = params.get('id_token') || params.get('credential')
      const state = params.get('state')
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      if (token) exchange(token, state === 'provider' ? 'provider' : 'client')
    }
  }, [exchange])

  const startGoogle = useCallback(() => {
    const api = googleIdApi()
    if (!api) {
      redirectToGoogle(roleRef.current)
      return
    }
    api.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.credential) exchange(response.credential)
        else handlers.current.onError('Google did not return an account. Please try again.')
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    })
    api.prompt((n) => {
      if (n.isNotDisplayed() || n.isSkippedMoment()) redirectToGoogle(roleRef.current)
    })
  }, [exchange])

  return { startGoogle, isGoogleLoading }
}
