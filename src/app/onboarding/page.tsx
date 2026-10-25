'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
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
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronDown,
  Building2,
  Briefcase,
  Wrench,
  Smartphone,
  Laptop,
  Hammer,
  Car,
  Paintbrush,
  Wind,
  BadgeCheck,
  Lock,
  HeartHandshake,
  Clock,
  Rocket,
  UserCheck,
  DollarSign,
  FileText,
  AlertCircle,
} from 'lucide-react'
import {
  ConnectaCornerHelix,
  Sphere3D,
  SparkleStar,
} from '@/components/Connecta3DDecoration'

// =============================================================================
// DATA: SLIDES, SECTORS, SKILLS & GOALS (EXTRACTED FROM CONNECTA OLD)
// =============================================================================

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
    title: 'Discover Trusted Local Pros',
    highlight: '& Guild Certified Talent',
    description:
      'Connect instantly with background-checked electricians, solar engineers, precision carpenters, gadget repairers, and tech professionals across Kano and Nigeria.',
    stats: '15,000+',
    statsLabel: 'Verified Providers',
    icon: Users,
    cardBg: 'bg-[#0A2614]',
    accentColor: '#10B981',
  },
  {
    id: 2,
    badge: '₦500M+ Escrow Protected',
    title: 'Milestone Escrow Payouts',
    highlight: '& Guaranteed Safety',
    description:
      'Your funds are held securely in a Connecta Escrow Vault. Payments are released to the specialist only after you inspect and approve the completed repair and evidence.',
    stats: '100%',
    statsLabel: 'Escrow Guarantee',
    icon: ShieldCheck,
    cardBg: 'bg-[#1E1B4B]',
    accentColor: '#4D78FF',
  },
  {
    id: 3,
    badge: 'Itemized Kobo Pricing',
    title: 'Transparent Quoting',
    highlight: '& Real-Time Evidence',
    description:
      'No hidden markups or guesswork. Review itemized labor and parts quotes, track live technician dispatch, and verify before/after photo documentation.',
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
    id: 'electrical_solar',
    name: 'Electrical & Solar Infrastructure',
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
    name: 'Phones, Tablets & Gadgets Lab',
    description: 'Screen replacements, battery swaps, micro-soldering, charging ports.',
    icon: Smartphone,
    color: 'bg-[#4D78FF]',
    popularSkills: [
      'OLED & AMOLED Screen Replacement',
      'TrueTone & FaceID Calibration',
      'Logic Board Micro-soldering',
      'Charging Port & Tristar IC Repair',
      'Battery Health Optimization',
      'Water Damage Ultrasonic Cleaning',
      'Flex Cable Restoration',
      'Tablet Digitizer Bonding',
      'Audio & Speaker Mesh Repair',
      'Firmware & Baseband Flashing',
    ],
  },
  {
    id: 'carpentry_woodwork',
    name: 'Carpentry, Furniture & Woodwork',
    description: 'Custom furniture, door fittings, roof woodwork, wardrobe framing.',
    icon: Hammer,
    color: 'bg-[#D97706]',
    popularSkills: [
      'Solid Mahogany Office Desks',
      'Custom Wardrobe & Cabinetry',
      'Hardwood Door Hangings & Locks',
      'Roof Truss Framing & Woodwork',
      'High-Gloss Lacquer & Polishing',
      'Modular Kitchen Partitions',
      'Antique Furniture Restoration',
      'Precision Dowel & Tenon Joinery',
      'Commercial Reception Desks',
      'MDF & Plywood Precision Cutting',
    ],
  },
  {
    id: 'plumbing_pipes',
    name: 'Plumbing & Borehole Systems',
    description: 'Pipe leaks, submersible water pumps, sanitary fittings, drainage.',
    icon: Wrench,
    color: 'bg-[#0A2614]',
    popularSkills: [
      'Emergency Pipe Leak Welding',
      'Submersible Borehole Pump Fixing',
      'PPR Hot & Cold Water Piping',
      'Pressure Pump Balance & Valves',
      'Modern Sanitary & Shower Fittings',
      'Underground Drain Clearing',
      'Overhead Tank Float Calibration',
      'Soakaway System Maintenance',
      'Water Filtration & Reverse Osmosis',
      'Water Heater Pressure Relief',
    ],
  },
  {
    id: 'ac_cooling',
    name: 'AC, Cooling & Refrigeration',
    description: 'Gas refill, chemical cleaning, compressor fixes, ductless splits.',
    icon: Wind,
    color: 'bg-[#3B82F6]',
    popularSkills: [
      'R410A & R22 Gas Refill',
      'Deep Chemical Hydro-Cleaning',
      'Dual-Inverter Compressor Fixes',
      'Copper Piping Flaring & Bending',
      'Thermostat & Sensor Calibration',
      'Capacitor & Fan Motor Swap',
      'Cold Room Refrigeration Units',
      'Ductless Split AC Installation',
      'Condensate Drain Descaling',
      'Commercial Chiller Servicing',
    ],
  },
  {
    id: 'auto_mechanic',
    name: 'Auto Mechanics & Diagnostics',
    description: 'OBD2 scanning, brake systems, engine rebuilds, suspension overhaul.',
    icon: Car,
    color: 'bg-[#2E1A47]',
    popularSkills: [
      'OBD2 Computer Diagnostics Scan',
      'Ceramic Brake Pad Replacement',
      'Suspension Bushings & Shocks',
      'Automatic Transmission Service',
      'Fuel Injector Ultrasonic Purge',
      'Alternator & Starter Overhaul',
      'Radiator Cooling System Flush',
      'Engine Timing Belt Installation',
      'Power Steering Rack Repair',
      'ECU Module Reprogramming',
    ],
  },
  {
    id: 'computer_hardware',
    name: 'Computer & Hardware Engineering',
    description: 'Laptop motherboard diagnostics, screens, SSD upgrades, thermal paste.',
    icon: Laptop,
    color: 'bg-[#0A1020]',
    popularSkills: [
      'Laptop Motherboard Diagnostics',
      'Thermal Paste & Fan Overhaul',
      'NVMe SSD & High-Speed RAM Upgrade',
      'MacBook Retina Screen Assembly',
      'Bios Chip Flashing & Recovery',
      'GPU Reballing & Micro-soldering',
      'Spill-Resistant Keyboard Swap',
      'Hinge & Chassis Laser Bonding',
      'Data Recovery from Dead Drives',
      'Enterprise Server Maintenance',
    ],
  },
  {
    id: 'painting_finishing',
    name: 'Painting & Screeding Finishing',
    description: 'Interior wall screeding, satin emulsion, POP ceilings, damp proofing.',
    icon: Paintbrush,
    color: 'bg-[#10B981]',
    popularSkills: [
      'Fine Wall Screeding & Sanding',
      'Washable Satin & Silk Emulsion',
      'POP Ceiling Jointing & Moulding',
      'Anti-Damp Moisture Treatment',
      'Exterior Weather-Resistant Coating',
      'Epoxy Floor Chemical Coating',
      'Decorative Stucco & Marbling',
      'Wood Stain & Varnish Application',
      'Spray Finish on Metal Gates',
      'Industrial Warehouse Floor Lines',
    ],
  },
]

const CLIENT_INDUSTRIES = [
  {
    id: 'homeowner',
    title: 'Homeowner / Residential',
    desc: 'Emergency repairs, solar setups, furniture, and plumbing for houses and apartments.',
    icon: Building2,
  },
  {
    id: 'sme_office',
    title: 'Business & Office Workplace',
    desc: 'Office AC servicing, electrical wiring, IT hardware, desks, and security cameras.',
    icon: Briefcase,
  },
  {
    id: 'property_manager',
    title: 'Real Estate & Facility Management',
    desc: 'Multi-unit tenant maintenance, borehole pumps, painting, and scheduled servicing.',
    icon: Users,
  },
  {
    id: 'hospitality',
    title: 'Hospitality, Hotel & Commercial',
    desc: 'Commercial cooling, high-capacity electricals, restaurant fittings, and rapid dispatch.',
    icon: Sparkles,
  },
]

const CLIENT_GOALS = [
  {
    id: 'emergency',
    title: 'Emergency Immediate Dispatch',
    desc: 'Need a vetted pro on-site within 45 to 60 minutes for urgent faults or leaks.',
    tag: '⚡ 45–60 min Arrival',
  },
  {
    id: 'scheduled_fix',
    title: 'One-Time Scheduled Repair',
    desc: 'Get quotes today and schedule a technician for this week at your convenience.',
    tag: '📅 Flexible Date',
  },
  {
    id: 'renovation_project',
    title: 'Major Renovation or Installation',
    desc: 'Complete solar installation, full building rewire, new furniture, or full plumbing setup.',
    tag: '🛠 Milestone Escrow',
  },
  {
    id: 'maintenance_retainer',
    title: 'Ongoing Property Maintenance',
    desc: 'Retain verified artisans for recurring monthly servicing and priority dispatch.',
    tag: '🛡 Dedicated Guild Pros',
  },
]

const KANO_METRO_ZONES = [
  'Nassarawa GRA',
  'Bompai Industrial',
  'Sabon Gari Market',
  'Fagge Commercial',
  'Tarauni Residential',
  'Dala Historic',
  'Gwale District',
  'Hotoro Hub',
  'Kano Municipal',
  'Kano Tech Corridor',
  'Other Northern Zone',
]

// =============================================================================
// MAIN ONBOARDING COMPONENT
// =============================================================================

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Steps: 'welcome' | 'role' | 'sector' | 'skills' | 'profile' | 'verification' | 'progress' | 'terms' | 'complete'
  const initialStepParam = searchParams.get('step') || 'welcome'
  const initialRoleParam = (searchParams.get('role') as 'client' | 'provider') || null

  const [step, setStep] = useState<string>(initialStepParam)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [selectedRole, setSelectedRole] = useState<'client' | 'provider' | null>(initialRoleParam)

  // Provider Form State
  const [selectedSectorId, setSelectedSectorId] = useState<string>('electrical_solar')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchQuery, setSkillSearchQuery] = useState('')
  const [customSkillInput, setCustomSkillInput] = useState('')

  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [locationZone, setLocationZone] = useState('Nassarawa GRA')
  const [experienceYears, setExperienceYears] = useState('5')
  const [baseRate, setBaseRate] = useState('15,000')
  const [bio, setBio] = useState('')
  const [ninNumber, setNinNumber] = useState('')
  const [workshopAddress, setWorkshopAddress] = useState('')

  // Client Form State
  const [clientIndustry, setClientIndustry] = useState('homeowner')
  const [clientGoal, setClientGoal] = useState('emergency')
  const [clientContactName, setClientContactName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientZone, setClientZone] = useState('Nassarawa GRA')

  // Loading / Setup Progress State
  const [progressPercent, setProgressPercent] = useState(0)
  const [activeProgressTask, setActiveProgressTask] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Sync with sector change
  const currentSector = useMemo(() => {
    return SECTORS.find((s) => s.id === selectedSectorId) || SECTORS[0]
  }, [selectedSectorId])

  // Filter skills by search query
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
      if (selectedSkills.length >= 12) return
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

  // Handle Animated Setup Progress
  useEffect(() => {
    if (step === 'progress') {
      setProgressPercent(0)
      setActiveProgressTask(0)

      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 50)

      const t1 = setTimeout(() => setActiveProgressTask(1), 800)
      const t2 = setTimeout(() => setActiveProgressTask(2), 1700)
      const t3 = setTimeout(() => setActiveProgressTask(3), 2500)
      const t4 = setTimeout(() => {
        setStep('terms')
      }, 3400)

      return () => {
        clearInterval(interval)
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
      }
    }
  }, [step])

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between relative overflow-hidden selection:bg-[#4D78FF] selection:text-white">
      {/* Halftone dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative 3D Corner Helix from deco.png */}
      <div className="absolute -top-16 -right-12 pointer-events-none z-0 hidden lg:block opacity-80">
        <ConnectaCornerHelix />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-[#0C513F] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 shadow-sm hover:scale-105 transition-all"
            >
              <div className="relative w-4 h-4 shrink-0">
                <Image
                  src="/brand/connecta-header-icon.svg"
                  alt="Connecta Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                connecta
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span>🇳🇬</span>
              <span>NG</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#10B981]">Onboarding Portal</span>
            </div>
          </div>

          {/* Step Progress Pills & Controls */}
          <div className="flex items-center gap-3 text-xs font-bold">
            {step !== 'welcome' && step !== 'complete' && (
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="capitalize">{step} Setup</span>
              </div>
            )}

            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 transition-colors py-1 px-2.5"
            >
              Exit to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form & Walkthrough Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col justify-center">
        {/* ================================================================= */}
        {/* 1. WELCOME WALKTHROUGH SLIDES (Exact adaptation from OnboardingScreen) */}
        {/* ================================================================= */}
        {step === 'welcome' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#10B981] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Welcome to Connecta 2.0</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020] leading-[1.12]">
                Your Verified Artisans & Tech Ecosystem Starts Here
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Discover vetted technicians, itemized transparent quotes, and Paystack-backed milestone escrow security across Nigeria.
              </p>
            </div>

            {/* Tactile Chowdeck Card for Slide Presentation */}
            <div className="bg-white rounded-3xl sm:rounded-[36px] border-[2.5px] border-black p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
              {/* Halftone texture */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#0A1020 1.5px, transparent 1.5px)',
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Card Visual Frame */}
                <div className="md:col-span-5">
                  <div
                    className={`${ONBOARDING_SLIDES[currentSlideIndex].cardBg} text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between aspect-square relative shadow-lg overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                        {ONBOARDING_SLIDES[currentSlideIndex].badge}
                      </span>
                      <SparkleStar x={20} y={20} size={14} fill="#F59E0B" />
                    </div>

                    <div className="my-auto py-6 flex flex-col items-center justify-center text-center space-y-3">
                      {React.createElement(
                        ONBOARDING_SLIDES[currentSlideIndex].icon,
                        {
                          className: 'w-16 h-16 text-white stroke-[1.75]',
                        }
                      )}
                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {ONBOARDING_SLIDES[currentSlideIndex].stats}
                      </div>
                      <div className="text-xs font-bold text-white/80">
                        {ONBOARDING_SLIDES[currentSlideIndex].statsLabel}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 font-bold">
                      <span>Connecta Standard</span>
                      <span className="text-emerald-300">100% Vetted</span>
                    </div>
                  </div>
                </div>

                {/* Right Slide Content */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#10B981]">
                      Pillar 0{currentSlideIndex + 1} of 03
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1020] tracking-tight leading-snug">
                      {ONBOARDING_SLIDES[currentSlideIndex].title}{' '}
                      <span className="text-[#4D78FF]">
                        {ONBOARDING_SLIDES[currentSlideIndex].highlight}
                      </span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {ONBOARDING_SLIDES[currentSlideIndex].description}
                    </p>
                  </div>

                  {/* Slide Progress Dots */}
                  <div className="flex items-center gap-2 pt-2">
                    {ONBOARDING_SLIDES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          currentSlideIndex === idx
                            ? 'w-8 bg-[#0A1020]'
                            : 'w-2.5 bg-slate-200 hover:bg-slate-400'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {currentSlideIndex < ONBOARDING_SLIDES.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
                      >
                        <span>Next Feature</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStep('role')}
                        className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105"
                      >
                        <span>Choose Your Role</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setStep('role')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 px-4 py-3"
                    >
                      Skip to Role Selection →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. ROLE SELECTION (Exact adaptation from RoleSelectionPage)        */}
        {/* ================================================================= */}
        {step === 'role' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4D78FF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Account Personalization</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                How do you want to use Connecta?
              </h1>
              <p className="text-sm text-slate-600">
                Select your primary path. You can seamlessly switch or hire and offer services from one unified account anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Option A: Client / Hirer */}
              <div
                onClick={() => setSelectedRole('client')}
                className={`bg-white rounded-3xl p-7 sm:p-9 border-[2.5px] cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                  selectedRole === 'client'
                    ? 'border-[#0A1020] shadow-2xl scale-[1.02] ring-4 ring-[#4D78FF]/20'
                    : 'border-slate-300 hover:border-slate-500 shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedRole === 'client'
                          ? 'bg-[#0A1020] text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#4D78FF] group-hover:text-white'
                      }`}
                    >
                      <HeartHandshake className="w-7 h-7" />
                    </div>
                    {selectedRole === 'client' && (
                      <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#0A1020] tracking-tight">
                      I want to Hire & Get Things Fixed
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Post emergency repair requests, discover vetted local technicians, compare itemized kobo quotes, and pay safely via Paystack Escrow.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      0% Client Posting Fee
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Milestone Escrow
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      45-min Dispatch
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>For Homeowners, Offices & Managers</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Option B: Provider / Artisan */}
              <div
                onClick={() => setSelectedRole('provider')}
                className={`bg-white rounded-3xl p-7 sm:p-9 border-[2.5px] cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                  selectedRole === 'provider'
                    ? 'border-[#0A1020] shadow-2xl scale-[1.02] ring-4 ring-[#10B981]/20'
                    : 'border-slate-300 hover:border-slate-500 shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedRole === 'provider'
                          ? 'bg-[#0A2614] text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#10B981] group-hover:text-white'
                      }`}
                    >
                      <Wrench className="w-7 h-7" />
                    </div>
                    {selectedRole === 'provider' && (
                      <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#0A1020] tracking-tight">
                      I want to Offer Services & Work
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Receive verified customer leads in Kano, submit professional itemized quotations, verify your trade ID, and enjoy instant bank payouts.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified Guild Badge
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Direct Leads
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      Instant Payouts
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>For Technicians, Artisans & Squads</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep('welcome')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!selectedRole}
                onClick={() => {
                  if (selectedRole === 'client') setStep('profile')
                  if (selectedRole === 'provider') setStep('sector')
                }}
                className={`inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  selectedRole
                    ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Continue Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. SECTOR SELECTION (Provider Path - SectorSelectionPage)          */}
        {/* ================================================================= */}
        {step === 'sector' && selectedRole === 'provider' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 1 of 4: Primary Trade Sector
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1020]">
                Select Your Core Artisan Sector
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Choose the technical trade where you offer verified services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTORS.map((sec) => {
                const Icon = sec.icon
                const isSelected = selectedSectorId === sec.id
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectorId(sec.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 relative ${
                      isSelected
                        ? 'border-[#0A1020] bg-white shadow-xl scale-[1.01]'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? `${sec.color} text-white` : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-sm font-extrabold text-[#0A1020] tracking-tight">
                        {sec.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {sec.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('role')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back to Roles
              </button>

              <button
                type="button"
                onClick={() => setStep('skills')}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-8 py-3 text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all"
              >
                <span>Next: Choose Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. SKILLS SELECTION (Provider Path - SkillSelectionPage)           */}
        {/* ================================================================= */}
        {step === 'skills' && selectedRole === 'provider' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 2 of 4: Specific Skills & Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1020]">
                What services do you provide?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Select from popular specializations in {currentSector.name} or type your own.
              </p>
            </div>

            {/* Search and custom skill add */}
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  placeholder="Filter skills (e.g. Inverter, Screen, Conduit, Leak)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#0A1020] focus:outline-none"
                />
              </div>

              {/* Skill pills pool */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Popular {currentSector.name} Capabilities:
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs font-bold px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A1020] text-white shadow-md scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom skill input */}
              <form onSubmit={handleAddCustomSkill} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom specialization..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-slate-200 hover:bg-slate-800 hover:text-white text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  + Add
                </button>
              </form>
            </div>

            {/* Selected Skills Summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                <span>Selected Skills: {selectedSkills.length} of 12</span>
              </div>
              <span className="text-slate-500">Clients discover you by these tags</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('sector')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back to Sectors
              </button>

              <button
                type="button"
                disabled={selectedSkills.length === 0}
                onClick={() => setStep('profile')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs sm:text-sm font-bold shadow-md transition-all ${
                  selectedSkills.length > 0
                    ? 'bg-[#0A1020] hover:bg-[#4D78FF] text-white hover:scale-105 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Next: Professional Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. PROFILE & IDENTITY SETUP (Shared by Role)                      */}
        {/* ================================================================= */}
        {step === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto w-full">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedRole === 'provider' ? 'Step 3 of 4: Public Profile' : 'Step 1 of 2: Your Details'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1020]">
                {selectedRole === 'provider'
                  ? 'Set Up Your Trade Profile'
                  : 'Tell Us About Your Household or Business'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {selectedRole === 'provider'
                  ? 'This information appears on your public Connecta verified profile.'
                  : 'We tailor emergency dispatch and local quotes to your exact needs.'}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-black shadow-xl space-y-5">
              {/* If Client Role */}
              {selectedRole === 'client' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase text-slate-700">
                      Who is requesting services?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CLIENT_INDUSTRIES.map((ind) => (
                        <div
                          key={ind.id}
                          onClick={() => setClientIndustry(ind.id)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            clientIndustry === ind.id
                              ? 'border-[#0A1020] bg-slate-50 font-bold text-[#0A1020]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-extrabold">{ind.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {ind.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase text-slate-700">
                      Primary Service Urgency
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CLIENT_GOALS.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => setClientGoal(g.id)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            clientGoal === g.id
                              ? 'border-[#10B981] bg-emerald-50/50 text-[#0A1020]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-extrabold text-[#10B981] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                            {g.tag}
                          </span>
                          <div className="text-xs font-bold mt-1.5">{g.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                      <input
                        type="text"
                        value={clientContactName}
                        onChange={(e) => setClientContactName(e.target.value)}
                        placeholder="e.g. Amina Bello or Alhaji Garba"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number (WhatsApp / Calls)</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Primary Metropolitan Zone</label>
                    <select
                      value={clientZone}
                      onChange={(e) => setClientZone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                    >
                      {KANO_METRO_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                /* Provider Profile Form */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ibrahim Aliyu"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Workshop or Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Arewa Solar Engineering"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Years of Experience</label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                      >
                        <option value="1">1–2 years (Emerging)</option>
                        <option value="3">3–5 years (Skilled)</option>
                        <option value="8">6–10 years (Senior)</option>
                        <option value="12">10+ years (Master Guild)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Location Base Zone</label>
                      <select
                        value={locationZone}
                        onChange={(e) => setLocationZone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                      >
                        {KANO_METRO_ZONES.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Typical Starting Rate (₦ NGN)</label>
                      <input
                        type="text"
                        value={baseRate}
                        onChange={(e) => setBaseRate(e.target.value)}
                        placeholder="e.g. 10,000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Short Bio / Trade Background</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Explain your trade specialty, past notable installations, or workshop setup..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (selectedRole === 'client') setStep('role')
                  if (selectedRole === 'provider') setStep('skills')
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedRole === 'client') setStep('progress')
                  if (selectedRole === 'provider') setStep('verification')
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-8 py-3 text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all"
              >
                <span>{selectedRole === 'client' ? 'Finalize Workspace' : 'Next: Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. VERIFICATION (Provider Path - NIN/CAC & Workshop Address)       */}
        {/* ================================================================= */}
        {step === 'verification' && selectedRole === 'provider' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto w-full">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 4 of 4: Trust & Identity Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1020]">
                Government & Workshop Audit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                To receive the official Connecta Verified Artisan badge and high-value project dispatch.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-black shadow-xl space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  National Identity Number (NIN) or CAC Registration Number
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    placeholder="e.g. 11-digit NIN or RC/BN Number"
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Your identity number is securely hashed and verified with government registry.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Physical Workshop / Office Address
                </label>
                <input
                  type="text"
                  value={workshopAddress}
                  onChange={(e) => setWorkshopAddress(e.target.value)}
                  placeholder="e.g. Shop 14, Bompai Industrial Layout, Kano"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
                <div className="font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Connecta Provider Guarantee</span>
                </div>
                <div className="text-[11px] text-emerald-800 leading-relaxed">
                  ✓ Verified badge displayed on your quotes to customers<br />
                  ✓ Milestone escrow protection on all jobs (100% payout guaranteed upon work approval)<br />
                  ✓ Transparent 10% platform fee only on completed contracts
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back to Profile
              </button>

              <button
                type="button"
                onClick={() => setStep('progress')}
                className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 transition-all"
              >
                <span>Save & Initialize Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. PROGRESS INITIALIZATION (ProfileSetupProgressPage adaptation)   */}
        {/* ================================================================= */}
        {step === 'progress' && (
          <div className="max-w-md mx-auto text-center space-y-8 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-[#0A2614] text-[#10B981] flex items-center justify-center mx-auto shadow-2xl relative">
              <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
                Setting Up Your Workspace
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Configuring your verified credentials, escrow wallet, and local zone routing.
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="bg-[#10B981] h-full rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Initializing...</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            {/* Loading step checklist */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    activeProgressTask >= 0 ? 'text-[#10B981]' : 'text-slate-300'
                  }`}
                />
                <span className={activeProgressTask >= 0 ? 'font-bold' : ''}>
                  Saving account credentials & trade profile
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    activeProgressTask >= 1 ? 'text-[#10B981]' : 'text-slate-300'
                  }`}
                />
                <span className={activeProgressTask >= 1 ? 'font-bold' : ''}>
                  Connecting to Kano Metropolitan dispatch network
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    activeProgressTask >= 2 ? 'text-[#10B981]' : 'text-slate-300'
                  }`}
                />
                <span className={activeProgressTask >= 2 ? 'font-bold' : ''}>
                  Securing Paystack milestone escrow vault
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    activeProgressTask >= 3 ? 'text-[#10B981]' : 'text-slate-300'
                  }`}
                />
                <span className={activeProgressTask >= 3 ? 'font-bold' : ''}>
                  Finalizing Connecta 2.0 workspace
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. TERMS & ESCROW AGREEMENT (TermsAndConditionsPage adaptation)   */}
        {/* ================================================================= */}
        {step === 'terms' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Platform Safety & Trust Charter
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1020]">
                Connecta Trust & Escrow Agreement
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Review our commitments to safety, transparent kobo pricing, and milestone payouts.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-black shadow-xl space-y-4">
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed h-60 overflow-y-auto pr-2 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  1. Milestone Escrow Protection & Minor Unit Transparency
                </h4>
                <p>
                  All project contracts and service dispatches utilize Connecta Escrow Vaults. Client funds are protected in full and only disbursed after physical job completion and verification of deliverables. Pricing is itemized down to minor units (kobo) with zero surprise markups.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm">
                  2. Photo Evidence & Change Order Protocols
                </h4>
                <p>
                  Specialists must provide digital before/after photographic documentation of repairs. If concealed technical faults are found on-site, a formal digital Change Order must be submitted and confirmed by the customer before additional work commences.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm">
                  3. Transparent Fee Structure
                </h4>
                <p>
                  Customers browse, broadcast repair needs, and compare quotes 100% free of charge. A transparent 10% platform fee is applied to completed artisan contracts, ensuring ongoing dispute mediation, guild auditing, and system security.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm">
                  4. Fair Dispute Mediation
                </h4>
                <p>
                  In the rare event of an unresolvable disagreement, Connecta provides an auditable dispute mediation desk. Funds remain safeguarded in escrow while technical logs and photographic proof are reviewed impartially.
                </p>
              </div>

              {/* Checkbox agreement */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-sm text-[#10B981] focus:ring-black"
                />
                <span className="text-xs text-slate-800 font-semibold leading-snug">
                  I agree to the Connecta Terms of Service, Escrow Safeguards, and Privacy Policy.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!termsAccepted}
                onClick={() => setStep('complete')}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-md transition-all ${
                  termsAccepted
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white hover:scale-105 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Accept & Complete Onboarding</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 9. ONBOARDING COMPLETE CELEBRATION (Success Screen)               */}
        {/* ================================================================= */}
        {step === 'complete' && (
          <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Setup Complete
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight">
                Welcome to Connecta!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {selectedRole === 'provider'
                  ? 'Your trade profile and verification credentials have been initialized. You can now receive leads and submit itemized quotes.'
                  : 'Your account is ready! You can now request emergency repairs, discover verified local pros, and hire with escrow protection.'}
              </p>
            </div>

            {/* Profile summary card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-black text-left shadow-xl space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="font-extrabold text-sm text-[#0A1020]">
                    {selectedRole === 'provider'
                      ? businessName || fullName || 'Verified Provider'
                      : clientContactName || 'Verified Hirer'}
                  </div>
                  <div className="text-slate-500">
                    {selectedRole === 'provider' ? currentSector.name : `${clientZone} • ${clientIndustry}`}
                  </div>
                </div>
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#10B981] text-white">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Escrow Vault:</span>{' '}
                  <span className="font-bold text-emerald-700">Connected</span>
                </div>
                <div>
                  <span className="text-slate-400">Coverage Zone:</span>{' '}
                  <span className="font-bold">{selectedRole === 'provider' ? locationZone : clientZone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={selectedRole === 'provider' ? '/admin/verification' : '/requests/new'}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-8 py-3.5 text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all"
              >
                <span>{selectedRole === 'provider' ? 'View Verification Status' : 'Post Your First Repair Need'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 px-6 py-3.5 text-xs sm:text-sm font-bold transition-all"
              >
                <span>Explore Homepage</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white/60 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 Connecta. Developed by Pioneers ICT. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FC] text-[#0A1020]">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Loading Connecta Onboarding...</span>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
