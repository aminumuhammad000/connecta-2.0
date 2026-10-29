import type { CSSProperties } from 'react'

const INK = '#111827'
const LINE = '#D8DDE5'
const AZURE = '#1A73E8'
const AMBER = '#F59E0B'
const GREEN = '#10B981'

const stroke = {
  stroke: INK,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties

interface IllustrationProps {
  className?: string
}

function Backdrop() {
  return (
    <>
      <circle cx="80" cy="58" r="46" fill="#F3F5F8" />
      <ellipse cx="80" cy="108" rx="44" ry="3.5" fill="#EAEDF2" />
    </>
  )
}

export function IllustrationProjects({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Backdrop />
      <rect x="40" y="26" width="80" height="70" rx="9" fill="#fff" {...stroke} />
      <line x1="52" y1="40" x2="90" y2="40" {...stroke} />
      <line x1="52" y1="49" x2="74" y2="49" stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="56" y1="74" x2="104" y2="74" stroke={LINE} strokeWidth={2} strokeLinecap="round" />
      <line x1="56" y1="74" x2="80" y2="74" stroke={AZURE} strokeWidth={2} strokeLinecap="round" pathLength={1} className="cn-draw" style={delay(200)} />
      <circle cx="56" cy="74" r="5.5" fill={GREEN} />
      <polyline points="53.5,74 55.5,76 58.8,72" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="74" r="5.5" fill={AZURE} className="cn-fade" style={delay(700)} />
      <circle cx="104" cy="74" r="5.5" fill="#fff" stroke={LINE} strokeWidth={1.5} />
      <g className="cn-float">
        <rect x="104" y="16" width="30" height="15" rx="7.5" fill="#FFF7E8" stroke={AMBER} strokeWidth={1.5} />
        <line x1="111" y1="23.5" x2="127" y2="23.5" stroke={AMBER} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function IllustrationSearch({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Backdrop />
      <line x1="40" y1="98" x2="120" y2="98" stroke={LINE} strokeWidth={1.5} strokeDasharray="3 5" strokeLinecap="round" />
      <path d="M70 30a16 16 0 0 1 16 16c0 12-16 30-16 30S54 58 54 46a16 16 0 0 1 16-16z" fill="#fff" {...stroke} />
      <circle cx="70" cy="46" r="5" fill={AZURE} />
      <g className="cn-float">
        <circle cx="102" cy="70" r="14" fill="#fff" fillOpacity={0.85} {...stroke} />
        <line x1="112" y1="80" x2="121" y2="89" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M95 66a8 8 0 0 1 7-4" fill="none" stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function IllustrationShield({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Backdrop />
      <path d="M80 24l24 9v23c0 18-11 30-24 36-13-6-24-18-24-36V33z" fill="#fff" {...stroke} />
      <polyline points="69,57 77,65 92,49" fill="none" stroke={GREEN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="cn-draw" style={delay(250)} />
      <g className="cn-fade" style={delay(700)}>
        <path d="M116 26v8M112 30h8" stroke={AMBER} strokeWidth={1.5} strokeLinecap="round" />
        <circle cx="46" cy="46" r="3" fill={AZURE} />
        <circle cx="116" cy="80" r="2.5" fill={GREEN} />
      </g>
    </svg>
  )
}

export function IllustrationLedger({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Backdrop />
      <path d="M56 22h48v72l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4z" fill="#fff" {...stroke} />
      <line x1="64" y1="36" x2="96" y2="36" {...stroke} />
      <line x1="64" y1="46" x2="88" y2="46" stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="64" y1="55" x2="92" y2="55" stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="64" y1="74" x2="80" y2="74" {...stroke} />
      <line x1="88" y1="74" x2="96" y2="74" stroke={AZURE} strokeWidth={1.5} strokeLinecap="round" />
      <g className="cn-float">
        <circle cx="110" cy="84" r="11" fill="#FFF7E8" stroke={AMBER} strokeWidth={1.5} />
        <circle cx="110" cy="84" r="6" fill="none" stroke={AMBER} strokeWidth={1.5} />
      </g>
    </svg>
  )
}

export function IllustrationAssistant({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <circle cx="80" cy="60" r="40" fill="#EEF4FE" />
      <g transform="translate(52 32) scale(0.56)">
        <path d="M 69,22 C 56,10 39,10 27,22 C 15,34 14,51 21,63" fill="none" stroke={AZURE} strokeWidth={17} strokeLinecap="round" pathLength={1} className="cn-draw" />
        <path d="M 21,63 C 28,75 40,82 52,80" fill="none" stroke={AMBER} strokeWidth={17} strokeLinecap="round" pathLength={1} className="cn-draw" style={delay(450)} />
        <path d="M 52,80 C 64,78 73,68 76,56" fill="none" stroke={GREEN} strokeWidth={17} strokeLinecap="round" pathLength={1} className="cn-draw" style={delay(750)} />
      </g>
      <g className="cn-float">
        <rect x="110" y="22" width="32" height="18" rx="9" fill="#fff" {...stroke} />
        <circle cx="119" cy="31" r="1.6" fill={INK} />
        <circle cx="126" cy="31" r="1.6" fill={INK} />
        <circle cx="133" cy="31" r="1.6" fill={INK} />
      </g>
      <rect x="18" y="78" width="28" height="16" rx="8" fill="#fff" {...stroke} className="cn-fade" style={delay(900)} />
    </svg>
  )
}

export function IllustrationDisconnected({ className = 'w-40 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Backdrop />
      <path d="M24 70h34" fill="none" {...stroke} />
      <rect x="58" y="60" width="18" height="20" rx="4" fill="#fff" {...stroke} />
      <line x1="76" y1="65" x2="83" y2="65" {...stroke} />
      <line x1="76" y1="75" x2="83" y2="75" {...stroke} />
      <rect x="96" y="58" width="20" height="24" rx="5" fill="#fff" {...stroke} />
      <line x1="101" y1="65" x2="101" y2="68" {...stroke} />
      <line x1="101" y1="72" x2="101" y2="75" {...stroke} />
      <path d="M116 70h20" fill="none" {...stroke} />
      <g className="cn-fade" style={delay(300)}>
        <line x1="88" y1="52" x2="86" y2="46" stroke={AMBER} strokeWidth={1.5} strokeLinecap="round" />
        <line x1="92" y1="52" x2="95" y2="47" stroke={AMBER} strokeWidth={1.5} strokeLinecap="round" />
        <line x1="90" y1="88" x2="90" y2="94" stroke={AMBER} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function IllustrationWelcome({ className = 'w-60 h-30' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
      <line x1="20" y1="96" x2="220" y2="96" stroke="#EAEDF2" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M28 62L57 36l29 26" fill="none" {...stroke} />
      <rect x="34" y="58" width="46" height="38" rx="3" fill="#fff" {...stroke} />
      <rect x="51" y="74" width="12" height="22" rx="2" fill="#EEF4FE" {...stroke} />
      <path d="M82 44C110 8 140 8 166 38" fill="none" stroke={LINE} strokeWidth={1.5} strokeDasharray="2 4" strokeLinecap="round" />
      <path d="M82 44C110 8 140 8 166 38" fill="none" stroke={AZURE} strokeWidth={1.5} strokeLinecap="round" pathLength={1} className="cn-draw" style={delay(300)} />
      <circle cx="82" cy="44" r="4" fill={AZURE} className="cn-fade" style={delay(200)} />
      <circle cx="124.5" cy="17" r="4" fill={AMBER} className="cn-fade" style={delay(800)} />
      <circle cx="166" cy="38" r="4" fill={GREEN} className="cn-fade" style={delay(1300)} />
      <circle cx="186" cy="54" r="10" fill="#fff" {...stroke} />
      <path d="M175 51c0-9 22-9 22 0z" fill={AMBER} {...stroke} />
      <path d="M166 96c0-16 8-24 20-24s20 8 20 24" fill="#fff" {...stroke} />
    </svg>
  )
}
