'use client'

import React from 'react'

/**
 * 3D Glass Sphere with realistic radial lighting, specular highlight, and ambient drop shadow.
 */
export function Sphere3D({
  cx,
  cy,
  r,
  gradientId,
  shadowDx = 0,
  shadowDy = 12,
  className = '',
  style = {},
}: {
  cx: number
  cy: number
  r: number
  gradientId: string
  shadowDx?: number
  shadowDy?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <g className={className} style={style}>
      {/* Soft blurred drop shadow */}
      <ellipse
        cx={cx + shadowDx}
        cy={cy + shadowDy + r * 0.75}
        rx={r * 0.85}
        ry={r * 0.28}
        fill="rgba(0, 0, 0, 0.22)"
        filter="url(#connectaSphereShadow)"
      />
      {/* 3D Sphere body */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} />
      {/* Crisp specular reflection highlight */}
      <ellipse
        cx={cx - r * 0.3}
        cy={cy - r * 0.32}
        rx={r * 0.26}
        ry={r * 0.16}
        fill="#FFFFFF"
        opacity="0.82"
        transform={`rotate(-28, ${cx - r * 0.3}, ${cy - r * 0.32})`}
      />
      {/* Secondary micro-glint */}
      <circle
        cx={cx - r * 0.12}
        cy={cy - r * 0.44}
        r={r * 0.08}
        fill="#FFFFFF"
        opacity="0.65"
      />
      {/* Ambient bottom-edge rim reflection */}
      <ellipse
        cx={cx + r * 0.18}
        cy={cy + r * 0.28}
        rx={r * 0.45}
        ry={r * 0.2}
        fill="#FFFFFF"
        opacity="0.14"
        transform={`rotate(20, ${cx + r * 0.18}, ${cy + r * 0.28})`}
      />
    </g>
  )
}

/**
 * 4-Point Sparkle Star
 */
export function SparkleStar({
  x,
  y,
  size = 18,
  fill = '#F59E0B',
  className = '',
  style = {},
}: {
  x: number
  y: number
  size?: number
  fill?: string
  className?: string
  style?: React.CSSProperties
}) {
  const half = size / 2
  const quarter = size / 5
  return (
    <path
      d={`M ${x} ${y - half} Q ${x} ${y - quarter} ${x + quarter} ${y} Q ${x} ${y + quarter} ${x} ${y + half} Q ${x} ${y + quarter} ${x - quarter} ${y} Q ${x} ${y - quarter} ${x} ${y - half} Z`}
      fill={fill}
      className={className}
      style={style}
      opacity="0.9"
    />
  )
}

/**
 * Connecta Corner 3D Helix Ribbon & Floating Brand Beads
 * Inspired by deco.png - positioned to hover dynamically over the corner of dark cards
 * (e.g., "Who Connecta Serves") or in hero containers.
 */
export function ConnectaCornerHelix({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none select-none relative w-full h-full max-w-[440px] max-h-[380px] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="60 30 340 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain object-top-right overflow-visible"
      >
        <defs>
          {/* Sphere shadow filter */}
          <filter
            id="connectaSphereShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>

          {/* Ribbon ambient glow */}
          <filter
            id="ribbonGlow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Connecta Emerald 3D Gradient */}
          <radialGradient
            id="sphereEmerald"
            cx="32%"
            cy="28%"
            r="68%"
            fx="26%"
            fy="22%"
          >
            <stop offset="0%" stopColor="#7EF2B5" />
            <stop offset="28%" stopColor="#00C466" />
            <stop offset="68%" stopColor="#08753F" />
            <stop offset="100%" stopColor="#04381E" />
          </radialGradient>

          {/* Tech Electric Blue 3D Gradient */}
          <radialGradient
            id="sphereBlue"
            cx="32%"
            cy="28%"
            r="68%"
            fx="26%"
            fy="22%"
          >
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="28%" stopColor="#3B82F6" />
            <stop offset="68%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* Solar Amber 3D Gradient */}
          <radialGradient
            id="sphereAmber"
            cx="32%"
            cy="28%"
            r="68%"
            fx="26%"
            fy="22%"
          >
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>

          {/* Obsidian Onyx 3D Gradient */}
          <radialGradient
            id="sphereObsidian"
            cx="32%"
            cy="28%"
            r="68%"
            fx="26%"
            fy="22%"
          >
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="35%" stopColor="#1E293B" />
            <stop offset="75%" stopColor="#0A1020" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Crystal Lilac 3D Gradient */}
          <radialGradient
            id="sphereLilac"
            cx="32%"
            cy="28%"
            r="68%"
            fx="26%"
            fy="22%"
          >
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="32%" stopColor="#C4B5FD" />
            <stop offset="70%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </radialGradient>

          {/* 3D Iridescent Glass Ribbon (Front Loop) */}
          <linearGradient
            id="glassRibbonFront"
            x1="80"
            y1="50"
            x2="380"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBF3E4" stopOpacity="0.92" />
            <stop offset="22%" stopColor="#98C7FF" stopOpacity="0.88" />
            <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#DBD5F9" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#FCECB2" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#00C466" stopOpacity="0.88" />
          </linearGradient>

          {/* 3D Glass Ribbon (Back Loop / Shaded Depth) */}
          <linearGradient
            id="glassRibbonBack"
            x1="120"
            y1="280"
            x2="350"
            y2="80"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#1E3A8A" stopOpacity="0.70" />
            <stop offset="65%" stopColor="#4338CA" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.75" />
          </linearGradient>

          {/* Glass Ridge Specular Highlight */}
          <linearGradient
            id="glassRidgeGlow"
            x1="60"
            y1="60"
            x2="360"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#98C7FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </linearGradient>

          {/* Translucent Caustic Blur */}
          <radialGradient id="causticAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C466" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#4D78FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00C466" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient colored backdrop blur behind the ribbon */}
        <circle
          cx="220"
          cy="190"
          r="140"
          fill="url(#causticAura)"
          className="animate-pulse-glow"
        />

        {/* Back Ribbon Twist (Underneath the spheres) */}
        <g className="animate-float-slow">
          <path
            d="M 120 280 C 70 230, 80 140, 150 90 C 220 40, 310 50, 350 110 C 375 148, 360 210, 310 240 C 255 272, 185 240, 160 200"
            fill="none"
            stroke="url(#glassRibbonBack)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </g>

        {/* Deep / Background Spheres */}
        <Sphere3D
          cx={135}
          cy={88}
          r={18}
          gradientId="sphereEmerald"
          className="animate-orb-drift"
          style={{ animationDelay: '0.5s' }}
        />
        <Sphere3D
          cx={348}
          cy={105}
          r={22}
          gradientId="sphereAmber"
          className="animate-orb-drift"
          style={{ animationDelay: '2.5s' }}
        />

        {/* Primary 3D Glass Helix (Front Overlapping Loop) */}
        <g className="animate-float-slow" style={{ animationDelay: '-1.5s' }}>
          {/* Main front iridescent glass body */}
          <path
            d="M 130 295 C 190 325, 290 310, 340 250 C 390 190, 370 100, 290 80 C 210 60, 140 120, 145 190 C 150 245, 215 275, 275 255 C 320 240, 350 195, 345 155"
            fill="none"
            stroke="url(#glassRibbonFront)"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ribbonGlow)"
          />

          {/* Crisp Glass Outer Edge Specular Stroke */}
          <path
            d="M 135 285 C 195 315, 285 300, 332 245 C 378 190, 360 108, 288 88 C 215 68, 148 125, 152 188 C 156 238, 215 268, 270 250"
            fill="none"
            stroke="url(#glassRidgeGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Inner Light Refraction Core */}
          <path
            d="M 148 290 C 200 310, 275 295, 320 245 C 355 205, 348 135, 285 98"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="14 6"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>

        {/* Prominent Foreground 3D Spheres (Matching deco.png signature placement) */}
        {/* Large Royal Blue Sphere nestled in helix center */}
        <Sphere3D
          cx={245}
          cy={175}
          r={34}
          gradientId="sphereBlue"
          className="animate-orb-drift"
          style={{ animationDelay: '1s' }}
        />

        {/* Connecta Emerald Sphere hovering foreground-left */}
        <Sphere3D
          cx={95}
          cy={220}
          r={26}
          gradientId="sphereEmerald"
          className="animate-orb-drift"
          style={{ animationDelay: '1.8s' }}
        />

        {/* Obsidian Bead anchored lower-right */}
        <Sphere3D
          cx={355}
          cy={275}
          r={19}
          gradientId="sphereObsidian"
          className="animate-orb-drift"
          style={{ animationDelay: '3s' }}
        />

        {/* Lilac Accent Orb at top apex */}
        <Sphere3D
          cx={205}
          cy={52}
          r={16}
          gradientId="sphereLilac"
          className="animate-orb-drift"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Sparkle Micro-Accents */}
        <SparkleStar
          x={110}
          y={150}
          size={16}
          fill="#F59E0B"
          className="animate-pulse"
        />
        <SparkleStar
          x={375}
          y={190}
          size={14}
          fill="#00C466"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <SparkleStar
          x={280}
          y={40}
          size={18}
          fill="#F59E0B"
          className="animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </svg>
    </div>
  )
}

/**
 * Hero Floating 3D Accent - Left Side
 * Delicate floating glass ribbon curve and dual brand spheres for hero ambient depth
 */
export function ConnectaHeroLeftDecoration({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none select-none relative w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <filter id="heroLeftShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <linearGradient id="heroRibbonGrad1" x1="20" y1="20" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C466" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#98C7FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DBD5F9" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="hEmerald" cx="32%" cy="28%" r="68%" fx="26%" fy="22%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="35%" stopColor="#00C466" />
            <stop offset="80%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#022C22" />
          </radialGradient>
          <radialGradient id="hAmber" cx="32%" cy="28%" r="68%" fx="26%" fy="22%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>
        </defs>

        <g className="animate-float-slow">
          <path
            d="M 30 180 C 20 110, 80 50, 160 50 C 220 50, 240 100, 210 160 C 180 220, 110 230, 60 190"
            fill="none"
            stroke="url(#heroRibbonGrad1)"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 35 175 C 26 115, 82 58, 158 58 C 215 58, 232 102, 205 158"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* Ambient floating orbs */}
        <Sphere3D cx={165} cy={125} r={24} gradientId="hEmerald" className="animate-orb-drift" />
        <Sphere3D cx={70} cy={75} r={16} gradientId="hAmber" className="animate-orb-drift" style={{ animationDelay: '1.5s' }} />
        <SparkleStar x={200} y={60} size={15} fill="#F59E0B" className="animate-pulse" />
      </svg>
    </div>
  )
}

/**
 * Hero Floating 3D Accent - Right Side
 * Translucent blue/emerald helix loop and floating beads
 */
export function ConnectaHeroRightDecoration({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none select-none relative w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="heroRibbonGrad2" x1="240" y1="30" x2="30" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCECB2" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#4D78FF" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#00C466" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#98C7FF" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="hBlue" cx="32%" cy="28%" r="68%" fx="26%" fy="22%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="35%" stopColor="#3B82F6" />
            <stop offset="80%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
          <radialGradient id="hObsidian" cx="32%" cy="28%" r="68%" fx="26%" fy="22%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="35%" stopColor="#1E293B" />
            <stop offset="80%" stopColor="#0A1020" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        <g className="animate-float-reverse">
          <path
            d="M 230 80 C 240 150, 180 210, 100 210 C 40 210, 20 160, 50 100 C 80 40, 150 30, 200 70"
            fill="none"
            stroke="url(#heroRibbonGrad2)"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 225 85 C 234 145, 178 202, 102 202 C 45 202, 28 158, 55 102"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* Ambient floating orbs */}
        <Sphere3D cx={105} cy={135} r={26} gradientId="hBlue" className="animate-orb-drift" style={{ animationDelay: '0.8s' }} />
        <Sphere3D cx={195} cy={185} r={17} gradientId="hObsidian" className="animate-orb-drift" style={{ animationDelay: '2.2s' }} />
        <SparkleStar x={55} y={195} size={15} fill="#00C466" className="animate-pulse" />
      </svg>
    </div>
  )
}
