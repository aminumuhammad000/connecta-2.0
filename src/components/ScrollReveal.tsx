'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variant?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If reduced motion is requested, show immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, once])

  const getVariantStyles = () => {
    const bezier = 'cubic-bezier(0.16, 1, 0.3, 1)'
    const baseTransition = `opacity ${duration}ms ${bezier} ${delay}ms, transform ${duration}ms ${bezier} ${delay}ms`

    if (!isVisible) {
      switch (variant) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: 'translate3d(0, 28px, 0)',
            transition: baseTransition,
            willChange: 'opacity, transform',
          }
        case 'fade-in':
          return {
            opacity: 0,
            transition: baseTransition,
            willChange: 'opacity',
          }
        case 'scale-up':
          return {
            opacity: 0,
            transform: 'scale3d(0.96, 0.96, 1) translate3d(0, 16px, 0)',
            transition: baseTransition,
            willChange: 'opacity, transform',
          }
        case 'slide-left':
          return {
            opacity: 0,
            transform: 'translate3d(32px, 0, 0)',
            transition: baseTransition,
            willChange: 'opacity, transform',
          }
        case 'slide-right':
          return {
            opacity: 0,
            transform: 'translate3d(-32px, 0, 0)',
            transition: baseTransition,
            willChange: 'opacity, transform',
          }
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      transition: baseTransition,
    }
  }

  return (
    <div ref={ref} className={className} style={getVariantStyles()}>
      {children}
    </div>
  )
}
