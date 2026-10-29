import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BrandStripe, ConnectaMark } from '@/components/brand/ConnectaLoader'

export function PublicShell({
  children,
  actions,
  backHref,
  backLabel = 'Back',
  width = 'max-w-6xl',
}: {
  children: ReactNode
  actions?: ReactNode
  backHref?: string
  backLabel?: string
  width?: string
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans antialiased">
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-line">
        <BrandStripe className="h-[3px]" />
        <div className={`${width} mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-2 min-w-0">
            {backHref && (
              <Link
                href={backHref}
                aria-label={backLabel}
                title={backLabel}
                className="w-9 h-9 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <Link href="/" className="flex items-center gap-2.5">
              <ConnectaMark size={22} />
              <span className="text-[17px] font-medium tracking-[-0.02em]">connecta</span>
            </Link>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>

      <main className={`flex-1 w-full ${width} mx-auto px-5 sm:px-8 py-8 sm:py-12`}>{children}</main>

      <footer className="border-t border-line">
        <div className={`${width} mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-subtle`}>
          <span>© {new Date().getFullYear()} Connecta · Trusted local professionals</span>
          <div className="flex items-center gap-5">
            <Link href="/discover" className="hover:text-ink transition-colors">
              Find professionals
            </Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
