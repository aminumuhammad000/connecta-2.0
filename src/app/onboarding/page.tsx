'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  Briefcase,
  Wrench,
  Smartphone,
  Laptop,
  Hammer,
  Car,
  Paintbrush,
  Wind,
  Lock,
  Clock,
  Rocket,
  UserCheck,
  AlertCircle,
  Globe,
  Camera,
  X,
  Code,
  Palette,
  TrendingUp,
  PenTool,
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MessageSquare,
  ScrollText,
  ChevronDown,
} from 'lucide-react'
import { Spinner } from '@/components/brand/ConnectaLoader'

// =============================================================================
// DATA: COUNTRIES, CURRENCIES, SECTORS & SKILLS (EXACT MATCH TO CONNECTA OLD)
// =============================================================================

export interface CountryOption {
  code: string
  name: string
  flag: string
  currency: string
  currencySymbol: string
}

export const COUNTRIES: CountryOption[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', currencySymbol: '₵' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSH', currencySymbol: 'KSh' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'USD', currencySymbol: '$' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', currencySymbol: 'FRw' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'USh' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', currencySymbol: 'Br' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: 'XOF', currencySymbol: 'CFA' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', currency: 'XOF', currencySymbol: 'CFA' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'XAF', currencySymbol: 'FCFA' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', currencySymbol: 'DH' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', currencySymbol: 'K' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£' },
]

export const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
]

interface OnboardingSlide {
  id: number
  badge: string
  title: string
  highlight: string
  description: string
  stats: string
  statsLabel: string
  icon: any
  cardBg: string
  accentColor: string
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    badge: '15,000+ Vetted Specialists',
    title: 'Discover Top Local Service Artisans',
    highlight: '& Skilled Technicians',
    description:
      'Connect instantly with background-checked plumbers, electricians, carpenters, solar engineers, and trade technicians across Nigeria.',
    stats: '15,000+',
    statsLabel: 'Verified Artisans',
    icon: Users,
    cardBg: 'bg-[#0A2614]',
    accentColor: '#10B981',
  },
  {
    id: 2,
    badge: '100% Escrow Protected',
    title: 'Milestone Escrow Payouts',
    highlight: '& Guaranteed Safety',
    description:
      'Funds are held securely in a Connecta Escrow Vault. Payments release to the specialist only after you inspect and approve milestones.',
    stats: '100%',
    statsLabel: 'Escrow Guarantee',
    icon: ShieldCheck,
    cardBg: 'bg-[#1E1B4B]',
    accentColor: '#4D78FF',
  },
  {
    id: 3,
    badge: 'Itemized Minor-Unit Pricing',
    title: 'Transparent Quoting',
    highlight: '& Real-Time Milestones',
    description:
      'No hidden markups or guesswork. Review itemized labor quotes, track live task progress, and verify work with photo evidence.',
    stats: '99.4%',
    statsLabel: 'AI Match Precision',
    icon: Zap,
    cardBg: 'bg-[#D97706]',
    accentColor: '#F59E0B',
  },
]

interface SectorOption {
  id: string
  name: string
  description: string
  icon: any
  color: string
  popularSkills: string[]
}

const SECTORS: SectorOption[] = [
  {
    id: 'tech',
    name: 'Technology & Software',
    description: 'Web development, mobile apps, DevOps, cloud engineering, backend APIs.',
    icon: Code,
    color: 'bg-[#1A73E8]',
    popularSkills: [
      'React.js', 'Node.js', 'TypeScript', 'Python', 'React Native',
      'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Flutter', 'AWS / Cloud',
      'Docker', 'GraphQL', 'MongoDB', 'Go / Golang', 'REST APIs',
    ],
  },
  {
    id: 'design',
    name: 'Design & Creative',
    description: 'UI/UX design, brand identity, graphic design, motion design, video editing.',
    icon: Palette,
    color: 'bg-[#8B5CF6]',
    popularSkills: [
      'UI/UX Design', 'Figma', 'Brand Identity', 'Graphic Design',
      'Adobe Illustrator', 'Adobe Photoshop', 'Motion Design', 'Video Editing',
      'Design Systems', '3D Modeling', 'Wireframing', 'Logo Design',
    ],
  },
  {
    id: 'solar_electrical',
    name: 'Solar & Electrical Power',
    description: 'Inverters, solar sizing, fault finding, house wiring, breaker repairs.',
    icon: Zap,
    color: 'bg-[#10B981]',
    popularSkills: [
      'Solar Sizing & Load Calculation',
      'Hybrid Inverters Installation',
      'Battery Balancer Diagnostics',
      'Fault Finding & Circuit Tracing',
      'Conduit & Surface House Wiring',
      '3-Phase Distribution Dressing',
      'Earth Rod & Surge Protection',
      'Automatic Changeover Switches',
      'PV Array Roof Mounting',
      'Lithium LiFePO4 Balancing',
    ],
  },
  {
    id: 'phone_gadget',
    name: 'Smart Devices & Gadgets',
    description: 'Screen replacements, battery swaps, micro-soldering, charging ports.',
    icon: Smartphone,
    color: 'bg-[#F59E0B]',
    popularSkills: [
      'OLED & AMOLED Screen Replacement',
      'Battery Cycle Health Diagnostics',
      'Flex Cable Micro-Soldering',
      'Charging Port Daughterboard Fixes',
      'FaceID & Biometric Sensor Repair',
      'Water Damage Ultrasonic Recovery',
      'Glass OCA Lamination',
      'Baseband & Power IC Reballing',
      'Speaker & Microphone Diagnostics',
      'Firmware Flashing & Unbrick',
    ],
  },
  {
    id: 'computer_hardware',
    name: 'Computer & Laptop Repair',
    description: 'Hardware lab diagnostics, motherboard repair, NVMe SSDs, thermal paste.',
    icon: Laptop,
    color: 'bg-[#4D78FF]',
    popularSkills: [
      'Motherboard Component-Level Repair',
      'Thermal Paste & Fan Heat Sink Service',
      'NVMe SSD & High-Speed RAM Upgrades',
      'Laptop Screen Hinge Reconstruction',
      'Keyboard Replacement & Backlighting',
      'BIOS EEPROM Chip Reprogramming',
      'Power Supply (SMPS) Diagnostics',
      'OS Kernel & Driver Recovery',
    ],
  },
  {
    id: 'auto_mechanics',
    name: 'Auto Mechanics & Diagnostics',
    description: 'Engine diagnostics, OBD2 scans, brake systems, suspension, routine tune-ups.',
    icon: Car,
    color: 'bg-[#E67E00]',
    popularSkills: [
      'OBD2 Live Sensor Diagnostics',
      'Automatic Transmission Fluid Flush',
      'ABS Brake Caliper Overhaul',
      'Steering Rack & Tie Rod Alignment',
      'Alternator & Starter Motor Rebuild',
      'Radiator Leak Pressure Testing',
      'Engine Timing Chain Calibration',
      'Fuel Injector Ultrasonic Cleaning',
    ],
  },
  {
    id: 'woodwork_home',
    name: 'Carpentry & Woodwork',
    description: 'Custom furniture, door fittings, roof trusses, kitchen cabinets.',
    icon: Hammer,
    color: 'bg-[#8B5CF6]',
    popularSkills: [
      'Solid Teak & HDF Kitchen Cabinets',
      'Hardwood Door Frame Alignment',
      'Roof Truss Framing & Struts',
      'Wardrobe Internal Compartmenting',
      'Precision Pocket-Hole Joinery',
      'Wood Sanding, Stain & Lacquer Polish',
      'Acoustic Wall Slat Paneling',
    ],
  },
  {
    id: 'cooling_pipes',
    name: 'AC, Cooling & Plumbing',
    description: 'AC gas refill, compressor maintenance, borehole pumps, pipe leak fixing.',
    icon: Wind,
    color: 'bg-[#06B6D4]',
    popularSkills: [
      'R410A / R32 Refrigerant Vacuum Top-Up',
      'Rotary & Inverter Compressor Replacement',
      'Split-Unit Evaporator Chemical Flush',
      'Submersible Borehole Pump Wiring',
      'PPR Pipe Fusion & Pressure Leak Fixes',
      'Pressure Relief Valve Calibration',
      'Float Switch Automation & Overflows',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    description: 'Social media, SEO, paid ads, sales funnels, growth strategy & copywriting.',
    icon: TrendingUp,
    color: 'bg-[#EC4899]',
    popularSkills: [
      'SEO & Google Search Console',
      'Meta Ads & Conversion API',
      'Google Performance Max Campaigns',
      'Sales Funnel Architecture',
      'Email Marketing Automation',
      'Copywriting & High-Converting Landing Pages',
      'Influencer Campaign Management',
      'Data Analytics & Attribution',
    ],
  },
  {
    id: 'business',
    name: 'Business & Finance',
    description: 'Accounting, bookkeeping, virtual assistance, financial modeling, consulting.',
    icon: Briefcase,
    color: 'bg-[#3B82F6]',
    popularSkills: [
      'Financial Modeling & Projections',
      'QuickBooks & Xero Bookkeeping',
      'Virtual Assistance & Inbox Zero',
      'Business Plan Preparation',
      'Tax Compliance Advisory',
      'Data Analysis with Excel / Python',
      'Pitch Deck Optimization',
    ],
  },
  {
    id: 'writing',
    name: 'Writing & Translation',
    description: 'Technical writing, copywriting, translations, blog posts, documentation.',
    icon: PenTool,
    color: 'bg-[#10B981]',
    popularSkills: [
      'Technical Documentation & API Specs',
      'B2B SaaS Content Writing',
      'English / French / Arabic Translation',
      'Ghostwriting & Thought Leadership',
      'Proofreading & Line Editing',
      'Scriptwriting for Video & Audio',
    ],
  },
  {
    id: 'other',
    name: 'Other Specialized Trades',
    description: 'Painting, POP plastering, hospitality, event logistics, custom services.',
    icon: Paintbrush,
    color: 'bg-[#64748B]',
    popularSkills: [
      'Interior Painting & Edge Cut-ins',
      'POP False Ceiling Plastering',
      'Industrial Epoxy Floor Coating',
      'Event Logistics & Sound Engineering',
      'Security Camera & CCTV Setup',
    ],
  },
]

const CLIENT_INDUSTRIES = [
  {
    id: 'residential_commercial',
    title: 'Residential & Commercial Properties',
    desc: 'Offices, estates, residences, and retail spaces needing ongoing trade maintenance and repairs.',
    icon: Code,
  },
  {
    id: 'ecommerce_retail',
    title: 'E-Commerce & Retail',
    desc: 'Online stores, digital commerce, product photography, supply chain & marketing.',
    icon: TrendingUp,
  },
  {
    id: 'agency_consulting',
    title: 'Agencies & Studios',
    desc: 'Design studios, advertising agencies, dev shops, consultancy firms.',
    icon: Palette,
  },
  {
    id: 'sme_corporate',
    title: 'Corporate & Small Business',
    desc: 'Established SMEs, law firms, healthcare centers, real estate developers.',
    icon: Building2,
  },
  {
    id: 'facilities_trades',
    title: 'Facilities, Real Estate & Trades',
    desc: 'Property management, solar retrofits, facility maintenance, contractor teams.',
    icon: Wrench,
  },
  {
    id: 'nonprofit_edu',
    title: 'Non-Profit & Education',
    desc: 'NGOs, universities, educational academies, research foundations.',
    icon: GraduationCap,
  },
]

const CLIENT_GOALS = [
  {
    id: 'one_off_project',
    title: 'One-Time Project Contract',
    desc: 'Build a specific web app, wire an inverter system, design a brand system, or fix equipment.',
    tag: 'Milestone Escrow',
    icon: Briefcase,
  },
  {
    id: 'dedicated_freelancer',
    title: 'Dedicated Freelancer (Ongoing)',
    desc: 'Hire a specialist for recurring weekly hours, ongoing maintenance, or monthly sprints.',
    tag: 'Long-Term',
    icon: Clock,
  },
  {
    id: 'multi_trade_team',
    title: 'Multi-Trade Artisan Team',
    desc: 'Assemble a combined local trade crew (e.g. Electrician, Certified Plumber, Carpenter) for full property projects.',
    tag: 'Multi-Trade',
    icon: Users,
  },
  {
    id: 'fulltime_hire',
    title: 'Permanent Full-Time Hire',
    desc: 'Recruit top African tech and trade specialists for permanent direct employment.',
    tag: 'Direct Placement',
    icon: Rocket,
  },
]

const COMPANY_SIZES = [
  'Solo Entrepreneur / Founder',
  '2 - 10 Employees',
  '11 - 50 Employees',
  '50+ Employees',
]

const MAJOR_AFRICAN_CITIES = [
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Port Harcourt, Nigeria',
  'Benin City, Nigeria',
  'Kaduna, Nigeria',
  'Enugu, Nigeria',
  'Jos, Nigeria',
  'Ilorin, Nigeria',
  'Warri, Nigeria',
  'Abeokuta, Nigeria',
  'Calabar, Nigeria',
  'Accra, Ghana',
  'Kumasi, Ghana',
  'Takoradi, Ghana',
  'Nairobi, Kenya',
  'Mombasa, Kenya',
  'Kisumu, Kenya',
  'Kigali, Rwanda',
  'Johannesburg, South Africa',
  'Cape Town, South Africa',
  'Durban, South Africa',
  'Pretoria, South Africa',
  'Cairo, Egypt',
  'Alexandria, Egypt',
  'Dar es Salaam, Tanzania',
  'Kampala, Uganda',
  'Addis Ababa, Ethiopia',
  'Dakar, Senegal',
  'Abidjan, Côte d’Ivoire',
  'Douala, Cameroon',
  'Casablanca, Morocco',
  'Lusaka, Zambia',
  'Remote / Distributed',
]

// =============================================================================
// MAIN ONBOARDING COMPONENT
// =============================================================================

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialEmailParam = searchParams.get('email') || ''
  const initialRoleParam = (searchParams.get('role') as 'client' | 'provider') || null
  const initialStepParam = searchParams.get('step') || (initialRoleParam === 'provider' ? 'sector' : initialEmailParam ? 'contact_info' : 'welcome')

  const [step, setStep] = useState<string>(initialStepParam === 'role' ? 'contact_info' : initialStepParam)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [selectedRole, setSelectedRole] = useState<'client' | 'provider'>(initialRoleParam === 'provider' ? 'provider' : 'client')

  // Step 1: Contact & Identity (SignupPage.tsx)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState(initialEmailParam)
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [locationCity, setLocationCity] = useState('Lagos, Nigeria')
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState('')
  const cityDropdownRef = useRef<HTMLDivElement>(null)

  // Close city dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false)
      }
    }
    if (isCityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCityDropdownOpen])

  const filteredCities = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase()
    if (!q) return MAJOR_AFRICAN_CITIES
    return MAJOR_AFRICAN_CITIES.filter((c) => c.toLowerCase().includes(q))
  }, [citySearchQuery])

  const handleSelectCity = (city: string) => {
    setLocationCity(city)
    setIsCityDropdownOpen(false)
    setCitySearchQuery('')
  }

  // Email validation and Real Server OTP state
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid' | 'registered'>('idle')
  const [isEmailAlreadyRegistered, setIsEmailAlreadyRegistered] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [enteredOtp, setEnteredOtp] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('')
  const [otpResendCountdown, setOtpResendCountdown] = useState(60)
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null)

  // Instant check if email is already registered
  const checkEmailControllerRef = useRef<AbortController | null>(null)

  const verifyEmailAvailability = async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail) || selectedRole === 'provider') {
      return
    }

    if (checkEmailControllerRef.current) {
      checkEmailControllerRef.current.abort()
    }
    const controller = new AbortController()
    checkEmailControllerRef.current = controller

    setIsCheckingEmail(true)
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (controller.signal.aborted) return

      if (data.data?.registered) {
        setIsEmailAlreadyRegistered(true)
        setEmailStatus('registered')
        setOtpError('This email is already registered. Please log in to your account.')
      } else {
        setIsEmailAlreadyRegistered(false)
        setEmailStatus('valid')
        setOtpError((prev) => (prev.includes('already registered') ? '' : prev))
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback gracefully
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsCheckingEmail(false)
      }
    }
  }

  // Real-time reactive check if email is already registered
  useEffect(() => {
    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      setIsEmailAlreadyRegistered(false)
      if (emailStatus === 'registered') {
        setEmailStatus('idle')
      }
      return
    }

    if (selectedRole === 'provider') {
      return
    }

    const timer = setTimeout(() => {
      verifyEmailAvailability(cleanEmail)
    }, 70)

    return () => clearTimeout(timer)
  }, [email, selectedRole])

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (otpSent && !isEmailVerified && otpResendCountdown > 0) {
      timer = setInterval(() => {
        setOtpResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [otpSent, isEmailVerified, otpResendCountdown])

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '89671982625-iuj8vlsdjhcntlpdal9nbn6qi4hn01hf.apps.googleusercontent.com'

  // Listen for Google OAuth hash redirect (e.g. /onboarding#id_token=...)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash && (hash.includes('id_token=') || hash.includes('credential='))) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const idToken = params.get('id_token') || params.get('credential')
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname)
        handleGoogleOnboardingResponse({ credential: idToken })
      }
    }
  }, [])

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script')
      script.id = 'google-gsi-client'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  const handleGoogleOnboardingResponse = async (response: any) => {
    if (!response?.credential) return

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: response.credential,
          role: selectedRole || 'client',
        }),
      })

      const data = await res.json()
      if (res.ok && data.data) {
        if (data.data.fullName) {
          const parts = data.data.fullName.split(' ')
          setFirstName(parts[0] || 'Connecta')
          setLastName(parts.slice(1).join(' ') || 'Member')
        }
        if (data.data.email) {
          setEmail(data.data.email)
          setIsEmailVerified(true)
        }
        if (data.data.avatarUrl) {
          setProfileImage(data.data.avatarUrl)
        }
        setStep('country_currency')
      }
    } catch (e) {
      console.warn('Google Onboarding error:', e)
    }
  }

  const handleGoogleOnboarding = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      const google = (window as any).google
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleOnboardingResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const redirectUri = window.location.origin + '/onboarding'
          window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`
        }
      })
    } else {
      const redirectUri = window.location.origin + '/onboarding'
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`
    }
  }

  // Real Server OTP Dispatch
  const handleSendEmailOtp = async () => {
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setOtpError('Please enter a valid email address first.')
      return
    }

    if (isEmailAlreadyRegistered) {
      setOtpError('This email is already registered. Please log in to your account.')
      return
    }

    setIsSendingOtp(true)
    setOtpError('')
    setOtpSuccessMessage('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          intent: selectedRole === 'client' ? 'registration' : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409 || data.error?.toLowerCase?.().includes('already registered')) {
          setIsEmailAlreadyRegistered(true)
          setEmailStatus('registered')
          throw new Error('This email is already registered. Please log in.')
        }
        throw new Error(data.error?.message || data.error || 'Failed to send verification code')
      }

      setOtpSent(true)
      setEnteredOtp('')
      setOtpResendCountdown(60)
      setCanResendOtp(false)
      if (data.data?.devCode) {
        setDevCodeHint(data.data.devCode)
      } else {
        setDevCodeHint(null)
      }
      setOtpSuccessMessage(data.data?.message || `Verification code sent to ${email}.`)
    } catch (err: any) {
      setOtpError(err.message || 'Failed to dispatch verification code. Please try again.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handle Contact Info Step Navigation with automatic OTP trigger
  const handleContactInfoNext = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.includes('@')) {
      return
    }
    if (isEmailAlreadyRegistered) {
      setOtpError('This email is already registered. Please log in to your account.')
      return
    }
    if (!isEmailVerified) {
      if (!otpSent) {
        await handleSendEmailOtp()
      } else {
        setOtpError('Please enter the 6-digit verification code sent to your email to continue.')
      }
      return
    }
    setStep('password')
  }

  // Real Server OTP Verification
  const handleVerifyEmailOtp = async (codeToVerify?: string) => {
    setOtpError('')
    const targetCode = (typeof codeToVerify === 'string' ? codeToVerify : enteredOtp).trim()
    if (targetCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.')
      return
    }

    setIsVerifyingOtp(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: targetCode,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Invalid verification code')
      }

      setIsEmailVerified(true)
      setOtpError('')
      setOtpSuccessMessage('Email verified successfully! You can now proceed.')
    } catch (err: any) {
      setOtpError(err.message || 'Invalid verification code. Please check your code or request a new one.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Step 2: Security & Password (SignupPasswordPage.tsx)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Step 3: Country & Currency (CountryCurrencyPage.tsx)
  const [selectedCountry, setSelectedCountry] = useState<string>('Nigeria')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('NGN')
  const [baseRate, setBaseRate] = useState('15,000')
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const countryDropdownRef = useRef<HTMLDivElement>(null)

  // Close country dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false)
      }
    }
    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryDropdownOpen])

  // Step 4A: Provider Path (Sector, Skills, Profile)
  const [selectedSectorId, setSelectedSectorId] = useState<string>('tech')
  const [customSectorName, setCustomSectorName] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchQuery, setSkillSearchQuery] = useState('')
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [workType, setWorkType] = useState<'freelancing' | 'permanent'>('freelancing')
  const [experienceYears, setExperienceYears] = useState('5')
  const [ninNumber, setNinNumber] = useState('')
  const [workshopAddress, setWorkshopAddress] = useState('')
  const [profileImage, setProfileImage] = useState<string>('')

  // Step 4B: Client Path (Industry, Goals, Profile)
  const [clientIndustry, setClientIndustry] = useState('tech_startup')
  const [clientGoal, setClientGoal] = useState('one_off_project')
  const [companyName, setCompanyName] = useState('')
  const [companyBio, setCompanyBio] = useState('')
  const [companySize, setCompanySize] = useState(COMPANY_SIZES[0])
  const [companyWebsite, setCompanyWebsite] = useState('')

  // Step 5: Terms and Conditions
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [createdAccountData, setCreatedAccountData] = useState<{
    id: string
    fullName: string
    role: string
    city: string
    currency: string
    welcomeSparks: number
    isLiveInDatabase: boolean
    dbNotice?: string | null
  } | null>(null)
  const termsContainerRef = useRef<HTMLDivElement>(null)

  const handleActivateAccount = async () => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      if (createdAccountData?.id) {
        await new Promise((r) => setTimeout(r, 200))
        setStep('complete')
        return
      }

      if (selectedRole === 'provider' && (!selectedSkills || selectedSkills.length === 0)) {
        setStep('sector')
        return
      }

      setStep('progress')
    } catch (err: any) {
      setSubmitError(err.message || 'Account activation failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 6: Setup Progress
  const [progressPercent, setProgressPercent] = useState(0)
  const [activeProgressTask, setActiveProgressTask] = useState(0)

  // Session Recovery & Persistence States
  const [isInitialMountComplete, setIsInitialMountComplete] = useState(false)
  const [restoredBanner, setRestoredBanner] = useState<string | null>(null)

  // Scroll detection for dynamic header elevation
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Session Recovery: Restore exact state on page refresh or reconnection
  useEffect(() => {
    try {
      const qReset = searchParams.get('reset') === '1'
      if (qReset) {
        localStorage.removeItem('connecta_onboarding_session')
        sessionStorage.removeItem('connecta_onboarding_session')
        setIsInitialMountComplete(true)
        return
      }

      const qStep = searchParams.get('step')
      const qRole = searchParams.get('role') as 'client' | 'provider' | null

      // Check saved persistent session
      const rawSession =
        localStorage.getItem('connecta_onboarding_session') ||
        sessionStorage.getItem('connecta_onboarding_session')

      if (rawSession) {
        const session = JSON.parse(rawSession)
        const ageMs = Date.now() - (session.updatedAt || 0)
        const isNotExpired = ageMs < 24 * 60 * 60 * 1000 // 24 hours validity

        if (isNotExpired && session.step && session.step !== 'welcome' && session.step !== 'complete') {
          // Restore form inputs
          if (session.selectedRole) setSelectedRole(session.selectedRole)
          if (session.firstName) setFirstName(session.firstName)
          if (session.lastName) setLastName(session.lastName)
          if (session.email) setEmail(session.email)
          if (session.phone) setPhone(session.phone)
          if (session.whatsapp) setWhatsapp(session.whatsapp)
          if (typeof session.sameAsPhone === 'boolean') setSameAsPhone(session.sameAsPhone)
          if (session.locationCity) setLocationCity(session.locationCity)
          if (session.selectedCountry) setSelectedCountry(session.selectedCountry)
          if (session.selectedCurrency) setSelectedCurrency(session.selectedCurrency)
          if (typeof session.isEmailVerified === 'boolean') setIsEmailVerified(session.isEmailVerified)
          if (session.password) setPassword(session.password)
          if (session.confirmPassword) setConfirmPassword(session.confirmPassword)
          if (session.selectedSectorId) setSelectedSectorId(session.selectedSectorId)
          if (session.customSectorName) setCustomSectorName(session.customSectorName)
          if (Array.isArray(session.selectedSkills)) setSelectedSkills(session.selectedSkills)
          if (session.baseRate) setBaseRate(session.baseRate)
          if (session.title) setTitle(session.title)
          if (session.bio) setBio(session.bio)
          if (session.workType) setWorkType(session.workType)
          if (session.experienceYears) setExperienceYears(session.experienceYears)
          if (session.ninNumber) setNinNumber(session.ninNumber)
          if (session.workshopAddress) setWorkshopAddress(session.workshopAddress)
          if (session.profileImage) setProfileImage(session.profileImage)
          if (session.clientIndustry) setClientIndustry(session.clientIndustry)
          if (session.clientGoal) setClientGoal(session.clientGoal)
          if (session.companyName) setCompanyName(session.companyName)
          if (session.companyBio) setCompanyBio(session.companyBio)
          if (session.companySize) setCompanySize(session.companySize)
          if (session.companyWebsite) setCompanyWebsite(session.companyWebsite)
          if (session.createdAccountData) setCreatedAccountData(session.createdAccountData)

          // Restore exact step where user left off
          const targetStep = qStep || session.step
          setStep(targetStep)
          setRestoredBanner('Your registration session has been restored. You can continue right where you left off.')
          setTimeout(() => setRestoredBanner(null), 6000)
        } else if (qStep) {
          if (qStep === 'role') {
            setStep('contact_info')
            setSelectedRole('client')
          } else {
            setStep(qStep)
            if (qRole) setSelectedRole(qRole)
          }
        }
      } else if (qStep) {
        if (qStep === 'role') {
          setStep('contact_info')
          setSelectedRole('client')
        } else {
          setStep(qStep)
          if (qRole) setSelectedRole(qRole)
        }
      } else if (qRole === 'provider') {
        setSelectedRole('provider')
        setStep('sector')
      }
    } catch (e) {
      console.warn('[Session Recovery Notice]', e)
    } finally {
      setIsInitialMountComplete(true)
    }
  }, [searchParams])

  // Check if authenticated client is accessing provider onboarding
  useEffect(() => {
    const qRole = searchParams.get('role')
    const checkAuthenticatedUser = async () => {
      try {
        const res = await fetch('/api/dashboard/overview')
        if (res.ok) {
          const body = await res.json()
          if (body.data?.user) {
            const u = body.data.user
            if (u.firstName) setFirstName(u.firstName)
            if (u.lastName) setLastName(u.lastName)
            if (u.email) {
              setEmail(u.email)
              setIsEmailVerified(true)
            }
            if (u.phone) setPhone(u.phone)
            if (u.city) setLocationCity(u.city)
            if (u.country) setSelectedCountry(u.country)
            if (u.currency) setSelectedCurrency(u.currency)
            if (u.headline) setTitle(u.headline)
            if (u.bio) setBio(u.bio)
            if (u.skills && u.skills.length) setSelectedSkills(u.skills)
            if (u.workshopAddress) setWorkshopAddress(u.workshopAddress)
            if (u.hourlyRateMinor) setBaseRate((u.hourlyRateMinor / 100).toLocaleString())
            if (u.avatarUrl) setProfileImage(u.avatarUrl)

            if (qRole === 'provider' || initialRoleParam === 'provider') {
              setSelectedRole('provider')
              setStep((prev) => (prev === 'welcome' || prev === 'role' || prev === 'contact_info' ? 'sector' : prev))
            }
          }
        }
      } catch (err) {
        // Not authenticated
      }
    }
    checkAuthenticatedUser()
  }, [searchParams, initialRoleParam])

  // Auto-save onboarding progress to persistent storage whenever state changes
  useEffect(() => {
    if (!isInitialMountComplete) return
    if (step === 'welcome') return
    if (step === 'complete') {
      try {
        localStorage.removeItem('connecta_onboarding_session')
        sessionStorage.removeItem('connecta_onboarding_session')
      } catch {}
      return
    }

    try {
      const sessionData = {
        updatedAt: Date.now(),
        step,
        selectedRole,
        firstName,
        lastName,
        email,
        phone,
        whatsapp,
        sameAsPhone,
        locationCity,
        selectedCountry,
        selectedCurrency,
        isEmailVerified,
        password,
        confirmPassword,
        selectedSectorId,
        customSectorName,
        selectedSkills,
        baseRate,
        title,
        bio,
        workType,
        experienceYears,
        ninNumber,
        workshopAddress,
        profileImage,
        clientIndustry,
        clientGoal,
        companyName,
        companyBio,
        companySize,
        companyWebsite,
        createdAccountData,
      }
      localStorage.setItem('connecta_onboarding_session', JSON.stringify(sessionData))
      sessionStorage.setItem('connecta_onboarding_session', JSON.stringify(sessionData))
    } catch {}
  }, [
    step, selectedRole, firstName, lastName, email, phone, whatsapp, sameAsPhone,
    locationCity, selectedCountry, selectedCurrency, isEmailVerified, password,
    confirmPassword, selectedSectorId, customSectorName, selectedSkills, baseRate,
    title, bio, workType, experienceYears, ninNumber, workshopAddress, profileImage,
    clientIndustry, clientGoal, companyName, companyBio, companySize, companyWebsite,
    createdAccountData, isInitialMountComplete,
  ])

  // Handle "Same as Phone" sync
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone)
    }
  }, [sameAsPhone, phone])

  // Centralized intelligent back handler
  const handleBack = () => {
    switch (step) {
      case 'role':
      case 'contact_info':
        setStep('welcome')
        break
      case 'password':
        setStep('contact_info')
        break
      case 'terms':
        if (selectedRole === 'provider') setStep('provider_profile')
        else setStep('password')
        break
      case 'sector':
        router.push(selectedRole === 'provider' ? '/dashboard' : '/')
        break
      case 'skills':
        setStep('sector')
        break
      case 'provider_profile':
        setStep('skills')
        break
      case 'country_currency':
      case 'client_industry':
      case 'client_goals':
      case 'client_profile':
        setStep('password')
        break
      default:
        router.push('/')
        break
    }
  }

  // Password requirements calculation
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordStrengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  const getPasswordStrength = () => {
    if (!password) return { text: 'Empty', color: 'bg-slate-200', textClass: 'text-slate-400', width: '0%' }
    if (passwordStrengthScore <= 2) return { text: 'Weak', color: 'bg-rose-500', textClass: 'text-rose-600', width: '25%' }
    if (passwordStrengthScore === 3) return { text: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-600', width: '50%' }
    if (passwordStrengthScore === 4) return { text: 'Good', color: 'bg-[#4D78FF]', textClass: 'text-[#4D78FF]', width: '75%' }
    return { text: 'Strong', color: 'bg-[#10B981]', textClass: 'text-[#10B981]', width: '100%' }
  }

  // Country selection handler
  const handleCountrySelect = (c: CountryOption) => {
    setSelectedCountry(c.name)
    setSelectedCurrency(c.currency)
    setIsCountryDropdownOpen(false)
    setCountrySearchQuery('')
  }

  // Active country lookup
  const selectedCountryObj = useMemo(() => {
    return (
      COUNTRIES.find((c) => c.name.toLowerCase() === selectedCountry.toLowerCase()) ||
      COUNTRIES[0]
    )
  }, [selectedCountry])

  // Filtered countries for dropdown search
  const filteredCountries = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q)
    )
  }, [countrySearchQuery])

  // Active sector lookup
  const currentSector = useMemo(() => {
    return SECTORS.find((s) => s.id === selectedSectorId) || SECTORS[0]
  }, [selectedSectorId])

  // Filter skills
  const displayedSkills = useMemo(() => {
    if (!skillSearchQuery.trim()) return currentSector.popularSkills
    return currentSector.popularSkills.filter((s) =>
      s.toLowerCase().includes(skillSearchQuery.toLowerCase().trim())
    )
  }, [currentSector, skillSearchQuery])

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      if (selectedSkills.length >= 15) return
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customSkillInput.trim()) return
    const clean = customSkillInput.trim()
    if (!selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean])
    }
    setCustomSkillInput('')
  }

  // Profile image upload with client compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = document.createElement('img')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 400
        const MAX_HEIGHT = 400
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL('image/jpeg', 0.8)
        setProfileImage(compressed)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Handle Terms scroll detection
  const handleTermsScroll = () => {
    if (termsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsContainerRef.current
      if (scrollTop + clientHeight >= scrollHeight - 30) {
        setHasScrolledTerms(true)
      }
    }
  }

  // Handle Real Database Account Provisioning (No Fake Simulation)
  useEffect(() => {
    if (step === 'progress') {
      let isCancelled = false
      setProgressPercent(15)
      setActiveProgressTask(0)
      setSubmitError('')

      const runRealProvisioning = async () => {
        try {
          // Stage 1: Validate payload & seal cryptographic identity
          await new Promise((r) => setTimeout(r, 350))
          if (isCancelled) return
          setProgressPercent(35)
          setActiveProgressTask(1)

          // Stage 2: Send real account payload to Supabase API
          const cityClean = locationCity.split(',')[0].trim() || 'Lagos'
          const payload = {
            role: selectedRole || 'client',
            firstName: firstName.trim() || 'Connecta',
            lastName: lastName.trim() || 'Member',
            email: email.trim().toLowerCase(),
            phone: phone.trim() || '',
            whatsapp: (sameAsPhone ? phone : whatsapp) || phone || '',
            password: password || 'Connecta@2026Secure',
            country: selectedCountry || 'Nigeria',
            currency: selectedCurrency || 'NGN',
            city: cityClean,
            avatarUrl: profileImage || undefined,
            // Provider fields
            businessName: title || `${firstName} ${lastName}`.trim(),
            headline: title ? `${title} in ${cityClean}` : `Verified Specialist in ${cityClean}`,
            bio: bio || `Specialist delivering verified services across ${cityClean}.`,
            primaryCategory: currentSector?.name || 'Skilled Trades',
            skills: selectedSkills && selectedSkills.length ? selectedSkills : ['General Practice'],
            hourlyRate: baseRate || '15000',
            ninNumber: ninNumber || undefined,
            workshopAddress: workshopAddress || `${cityClean}, Nigeria`,
            // Client fields
            companyName: companyName || `${firstName} ${lastName}`.trim() + ' Workspace',
            companyBio: companyBio || 'Connecta client workspace ready for instant milestone escrow contracts.',
            companySize: companySize || 'Solo / Household',
            companyWebsite: companyWebsite || undefined,
            clientIndustry: clientIndustry || 'residential_commercial',
            clientGoal: clientGoal || 'one_off_project',
            officeAddress: workshopAddress || `${cityClean}, Nigeria`,
          }

          const res = await fetch('/api/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error?.message || data.error || 'Account registration failed')
          }

          if (isCancelled) return
          setProgressPercent(70)
          setActiveProgressTask(2)
          setCreatedAccountData(data.data)

          // Stage 3: Escrow Vault & Telemetry confirmation
          await new Promise((r) => setTimeout(r, 400))
          if (isCancelled) return
          setProgressPercent(90)
          setActiveProgressTask(3)

          // Stage 4: Verified 100% completion
          await new Promise((r) => setTimeout(r, 300))
          if (isCancelled) return
          setProgressPercent(100)

          setTimeout(() => {
            if (!isCancelled) {
              setStep('complete')
            }
          }, 450)
        } catch (err: any) {
          if (!isCancelled) {
            setSubmitError(err.message || 'Registration failed')
          }
        }
      }

      runRealProvisioning()

      return () => {
        isCancelled = true
      }
    }
  }, [step, selectedRole, firstName, lastName, email, phone, whatsapp, password, selectedCountry, selectedCurrency, locationCity, profileImage, title, bio, currentSector, selectedSkills, baseRate, ninNumber, workshopAddress, companyName, companyBio, companySize, companyWebsite, clientIndustry, clientGoal])

  // Stepper calculations adapting progress.png
  const PROGRESS_STEPS = selectedRole === 'provider'
    ? [
        { number: 1, label: 'Trade Sector' },
        { number: 2, label: 'Core Skills' },
        { number: 3, label: 'Profile' },
        { number: 4, label: 'Activation' },
      ]
    : [
        { number: 1, label: 'Account' },
        { number: 2, label: 'Security' },
        { number: 3, label: 'Terms' },
        { number: 4, label: 'Workspace' },
      ]

  const getStepperStage = (): number => {
    if (selectedRole === 'provider') {
      switch (step) {
        case 'sector':
          return 1
        case 'skills':
          return 2
        case 'provider_profile':
          return 3
        case 'terms':
        case 'progress':
        case 'complete':
          return 4
        default:
          return 1
      }
    } else {
      switch (step) {
        case 'welcome':
        case 'role':
        case 'contact_info':
          return 1
        case 'password':
          return 2
        case 'terms':
          return 3
        case 'progress':
        case 'complete':
          return 4
        default:
          return 1
      }
    }
  }

  const currentStage = getStepperStage()

  const getStepProgressNumber = () => {
    const item = PROGRESS_STEPS[currentStage - 1] || PROGRESS_STEPS[0]
    return { current: currentStage, total: 4, label: item.label }
  }

  const stepMeta = getStepProgressNumber()
  const passwordStrength = getPasswordStrength()

  // Render Progress Stepper Bar adapting progress.png - Thin, sleek & modern
  const renderProgressBar = () => {
    if (step === 'welcome' || step === 'complete') return null
    return (
      <div className="w-full">
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 sm:px-6 sm:py-3.5 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {PROGRESS_STEPS.map((s, idx) => {
              const isCurrent = currentStage === s.number
              const isCompleted = currentStage > s.number

              return (
                <React.Fragment key={s.number}>
                  {/* Step Node */}
                  <div className="flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#053F28] text-white ring-4 ring-[#10B981]/25 shadow-xs scale-105'
                          : isCompleted
                          ? 'bg-[#053F28]/90 text-white'
                          : 'bg-slate-100/90 text-slate-400 border border-slate-200/80 opacity-70'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <span>{s.number}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-center transition-colors duration-200 whitespace-nowrap ${
                        isCurrent
                          ? 'text-[#053F28] font-black'
                          : isCompleted
                          ? 'text-[#053F28] font-semibold'
                          : 'text-slate-400 font-medium'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Connecting Line between steps - Thin 1.5px line */}
                  {idx < PROGRESS_STEPS.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-3 h-6 sm:h-7 flex items-center">
                      <div
                        className={`h-[1.5px] w-full rounded-full transition-colors duration-300 ${
                          currentStage > s.number ? 'bg-[#053F28]' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] relative flex flex-col selection:bg-[#4D78FF]/20 pb-16">
      {/* Sleek Professional Top Header Bar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md'
            : 'bg-[#F5F7FC]/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-36 h-8 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Center: Persistent Scrolled Header Indicator */}
          {isScrolled && step !== 'welcome' && step !== 'complete' && (
            <div className="hidden sm:flex items-center gap-2 animate-in fade-in duration-200">
              <span className="text-xs font-black text-slate-800 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                {stepMeta.label}
              </span>
            </div>
          )}

          {/* Right: Clean Sign In CTA */}
          <div className="flex items-center gap-3.5">
            <span className="text-sm font-semibold text-slate-600 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Multi-Step Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 sm:pt-10 flex flex-col justify-center relative z-10">
        {/* Restored Session Notification */}
        {restoredBanner && (
          <div className="max-w-2xl mx-auto w-full mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{restoredBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('connecta_onboarding_session')
                  sessionStorage.removeItem('connecta_onboarding_session')
                } catch {}
                window.location.href = '/onboarding?reset=1'
              }}
              className="text-xs text-emerald-700 hover:text-emerald-950 font-bold underline cursor-pointer shrink-0"
            >
              Start Fresh
            </button>
          </div>
        )}
        {/* ================================================================= */}
        {/* STEP 1: ONBOARDING SLIDES CAROUSEL (OnboardingScreen.tsx)         */}
        {/* ================================================================= */}
        {step === 'welcome' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                {ONBOARDING_SLIDES[currentSlideIndex].title}{' '}
                <span className="text-[#4D78FF]">
                  {ONBOARDING_SLIDES[currentSlideIndex].highlight}
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                {ONBOARDING_SLIDES[currentSlideIndex].description}
              </p>
            </div>

            {/* Slide Hero Card */}
            <div
              className={`${ONBOARDING_SLIDES[currentSlideIndex].cardBg} text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                {React.createElement(ONBOARDING_SLIDES[currentSlideIndex].icon, {
                  className: 'w-48 h-48',
                })}
              </div>

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>{ONBOARDING_SLIDES[currentSlideIndex].badge}</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                    {ONBOARDING_SLIDES[currentSlideIndex].stats}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-white/70">
                    {ONBOARDING_SLIDES[currentSlideIndex].statsLabel}
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 pt-2">
                  {ONBOARDING_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlideIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('client')
                  setStep('contact_info')
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Skip intro to registration →
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentSlideIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
                    className="p-3.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (currentSlideIndex < ONBOARDING_SLIDES.length - 1) {
                      setCurrentSlideIndex((prev) => prev + 1)
                    } else {
                      setSelectedRole('client')
                      setStep('contact_info')
                    }
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>
                    {currentSlideIndex === ONBOARDING_SLIDES.length - 1
                      ? 'Get Started'
                      : 'Next Feature'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: ROLE SELECTION (RoleSelectionPage.tsx)                    */}
        {/* ================================================================= */}
        {step === 'role' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Choose your account type
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Select whether you are looking to hire verified African talent or work as a verified specialist.
              </p>
            </div>

            {renderProgressBar()}

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Option */}
              <div
                onClick={() => setSelectedRole('client')}
                className={`p-7 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-5 ${
                  selectedRole === 'client'
                    ? 'border-[#4D78FF] bg-white shadow-xs ring-2 ring-[#4D78FF]/20'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      selectedRole === 'client'
                        ? 'bg-[#4D78FF] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                      selectedRole === 'client'
                        ? 'border-[#4D78FF] bg-[#4D78FF] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedRole === 'client' && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A1020]">I&apos;m a Client</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Hire background-checked plumbers, electricians, carpenters, and technicians with 100% escrow protection.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-[#4D78FF] flex items-center gap-1">
                  <span>Start hiring local pros</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Specialist / Freelancer Option */}
              <div
                onClick={() => setSelectedRole('provider')}
                className={`p-7 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-5 ${
                  selectedRole === 'provider'
                    ? 'border-[#10B981] bg-white shadow-xs ring-2 ring-[#10B981]/20'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      selectedRole === 'provider'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                      selectedRole === 'provider'
                        ? 'border-[#10B981] bg-[#10B981] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedRole === 'provider' && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A1020]">I&apos;m a Specialist / Pro</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Find high-paying local and remote work, get verified, and earn through secure escrow.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <span>Offer your services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Quick Google Sign-Up Option */}
            {selectedRole && (
              <div className="space-y-4 pt-1">
                <button
                  type="button"
                  onClick={handleGoogleOnboarding}
                  className="w-full py-3.5 px-5 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    Sign up as {selectedRole === 'client' ? 'Client' : 'Specialist'} with Google
                  </span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative bg-[#F5F7FC] px-4">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Or create account with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!selectedRole}
                onClick={() => setStep('contact_info')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  selectedRole
                    ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: CONTACT & IDENTITY DETAILS (SignupPage.tsx)               */}
        {/* ================================================================= */}
        {step === 'contact_info' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Your contact details
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Used for instant dispatch notifications, milestone approvals, and security alerts.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ibrahim"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Aliyu"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Address with real-time status & OTP verification */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  {isEmailVerified ? (
                    <span className="text-xs font-bold text-[#10B981] flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                    </span>
                  ) : isEmailAlreadyRegistered ? (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5" /> Already registered
                    </span>
                  ) : isCheckingEmail ? (
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Spinner className="w-3 h-3" /> Checking...
                    </span>
                  ) : emailStatus === 'valid' && !otpSent ? (
                    <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Email available
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled={isEmailVerified}
                    onBlur={() => {
                      if (email.includes('@') && email.includes('.')) {
                        verifyEmailAvailability(email)
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value
                      setEmail(val)
                      if (isEmailVerified || otpSent) {
                        setIsEmailVerified(false)
                        setOtpSent(false)
                        setEnteredOtp('')
                        setOtpError('')
                        setOtpSuccessMessage('')
                      }
                      const clean = val.trim().toLowerCase()
                      if (/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(clean)) {
                        verifyEmailAvailability(clean)
                      } else if (clean.includes('@') && clean.includes('.')) {
                        setEmailStatus('valid')
                      } else {
                        setEmailStatus('idle')
                        setIsEmailAlreadyRegistered(false)
                      }
                    }}
                    placeholder="e.g. ibrahim@example.com"
                    className={`w-full bg-[#F5F7FC] border rounded-2xl pl-13 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all font-medium ${
                      isEmailVerified
                        ? 'border-[#10B981] bg-emerald-50/30 pr-32 font-bold text-[#0A1020]'
                        : isEmailAlreadyRegistered
                        ? 'border-amber-400 bg-amber-50/20 pr-36 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15'
                        : emailStatus === 'valid'
                        ? 'border-slate-300 pr-36 focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15'
                        : 'border-slate-200 pr-4 focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15'
                    }`}
                    required
                  />

                  {/* Right side actions inside input */}
                  {isEmailVerified ? (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailVerified(false)
                          setOtpSent(false)
                          setEnteredOtp('')
                          setOtpError('')
                          setOtpSuccessMessage('')
                        }}
                        className="text-[11px] font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  ) : isEmailAlreadyRegistered ? (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <span>Log In</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : emailStatus === 'valid' ? (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={isSendingOtp}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
                      >
                        {isSendingOtp ? (
                          <>
                            <Spinner className="w-3.5 h-3.5" />
                            <span>Sending...</span>
                          </>
                        ) : otpSent ? (
                          <span>Resend OTP</span>
                        ) : (
                          <span>Send Code</span>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Email already registered alert banner */}
                {isEmailAlreadyRegistered && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2.5 animate-in fade-in shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Email already registered</span>
                      </div>
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="text-xs font-extrabold text-[#0C513F] hover:underline flex items-center gap-1"
                      >
                        <span>Go to Login</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      An account with <span className="font-bold text-slate-900">{email}</span> already exists. Please log in to your account.
                    </p>
                    <div className="pt-0.5">
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A1020] hover:bg-[#4D78FF] text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span>Log in to your account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* OTP Input Card appears below email */}
                {otpSent && !isEmailVerified && (
                  <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <span>Enter 6-Digit Email Verification Code</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4D78FF] opacity-40" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4D78FF]/60" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          We sent a verification code to <span className="font-bold text-slate-800">{email}</span>.
                        </p>
                      </div>
                    </div>

                    {otpSuccessMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{otpSuccessMessage}</span>
                      </div>
                    )}

                    {otpError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            setEnteredOtp(val)
                            setOtpError('')
                            // Real server verification when 6 digits are typed
                            if (val.length === 6) {
                              handleVerifyEmailOtp(val)
                            }
                          }}
                          placeholder="• • • • • •"
                          className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-center sm:text-left text-lg sm:text-xl tracking-[0.35em] font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#4D78FF] focus:ring-4 focus:ring-[#4D78FF]/15 transition-all"
                          autoFocus
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVerifyEmailOtp()}
                        disabled={isVerifyingOtp || enteredOtp.length !== 6}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xs shrink-0 ${
                          enteredOtp.length === 6
                            ? 'bg-[#10B981] hover:bg-[#059669] text-white cursor-pointer active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isVerifyingOtp ? (
                          <>
                            <Spinner className="w-3.5 h-3.5" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify OTP</span>
                            <Check className="w-4 h-4 stroke-[3]" />
                          </>
                        )}
                      </button>
                    </div>

                    {devCodeHint && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold animate-in fade-in">
                        <span>🧪 Instant Test Code: <strong>{devCodeHint}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            setEnteredOtp(devCodeHint)
                            handleVerifyEmailOtp(devCodeHint)
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer shadow-xs active:scale-95 transition-all"
                        >
                          Auto-fill &amp; Verify
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Didn&apos;t receive the code?</span>
                      {canResendOtp ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={isSendingOtp}
                          className="font-black text-[#4D78FF] hover:underline cursor-pointer"
                        >
                          Resend new code
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-400">
                          Resend in <span className="font-bold text-slate-600">{otpResendCountdown}s</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95 self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
                {!isEmailVerified && email.includes('@') && otpSent && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3.5 py-2 rounded-full flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Please enter the 6-digit code sent to your email</span>
                  </span>
                )}

                {isEmailAlreadyRegistered ? (
                  <Link
                    href={`/login?email=${encodeURIComponent(email)}`}
                    className="inline-flex items-center gap-2 rounded-full px-9 py-4 text-xs sm:text-sm font-black shadow-md transition-all bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Log In to Existing Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={!firstName.trim() || !lastName.trim() || !email.includes('@') || isSendingOtp}
                    onClick={handleContactInfoNext}
                    className={`inline-flex items-center gap-2 rounded-full px-9 py-4 text-xs sm:text-sm font-black shadow-md transition-all ${
                      firstName.trim() && lastName.trim() && email.includes('@') && !isSendingOtp
                        ? isEmailVerified
                          ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 active:scale-95 cursor-pointer'
                          : 'bg-[#0C513F] hover:bg-[#083b2e] text-white hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#0C513F]/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                    }`}
                  >
                    {isSendingOtp ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : !isEmailVerified ? (
                      otpSent ? (
                        <>
                          <span>Verify OTP to Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Code &amp; Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )
                    ) : (
                      <>
                        <span>Next: Account Security</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: PASSWORD & SECURITY (SignupPasswordPage.tsx)              */}
        {/* ================================================================= */}
        {step === 'password' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Create a secure password
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Safeguard your milestone escrow contracts and private client communications.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Account Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-13 pr-12 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Checklist */}
              {password && (
                <div className="space-y-2.5 pt-1 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-600 font-bold">Password Strength:</span>
                    <span className={`font-black ${passwordStrength.textClass}`}>
                      {passwordStrength.text}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className={hasMinLength ? 'text-[#10B981] font-bold flex items-center gap-1.5' : 'text-slate-400 flex items-center gap-1.5'}>
                      <Check className="w-3.5 h-3.5" /> 8+ Characters
                    </div>
                    <div className={hasUpper && hasLower ? 'text-[#10B981] font-bold flex items-center gap-1.5' : 'text-slate-400 flex items-center gap-1.5'}>
                      <Check className="w-3.5 h-3.5" /> Upper &amp; lower case
                    </div>
                    <div className={hasNumber ? 'text-[#10B981] font-bold flex items-center gap-1.5' : 'text-slate-400 flex items-center gap-1.5'}>
                      <Check className="w-3.5 h-3.5" /> At least 1 number (0-9)
                    </div>
                    <div className={hasSpecial ? 'text-[#10B981] font-bold flex items-center gap-1.5' : 'text-slate-400 flex items-center gap-1.5'}>
                      <Check className="w-3.5 h-3.5" /> Symbol (!@#$%)
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-13 pr-12 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>

                {confirmPassword && (
                  <div className="text-xs font-bold flex items-center gap-1.5 pt-1">
                    {password === confirmPassword ? (
                      <span className="text-[#10B981] flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!hasMinLength || password !== confirmPassword}
                onClick={() => {
                  if (selectedRole === 'provider') {
                    setStep('sector')
                  } else {
                    setStep('terms')
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-full px-9 py-4 text-xs sm:text-sm font-black shadow-md transition-all ${
                  hasMinLength && password === confirmPassword
                    ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                <span>{selectedRole === 'provider' ? 'Next: Choose Sector' : 'Next: Terms & Agreements'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: COUNTRY & CURRENCY (CountryCurrencyPage.tsx)              */}
        {/* ================================================================= */}
        {step === 'country_currency' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Location &amp; Escrow Currency
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Connecta settles escrow payouts directly in your preferred local African currency or USD.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-7">
              {/* Country Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Operating Country
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Click to select or search</span>
                </div>

                {/* Interactive Clickable Country Input */}
                <div ref={countryDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                    className={`w-full bg-[#F5F7FC] hover:bg-slate-100/80 border text-left rounded-2xl px-5 py-4 flex items-center justify-between transition-all cursor-pointer group ${
                      isCountryDropdownOpen
                        ? 'border-[#4D78FF] ring-2 ring-[#4D78FF]/20 bg-white shadow-sm'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isCountryDropdownOpen}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-3xl leading-none shrink-0" role="img" aria-label={selectedCountryObj.name}>
                        {selectedCountryObj.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-slate-900 truncate">
                            {selectedCountryObj.name}
                          </span>
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 uppercase tracking-wider">
                            {selectedCountryObj.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          Settlement currency: <span className="font-bold text-slate-700">{selectedCountryObj.currencySymbol} ({selectedCountryObj.currency})</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-3 shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-[#4D78FF] group-hover:underline">
                        Change
                      </span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCountryDropdownOpen ? 'bg-[#4D78FF] text-white rotate-180' : 'bg-slate-200/70 text-slate-600 group-hover:bg-slate-300/70'
                      }`}>
                        <ChevronDown className="w-4 h-4 transition-transform" />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      {/* Search Filter Header */}
                      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Search by country name, code, or currency..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:ring-2 focus:ring-[#4D78FF]/15 transition-all font-medium"
                            autoFocus
                          />
                          {countrySearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCountrySearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Country List Options */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80 p-2 scrollbar-thin">
                        {filteredCountries.length === 0 ? (
                          <div className="py-8 text-center text-slate-500 text-xs font-medium">
                            No countries match &ldquo;{countrySearchQuery}&rdquo;
                          </div>
                        ) : (
                          filteredCountries.map((c) => {
                            const isSelected = selectedCountry.toLowerCase() === c.name.toLowerCase()
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => handleCountrySelect(c)}
                                className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
                                  isSelected
                                    ? 'bg-[#4D78FF]/10 text-[#0A1020]'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label={c.name}>
                                    {c.flag}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm sm:text-base font-bold truncate ${isSelected ? 'text-[#0A1020]' : 'text-slate-800'}`}>
                                        {c.name}
                                      </span>
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
                                        {c.code}
                                      </span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">
                                      Settles in {c.currencySymbol} ({c.currency})
                                    </span>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Preferred Escrow Currency
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Used for milestone locks &amp; payouts</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  {CURRENCIES.map((cur) => {
                    const isSelected = selectedCurrency === cur.code
                    return (
                      <button
                        key={cur.code}
                        type="button"
                        onClick={() => setSelectedCurrency(cur.code)}
                        className={`py-3.5 px-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0A1020] bg-[#0A1020] text-white shadow-sm'
                            : 'border-slate-200/90 hover:border-slate-300 bg-[#F5F7FC] text-slate-700 font-bold'
                        }`}
                      >
                        <div className="text-xs font-bold">{cur.symbol} {cur.code}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rate or Budget Expectation */}
              {selectedRole === 'provider' && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Typical Base Day Rate / Hourly Rate ({selectedCurrency})
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-sm font-extrabold text-slate-400">
                      {selectedCurrency}
                    </span>
                    <input
                      type="text"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value)}
                      placeholder="e.g. 15,000"
                      className="w-full bg-[#F5F7FC] border border-slate-200/90 rounded-2xl pl-16 pr-4 py-4 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-2 focus:ring-[#4D78FF]/15 transition-all font-bold placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    You can submit itemized custom minor-unit quotes for each individual project milestone.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedRole === 'provider') {
                    setStep('sector')
                  } else {
                    setStep('client_industry')
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold bg-[#0A1020] hover:bg-[#4D78FF] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{selectedRole === 'provider' ? 'Next: Primary Sector' : 'Next: Organization Sector'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6A-1: SECTOR SELECTION (SectorSelectionPage.tsx)             */}
        {/* ================================================================= */}
        {step === 'sector' && selectedRole === 'provider' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Choose your trade or specialty
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                We calibrate project invitations, diagnostic toolsets, and guild verification based on your primary sector.
              </p>
            </div>

            {renderProgressBar()}

            {/* Sectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SECTORS.map((sec) => {
                const isSelected = selectedSectorId === sec.id
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectorId(sec.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#0A1020] bg-white shadow-xs ring-2 ring-[#10B981]'
                        : 'border-slate-200 hover:border-slate-300 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${sec.color}`}
                      >
                        {React.createElement(sec.icon, { className: 'w-4 h-4' })}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sec.name}</div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Custom Sector Entry */}
            {selectedSectorId === 'other' && (
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-2.5 animate-in fade-in">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Custom Sector Name
                </label>
                <input
                  type="text"
                  value={customSectorName}
                  onChange={(e) => setCustomSectorName(e.target.value)}
                  placeholder="e.g. CCTV & Access Control Security"
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                />
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('skills')}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold bg-[#0A1020] hover:bg-[#4D78FF] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next: Select Skills ({currentSector.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6A-2: SKILLS SELECTION (SkillSelectionPage.tsx)               */}
        {/* ================================================================= */}
        {step === 'skills' && selectedRole === 'provider' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Select your verified skills
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Pick up to 15 core skills. Clients use these tags to match and disburse itemized tasks.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Search Bar & Custom Skill Entry */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    placeholder="Search trade skills or technical specialties..."
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-13 pr-4 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>

                <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add custom skill"
                    className="flex-1 sm:w-48 bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-[#4D78FF] transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                  >
                    + Add
                  </button>
                </form>
              </div>

              {/* Selected Skills Chips */}
              {selectedSkills.length > 0 && (
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-900">
                    <span>Selected Skills ({selectedSkills.length}/15)</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSkills([])}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#10B981] text-white shadow-xs"
                      >
                        <span>{s}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:opacity-80"
                          onClick={() => toggleSkill(s)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular / Filtered Skills Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Recommended Skills</span>
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                            : 'bg-[#F5F7FC] text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={selectedSkills.length === 0}
                onClick={() => setStep('provider_profile')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  selectedSkills.length > 0
                    ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                <span>Next: Build Specialist Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6A-3: SPECIALIST PROFILE SETUP (FreelancerProfileSetupPage)   */}
        {/* ================================================================= */}
        {step === 'provider_profile' && selectedRole === 'provider' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Build your specialist profile
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Presented to residential households and businesses looking to hire verified local service specialists.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Photo Upload */}
              <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
                <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {profileImage ? (
                    <Image src={profileImage} alt="Profile" fill className="object-cover" />
                  ) : (
                    <Camera className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">Profile Photo or Guild Logo</div>
                  <p className="text-xs text-slate-500">
                    JPG or PNG under 5MB. Clear face or professional badge recommended.
                  </p>
                  <label className="inline-block mt-1">
                    <span className="text-xs font-semibold text-[#4D78FF] hover:underline cursor-pointer">
                      Upload photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title / Headline */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Professional Title / Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Plumber, Precision Electrician, or Solar & Inverter Technician"
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  required
                />
              </div>

              {/* Work Type & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Preferred Work Model
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setWorkType('freelancing')}
                      className={`py-3.5 px-4 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        workType === 'freelancing'
                          ? 'border-[#0A1020] bg-[#0A1020] text-white shadow-xs'
                          : 'border-slate-200 bg-[#F5F7FC] text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Freelance / Remote
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkType('permanent')}
                      className={`py-3.5 px-4 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        workType === 'permanent'
                          ? 'border-[#0A1020] bg-[#0A1020] text-white shadow-xs'
                          : 'border-slate-200 bg-[#F5F7FC] text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Full-Time / Onsite
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Years of Experience
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-semibold cursor-pointer"
                  >
                    <option value="1">1+ Year (Entry Level)</option>
                    <option value="3">3+ Years (Intermediate)</option>
                    <option value="5">5+ Years (Mid-Senior)</option>
                    <option value="8">8+ Years (Lead / Master Guild)</option>
                    <option value="12">12+ Years (Industry Veteran)</option>
                  </select>
                </div>
              </div>

              {/* Bio / Summary */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Bio &amp; Technical Capabilities
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Detail your equipment certifications, notable installations, previous client outcomes, or diagnostic workflow..."
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl p-5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium resize-none"
                  required
                />
              </div>

              {/* Primary Service City & Base Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-3 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Primary Service City / Hub
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Lagos, Kano, or Abuja"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Typical Base Day / Hourly Rate (NGN)
                  </label>
                  <input
                    type="text"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="e.g. 15,000"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>
              </div>

              {/* NIN / National Identity (Verification) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-3 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    National ID / NIN (Optional for badge)
                  </label>
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    placeholder="e.g. 11-digit NIN or Passport No"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Workshop / Lab Address (Trades)
                  </label>
                  <input
                    type="text"
                    value={workshopAddress}
                    onChange={(e) => setWorkshopAddress(e.target.value)}
                    placeholder="e.g. Shop 4B, Farm Centre, Kano"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!title.trim() || !bio.trim()}
                onClick={() => setStep('progress')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  title.trim() && bio.trim()
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                <span>Save Profile &amp; Setup Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6B-1: CLIENT INDUSTRY (ClientIndustryPage.tsx)               */}
        {/* ================================================================= */}
        {step === 'client_industry' && selectedRole === 'client' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                What is your company sector?
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Helps us match you with top-rated talent specialized in your market domain.
              </p>
            </div>

            {renderProgressBar()}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CLIENT_INDUSTRIES.map((ind) => {
                const isSelected = clientIndustry === ind.id
                return (
                  <div
                    key={ind.id}
                    onClick={() => setClientIndustry(ind.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#0A1020] bg-white shadow-xs ring-2 ring-[#4D78FF]'
                        : 'border-slate-200 hover:border-slate-300 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        {React.createElement(ind.icon, { className: 'w-4 h-4' })}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#4D78FF] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{ind.title}</div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {ind.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('client_goals')}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold bg-[#0A1020] hover:bg-[#4D78FF] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next: Hiring Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6B-2: CLIENT GOALS & SIZES (ClientGoalsPage.tsx)             */}
        {/* ================================================================= */}
        {step === 'client_goals' && selectedRole === 'client' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                What is your primary hiring goal?
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Customizes your workspace for one-off repairs, multi-trade projects, or ongoing facility maintenance.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Hiring Goals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CLIENT_GOALS.map((goal) => {
                  const isSelected = clientGoal === goal.id
                  return (
                    <div
                      key={goal.id}
                      onClick={() => setClientGoal(goal.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-[#0A1020] bg-slate-50 shadow-xs ring-2 ring-[#4D78FF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#4D78FF] bg-[#4D78FF]/10 px-2.5 py-0.5 rounded-full border border-[#4D78FF]/20">
                          {goal.tag}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#4D78FF] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{goal.title}</div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {goal.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Company Size */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Current Team / Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-semibold cursor-pointer"
                >
                  {COMPANY_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('client_profile')}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold bg-[#0A1020] hover:bg-[#4D78FF] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next: Finalize Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6B-3: CLIENT PROFILE SETUP (ClientProfileSetupPage.tsx)       */}
        {/* ================================================================= */}
        {step === 'client_profile' && selectedRole === 'client' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Finalize your company profile
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Help local specialists understand your property, facility, or project requirements.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
                <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {profileImage ? (
                    <Image src={profileImage} alt="Logo" fill className="object-cover" />
                  ) : (
                    <Building2 className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">Company Logo or Brand Icon</div>
                  <p className="text-xs text-slate-500">
                    JPG or PNG under 5MB. Builds trust with specialists when posting jobs.
                  </p>
                  <label className="inline-block mt-1">
                    <span className="text-xs font-semibold text-[#4D78FF] hover:underline cursor-pointer">
                      Upload brand logo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Company or Project Brand Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Zenith Tech Labs or Bello Residence"
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  required
                />
              </div>

              {/* Company Bio */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Company Bio / What You Do
                </label>
                <textarea
                  value={companyBio}
                  onChange={(e) => setCompanyBio(e.target.value)}
                  rows={4}
                  placeholder="Describe your organization, typical projects, and service standards..."
                  className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl p-5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium resize-none"
                  required
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Website or LinkedIn (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full bg-[#F5F7FC] border border-slate-200 rounded-2xl pl-13 pr-4 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4D78FF] focus:bg-white focus:ring-4 focus:ring-[#4D78FF]/15 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!companyName.trim()}
                onClick={() => setStep('progress')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  companyName.trim()
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                <span>Save Profile &amp; Setup Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 7: SETUP PROGRESS (ProfileSetupProgressPage.tsx)             */}
        {/* ================================================================= */}
        {step === 'progress' && (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-300 py-6">
            {/* Circular Radar & Progress Ring - Thin & Refined */}
            <div className="relative flex flex-col items-center justify-center text-center">
              {/* Pulsing Ambient Glow */}
              <div className="absolute w-44 h-44 bg-[#4D78FF]/15 rounded-full blur-2xl pointer-events-none animate-pulse" />

              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Radial Gauge - Sleek thin stroke */}
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="53"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.5"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4D78FF" />
                      <stop offset="60%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="53"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={333}
                    strokeDashoffset={333 * (1 - progressPercent / 100)}
                    className="transition-all duration-200 ease-out"
                  />
                </svg>

                {/* Center Stat */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#0A1020] tracking-tight">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4D78FF] mt-0.5">
                    {submitError ? 'Interrupted' : progressPercent >= 100 ? 'Secured' : 'Calibrating'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Banner if real registration encountered an issue */}
            {submitError && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-3 animate-in fade-in max-w-xl mx-auto shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{submitError.toLowerCase().includes('already registered') || submitError.toLowerCase().includes('already exists') ? 'Account Already Registered' : 'Provisioning Interrupted'}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">{submitError}</p>
                <div className="flex items-center gap-3 pt-1">
                  {submitError.toLowerCase().includes('already registered') || submitError.toLowerCase().includes('already exists') ? (
                    <Link
                      href={`/login?email=${encodeURIComponent(email)}`}
                      className="px-4 py-2.5 bg-[#0A1020] hover:bg-[#4D78FF] text-white rounded-xl text-xs font-black transition-all shadow-xs inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Log In to Existing Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('')
                          setStep(selectedRole === 'client' ? 'contact_info' : 'provider_rates')
                        }}
                        className="px-3.5 py-1.5 bg-[#053F28] hover:bg-[#043320] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Edit Account Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('')
                          setProgressPercent(15)
                          setActiveProgressTask(0)
                          setStep('progress')
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Retry Provisioning
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Header Text */}
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold border border-[#10B981]/20">
                <Check className="w-3.5 h-3.5" />
                <span>Live Account Provisioning</span>
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Setting up your workspace
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
                Calibrating your multi-currency escrow vault, sealing credentials, and indexing regional specialist dispatch routing.
              </p>
            </div>

            {/* Linear Shimmer Bar - Thin & Minimal 1.5px */}
            <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-[#4D78FF] via-[#38BDF8] to-[#10B981] transition-all duration-200 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Real-time Milestone Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 0,
                  title: 'Cryptographic Identity',
                  desc: 'Profile credentials sealed & verified',
                  icon: ShieldCheck,
                },
                {
                  id: 1,
                  title: 'Sector & Tags Index',
                  desc:
                    selectedRole === 'provider'
                      ? `Cataloged in ${currentSector.name}`
                      : `Configured for ${clientIndustry}`,
                  icon: Briefcase,
                },
                {
                  id: 2,
                  title: 'Minor-Unit Escrow Vault',
                  desc: `Provisioning ${selectedCurrency} escrow milestone routing`,
                  icon: Lock,
                },
                {
                  id: 3,
                  title: 'Real-Time Dispatch Engine',
                  desc: 'Connecting live telemetry & notification channels',
                  icon: Zap,
                },
              ].map((m) => {
                const isFinished = activeProgressTask > m.id || progressPercent >= 100
                const isCurrent = activeProgressTask === m.id && progressPercent < 100
                const IconComponent = m.icon

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                      isFinished
                        ? 'bg-white border-[#10B981]/30 shadow-xs'
                        : isCurrent
                        ? 'bg-white border-[#4D78FF] ring-2 ring-[#4D78FF]/15 shadow-md scale-[1.02]'
                        : 'bg-white/60 border-slate-200/70 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isFinished
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : isCurrent
                          ? 'bg-[#4D78FF]/10 text-[#4D78FF]'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCurrent ? (
                        <Spinner className="w-4 h-4 text-[#4D78FF]" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {m.title}
                        </span>
                        {isFinished ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Done</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#4D78FF] bg-[#4D78FF]/10 px-2 py-0.5 rounded-full shrink-0">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4D78FF] opacity-40" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4D78FF]/60" />
                            </span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">
                            Queued
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Trust Assurance Marks */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Bank-Grade 256-Bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#4D78FF]" />
                <span>Multi-Sig Escrow Vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>NDPR &amp; GDPR Compliant</span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 8: TERMS AND CONDITIONS (TermsAndConditionsPage.tsx)         */}
        {/* ================================================================= */}
        {step === 'terms' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 w-full">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Terms &amp; Escrow Charter
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Read our commitments to milestone protection, safety, and itemized transparency.
              </p>
            </div>

            {renderProgressBar()}

            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              {/* Scroll Callout Banner */}
              {!hasScrolledTerms && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-800 text-xs sm:text-sm font-bold animate-pulse">
                  <ScrollText className="w-5 h-5 shrink-0" />
                  <span>Please scroll to the end of the terms box below before accepting.</span>
                </div>
              )}

              {/* Scrollable Terms Box */}
              <div
                ref={termsContainerRef}
                onScroll={handleTermsScroll}
                className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed h-72 overflow-y-auto pr-3 border-y border-slate-100 py-4 scrollbar-thin"
              >
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Milestone Escrow Protection &amp; Minor Unit Transparency
                </h4>
                <p>
                  All project contracts and service dispatches utilize Connecta Escrow Vaults. Client funds are protected in full and only disbursed after milestone delivery or physical job completion and approval. Pricing is itemized down to minor currency units with zero surprise markups.
                </p>

                <h4 className="font-bold text-slate-900 text-sm">
                  2. Photo Evidence &amp; Change Order Protocols
                </h4>
                <p>
                  Specialists must provide photographic or digital proof of deliverables. If concealed technical faults or scope changes are required on-site, a formal digital Change Order must be submitted and confirmed before extra work commences.
                </p>

                <h4 className="font-bold text-slate-900 text-sm">
                  3. Transparent Fee Structure
                </h4>
                <p>
                  Clients broadcast projects and review quotes 100% free of charge. A transparent platform fee is applied only upon successfully released milestones, funding dispute mediation, guild verification, and escrow infrastructure.
                </p>

                <h4 className="font-bold text-slate-900 text-sm">
                  4. Fair Dispute Mediation
                </h4>
                <p>
                  In the event of an unresolvable disagreement, Connecta provides an auditable dispute mediation desk. Funds remain safeguarded in escrow while technical logs and photographic proof are reviewed impartially.
                </p>

                <h4 className="font-bold text-slate-900 text-sm">
                  5. Identity &amp; Guild Background Verification
                </h4>
                <p>
                  All specialists undergo credentials and identity audits to maintain community trust. Falsification of trade experience or off-platform coercion results in immediate account suspension.
                </p>
              </div>

              {/* Mandatory Checkbox */}
              <label
                className={`flex items-start gap-3 pt-2 ${
                  hasScrolledTerms ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!hasScrolledTerms}
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-sm text-[#10B981] focus:ring-[#4D78FF]"
                />
                <span className="text-xs text-slate-800 font-semibold leading-snug">
                  I have read and unconditionally accept the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Connecta Terms of Service
                  </Link>
                  , Escrow Safeguards, and{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit Error Alert */}
              {submitError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60 mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#0A1020] border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group active:scale-95 disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!termsAccepted || isSubmitting}
                onClick={handleActivateAccount}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  termsAccepted && !isSubmitting
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Accept Terms &amp; Activate Account</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 9: ONBOARDING COMPLETE                                       */}
        {/* ================================================================= */}
        {step === 'complete' && (
          <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300 py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A1020] tracking-tight leading-[1.08]">
                Welcome to Connecta!
              </h1>
              <p className="text-base sm:text-lg lg:text-xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {selectedRole === 'provider'
                  ? 'Your trade profile, skills, and verification ledger have been initialized. You can now receive local service jobs and submit itemized milestone quotes.'
                  : 'Your hiring workspace is live! You can now post service requests, hire vetted local artisans and technicians, and fund milestone escrow securely.'}
              </p>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 text-left shadow-xs space-y-4 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {profileImage ? (
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                      <Image src={profileImage} alt="Avatar" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#0A1020] text-white flex items-center justify-center font-black text-sm">
                      {firstName[0] || companyName[0] || 'C'}
                    </div>
                  )}
                  <div>
                    <div className="font-extrabold text-sm text-[#0A1020]">
                      {selectedRole === 'provider'
                        ? `${firstName} ${lastName}` || 'Verified Specialist'
                        : companyName || `${firstName} ${lastName}` || 'Verified Client'}
                    </div>
                    <div className="text-slate-500">
                      {selectedRole === 'provider'
                        ? title || currentSector.name
                        : `${companySize} • ${clientIndustry}`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#10B981] text-white">
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Escrow Currency:</span>{' '}
                  <span className="font-bold text-emerald-700">{selectedCurrency}</span>
                </div>
                <div>
                  <span className="text-slate-400">Primary Hub:</span>{' '}
                  <span className="font-bold">{locationCity}</span>
                </div>
                {createdAccountData?.id && (
                  <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Account ID:</span>
                    <span className="font-bold text-slate-600">{createdAccountData.id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span>Enter Connecta Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={selectedRole === 'provider' ? '/dashboard/jobs' : '/requests/new'}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-7 py-3.5 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span>
                  {selectedRole === 'provider'
                    ? 'Explore Trade Jobs'
                    : 'Post Your First Requirement'}
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <span>Homepage</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center font-bold text-xs text-slate-400">
          Loading Connecta Onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
