'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Download,
  X,
  Share,
  PlusSquare,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [installSuccess, setInstallSuccess] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Check for updates
            reg.onupdatefound = () => {
              const installingWorker = reg.installing
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('[PWA] New version available')
                    }
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err)
          })
      })
    }

    // 2. Check if already running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')

      setIsStandalone(Boolean(isStandaloneMode))
      return Boolean(isStandaloneMode)
    }

    const standalone = checkStandalone()
    if (standalone) return

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIOSDevice)

    // Check dismissal cooldown (dismissed within last 5 days)
    const dismissedTime = localStorage.getItem('cn_pwa_dismissed')
    const cooldownMs = 5 * 24 * 60 * 60 * 1000
    const isDismissed =
      dismissedTime && Date.now() - parseInt(dismissedTime, 10) < cooldownMs

    // 4. Android / Chromium: capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      if (!isDismissed) {
        // Show after a brief delay so user gets context of page first
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // 5. Detect when installed successfully
    const handleAppInstalled = () => {
      setShowPrompt(false)
      setShowIOSModal(false)
      setDeferredPrompt(null)
      setIsStandalone(true)
      setInstallSuccess(true)
      localStorage.setItem('cn_pwa_installed', 'true')
      setTimeout(() => setInstallSuccess(false), 5000)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // 6. Listen for custom manual install trigger from anywhere in the app
    const handleManualTrigger = () => {
      if (checkStandalone()) return
      if (isIOSDevice) {
        setShowIOSModal(true)
      } else if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            setShowPrompt(false)
          }
        })
      } else {
        // Fallback for browsers without direct prompt event
        setShowIOSModal(true)
      }
    }

    window.addEventListener('open-connecta-install', handleManualTrigger)

    // If on iOS and not dismissed, show prompt after delay
    if (isIOSDevice && !isDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 4000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
        window.removeEventListener('open-connecta-install', handleManualTrigger)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('open-connecta-install', handleManualTrigger)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowPrompt(false)
      setShowIOSModal(true)
      return
    }

    if (!deferredPrompt) {
      // Fallback instructions
      setShowIOSModal(true)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
      setInstallSuccess(true)
      setTimeout(() => setInstallSuccess(false), 5000)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSModal(false)
    localStorage.setItem('cn_pwa_dismissed', Date.now().toString())
  }

  if (isStandalone) {
    return null
  }

  return (
    <>
      {/* 1. Success Pill Toast */}
      {installSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>Connecta installed to your home screen!</span>
        </div>
      )}

      {/* 2. Floating Bottom Install Card / Banner */}
      {showPrompt && (
        <aside
          aria-label="Install Connecta Progressive Web App"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-[999] bg-[#0A1020]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] text-white animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blue-600 shrink-0 border border-white/20 shadow-md">
              <Image
                src="/icons/icon-192x192.png"
                alt="Connecta App Icon"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-white tracking-tight">Connecta</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  App
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5 leading-snug">
                Install on your {isIOS ? 'iPhone' : 'phone'} for 1-tap access, offline use & instant quote alerts.
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleDismiss}
              className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 3. iPhone / iOS Add to Home Screen Instructions Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-md bg-[#0F172A] border border-white/15 rounded-3xl p-6 text-white shadow-2xl relative animate-in slide-in-from-bottom-6 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Close instructions"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 overflow-hidden border border-white/20 p-1 shrink-0">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="Connecta Icon"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install Connecta on iPhone</h3>
                <p className="text-xs text-white/60">Works as a native progressive web app</p>
              </div>
            </div>

            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/80">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">Tap the Share button</p>
                  <p className="text-white/60 mt-0.5">
                    In Safari's bottom toolbar, tap the Share icon{' '}
                    <Share className="w-3.5 h-3.5 text-blue-400 inline mx-0.5 -mt-0.5" />
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">Select &quot;Add to Home Screen&quot;</p>
                  <p className="text-white/60 mt-0.5">
                    Scroll down the options list and tap{' '}
                    <span className="text-white font-medium inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">
                      <PlusSquare className="w-3 h-3 text-emerald-400" />
                      Add to Home Screen
                    </span>
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">Tap &quot;Add&quot; in Top Right</p>
                  <p className="text-white/60 mt-0.5">
                    Connecta will be added to your home screen with its official icon and full-screen experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
