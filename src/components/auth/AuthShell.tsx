import Link from 'next/link'
import type { ReactNode } from 'react'
import { BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { BrandStripe, ConnectaMark, Spinner } from '@/components/brand/ConnectaLoader'
import { IllustrationWelcome } from '@/components/brand/illustrations'

const POINTS = [
  { icon: BadgeCheck, tone: 'bg-azure-50 text-azure', title: 'Verified professionals', body: 'Every pro is ID-checked and reviewed.' },
  { icon: ShieldCheck, tone: 'bg-success-50 text-success-ink', title: 'Protected payments', body: 'Pay only when you approve the work.' },
  { icon: Sparkles, tone: 'bg-warn-50 text-warn-ink', title: 'Help in seconds', body: 'Describe a problem, get matched fast.' },
]

export function AuthShell({
  children,
  topRight,
}: {
  children: ReactNode
  topRight?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex font-sans antialiased">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-5 sm:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ConnectaMark size={24} />
            <span className="text-[18px] font-medium tracking-[-0.02em]">connecta</span>
          </Link>
          {topRight}
        </header>
        <main className="flex-1 flex items-center justify-center px-5 py-8 sm:py-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="px-5 sm:px-10 py-6 flex items-center justify-between text-xs text-subtle">
          <span>© {new Date().getFullYear()} Connecta</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </footer>
      </div>

      <aside className="hidden lg:flex w-[44%] max-w-[620px] relative bg-surface border-l border-line flex-col justify-center px-14 overflow-hidden">
        <div className="absolute top-0 inset-x-0">
          <BrandStripe className="h-1" />
        </div>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-azure-50" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-success-50" aria-hidden="true" />
        <div className="absolute bottom-24 right-16 w-20 h-20 rounded-full bg-warn-50" aria-hidden="true" />

        <div className="relative">
          <div className="cn-rise">
            <IllustrationWelcome className="w-80 h-40 -ml-4" />
          </div>
          <h2 className="mt-8 text-[30px] leading-[1.15] font-medium tracking-[-0.02em] cn-rise" style={{ ['--d' as string]: '100ms' }}>
            Find the right hands
            <br />
            for every job at home.
          </h2>
          <ul className="mt-9 space-y-5">
            {POINTS.map((p, i) => {
              const Icon = p.icon
              return (
                <li key={p.title} className="flex items-start gap-3.5 cn-rise" style={{ ['--d' as string]: `${200 + i * 90}ms` }}>
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.tone}`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium">{p.title}</span>
                    <span className="block text-sm text-muted mt-0.5">{p.body}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export function GoogleButton({ onClick, loading, label = 'Continue with Google' }: { onClick: () => void; loading?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full h-12 rounded-xl bg-surface border border-line-strong hover:border-ink/25 hover:bg-canvas text-[15px] font-medium text-ink flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-wait"
    >
      {loading ? (
        <Spinner className="w-5 h-5" colored />
      ) : (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )}
      {loading ? 'Connecting to Google' : label}
    </button>
  )
}

export function OrDivider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6 text-xs text-subtle">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

export function AuthRedirecting({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center cn-fade">
      <Spinner className="w-14 h-14" colored />
      <p className="mt-5 text-[15px] font-medium text-ink">{message}</p>
      <p className="mt-1 text-sm text-muted">Setting up your dashboard</p>
    </div>
  )
}
