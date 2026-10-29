'use client'

import { useEffect, useState } from 'react'
import { ConnectaLoader, BrandStripe } from './ConnectaLoader'
import { SPLASH_SEEN_KEY } from './splash-boot'

const MIN_VISIBLE_MS = 1400

export default function SplashScreen() {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (document.documentElement.getAttribute('data-splash') === 'off') {
      const id = requestAnimationFrame(() => setGone(true))
      return () => cancelAnimationFrame(id)
    }
    const started = performance.now()

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started))
      window.setTimeout(() => {
        setLeaving(true)
        try {
          sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
        } catch {}
        window.setTimeout(() => setGone(true), 450)
      }, wait)
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    return () => window.removeEventListener('load', finish)
  }, [])

  if (gone) return null

  return (
    <div
      className="cn-splash fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
      data-leaving={leaving}
      aria-hidden={leaving}
    >
      <ConnectaLoader size={64} />
      <div className="mt-5 text-[19px] font-medium tracking-[-0.02em] text-ink">connecta</div>
      <div className="mt-1 text-[13px] text-muted">Trusted local professionals</div>
      <div className="absolute bottom-0 inset-x-0">
        <BrandStripe className="h-1" />
      </div>
    </div>
  )
}
