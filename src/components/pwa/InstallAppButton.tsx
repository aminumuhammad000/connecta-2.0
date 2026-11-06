'use client'

import React, { useState, useEffect } from 'react'
import { Download, Smartphone } from 'lucide-react'

interface InstallAppButtonProps {
  className?: string
  variant?: 'button' | 'pill' | 'menu-item' | 'outline'
  showIconOnly?: boolean
}

export default function InstallAppButton({
  className = '',
  variant = 'button',
  showIconOnly = false,
}: InstallAppButtonProps) {
  const [isStandalone, setIsStandalone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      setIsStandalone(Boolean(isStandaloneMode))
    }
    checkStandalone()
  }, [])

  if (!mounted || isStandalone) {
    return null
  }

  const triggerInstall = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-connecta-install'))
    }
  }

  if (variant === 'menu-item') {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ${className}`}
      >
        <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Install App</span>
      </button>
    )
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    )
  }

  if (variant === 'outline') {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-line hover:border-azure/40 text-ink bg-surface hover:bg-canvas transition-colors cursor-pointer ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-azure" />
        <span>{showIconOnly ? '' : 'Install App'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={triggerInstall}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer ${className}`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  )
}
