const SEGMENTS = [
  { seg: 'azure', color: '#1A73E8', d: 'M 69,22 C 56,10 39,10 27,22 C 15,34 14,51 21,63' },
  { seg: 'amber', color: '#F59E0B', d: 'M 21,63 C 28,75 40,82 52,80' },
  { seg: 'green', color: '#10B981', d: 'M 52,80 C 64,78 73,68 76,56' },
] as const

const TRACK = 'M 69,22 C 56,10 39,10 27,22 C 15,34 14,51 21,63 C 28,75 40,82 52,80 C 64,78 73,68 76,56'

interface ConnectaMarkProps {
  size?: number
  className?: string
}

export function ConnectaMark({ size = 24, className }: ConnectaMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      {SEGMENTS.map((s) => (
        <path
          key={s.seg}
          d={s.d}
          fill="none"
          stroke={s.color}
          strokeWidth={17}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

interface ConnectaLoaderProps {
  size?: number
  label?: string
  showTrack?: boolean
  mono?: boolean
  className?: string
}

export function ConnectaLoader({ size = 40, label, showTrack = true, mono = false, className = '' }: ConnectaLoaderProps) {
  return (
    <div role="status" aria-live="polite" className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="cn-loader" aria-hidden="true">
        {showTrack && (
          <path d={TRACK} fill="none" stroke="#EEF1F5" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {SEGMENTS.map((s) => (
          <path
            key={s.seg}
            data-seg={s.seg}
            d={s.d}
            pathLength={1}
            fill="none"
            stroke={mono ? 'currentColor' : s.color}
            strokeWidth={17}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {label ? (
        <span className="text-[13px] text-muted cn-fade" style={{ ['--d' as string]: '200ms' }}>
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  )
}

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="min-h-[55vh] w-full flex items-center justify-center">
      <ConnectaLoader size={48} label={label} />
    </div>
  )
}

export function Spinner({ className = 'w-4 h-4', colored = false }: { className?: string; colored?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={`cn-loader shrink-0 ${className}`} role="status" aria-label="Loading">
      {SEGMENTS.map((s) => (
        <path
          key={s.seg}
          data-seg={s.seg}
          d={s.d}
          pathLength={1}
          fill="none"
          stroke={colored ? s.color : 'currentColor'}
          strokeWidth={17}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

export function BrandStripe({ className = 'h-1' }: { className?: string }) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`} aria-hidden="true">
      <span className="flex-[5] bg-azure" />
      <span className="flex-[2] bg-warn" />
      <span className="flex-[3] bg-success" />
    </div>
  )
}
