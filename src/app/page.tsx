'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Wrench,
  Zap,
  Smartphone,
  Laptop,
  Hammer,
  Car,
  Paintbrush,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  Star,
  Users,
  BadgeCheck,
  FileSearch,
  ChevronDown,
  Award,
  Layers,
  HeartHandshake,
  Building2,
  Lock,
  ArrowDownRight,
  ArrowDown,
  ArrowUpRight,
  CornerDownRight,
  Check,
  ArrowUp,
  Phone,
  Mail,
  Globe,
  ShoppingCart,
  Volume2,
  VolumeX,
  Menu,
  X,
} from 'lucide-react'
import { SectionBorderDivider } from '@/components/Connecta3DDecoration'
import ScrollReveal from '@/components/ScrollReveal'

const DYNAMIC_PHRASES = [
  "the world's work",
  'essential trades & skilled services',
  'technology & programming',
  'plumbing, solar & electrical',
  'design & creative projects',
  'carpentry & home installations',
  'high-impact Collabo Squads',
]

const TRADE_TABS = [
  { id: 'all', label: 'All Trades (8)' },
  { id: 'power', label: 'Electrical & Solar' },
  { id: 'devices', label: 'Phones & Gadgets' },
  { id: 'home', label: 'Woodwork & Home' },
  { id: 'cooling-plumbing', label: 'Cooling & Pipes' },
  { id: 'vehicles', label: 'Auto Diagnostics' },
]

const CATEGORIES = [
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    group: 'power',
    image: '/images/services/electrician_working_on_electrical_panel.jpg',
    alt: 'Electrician working on an electrical distribution panel in Kano',
    desc: 'Fault finding, house wiring, inverter & solar installations, breaker repair',
    badge: 'High Demand',
    badgeColor: 'bg-[#D97706] text-white',
    speed: 'Avg 45 min arrival',
    themeBg: 'bg-[#1E1B4B]',
    accentColor: '#10B981',
    tags: ['Solar Sizing', 'Inverters', 'Breakers'],
  },
  {
    name: 'Phone & Tablet Repair',
    slug: 'phone-repair',
    group: 'devices',
    image: '/images/services/phone_repair_technician.jpg',
    alt: 'Technician repairing smartphone motherboard and screen',
    desc: 'Screens, battery replacements, charging ports, board micro-soldering',
    badge: 'Same Day',
    badgeColor: 'bg-[#10B981] text-white',
    speed: 'Under 1 hr repair',
    themeBg: 'bg-[#0A1020]',
    accentColor: '#4D78FF',
    tags: ['OLED Screens', 'TrueTone', 'Motherboards'],
  },
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry',
    group: 'home',
    image: '/images/services/carpenter_working_in_nigeria.jpg',
    alt: 'Carpenter working on wooden construction in Nigeria',
    desc: 'Custom furniture, door fittings, roof woodwork, wardrobe framing',
    badge: 'Master Guild',
    badgeColor: 'bg-[#D97706] text-white',
    speed: 'Certified timber',
    themeBg: 'bg-[#2E1A47]',
    accentColor: '#F59E0B',
    tags: ['Custom Woodwork', 'Door Fitting', 'Roof Trusses'],
  },
  {
    name: 'AC & Refrigeration',
    slug: 'ac-cooling',
    group: 'cooling-plumbing',
    image: '/images/services/air_conditioner_repair_technician.jpg',
    alt: 'Technician inspecting and servicing air conditioner unit',
    desc: 'AC gas refill, compressor maintenance, duct cleaning, installation',
    badge: 'Seasonal Rush',
    badgeColor: 'bg-[#4D78FF] text-white',
    speed: 'Genuine gas top-up',
    themeBg: 'bg-[#0A2614]',
    accentColor: '#10B981',
    tags: ['Gas Top-Up', 'Compressors', 'Duct Flushing'],
  },
  {
    name: 'Computer & Laptop Repair',
    slug: 'computer-repair',
    group: 'devices',
    image: '/images/services/computer_repair_technician.jpg',
    alt: 'Technician repairing laptop hardware in workshop',
    desc: 'Hardware upgrades, OS reinstallation, screens & thermal paste fixes',
    badge: 'Bench Lab',
    badgeColor: 'bg-[#8B7CFF] text-white',
    speed: 'Hardware diagnostic',
    themeBg: 'bg-[#1E1B4B]',
    accentColor: '#8B7CFF',
    tags: ['Thermal Paste', 'NVMe SSDs', 'Diagnostics'],
  },
  {
    name: 'Auto Mechanics & Diagnostics',
    slug: 'auto-mechanic',
    group: 'vehicles',
    image: '/images/services/car_mechanic_repairing_engine.jpg',
    alt: 'Mechanic servicing car engine diagnostics in workshop',
    desc: 'Engine diagnostics, brake repairs, suspension, routine maintenance',
    badge: 'Mobile Service',
    badgeColor: 'bg-[#E67E00] text-white',
    speed: 'OBD2 scan included',
    themeBg: 'bg-[#0A1020]',
    accentColor: '#F59E0B',
    tags: ['OBD2 Scans', 'Brake Systems', 'Suspension'],
  },
  {
    name: 'Painting & Wall Finishing',
    slug: 'painting',
    group: 'home',
    image: '/images/services/house_painter_painting_wall.jpg',
    alt: 'Painter applying smooth coat to interior wall',
    desc: 'Interior and exterior painting, POP plastering, waterproofing',
    badge: 'Craft Precision',
    badgeColor: 'bg-[#10B981] text-white',
    speed: 'Clean site cleanup',
    themeBg: 'bg-[#2E1A47]',
    accentColor: '#10B981',
    tags: ['POP Plastering', 'Waterproofing', 'Interiors'],
  },
  {
    name: 'Plumbing & Pipe Maintenance',
    slug: 'plumbing',
    group: 'cooling-plumbing',
    image: '/images/services/cleaning_or_maintenance_technician.jpg',
    alt: 'Maintenance specialist working on piping equipment',
    desc: 'Water pipe leaks, borehole pumps, kitchen & bathroom installations',
    badge: 'Emergency Ready',
    badgeColor: 'bg-[#DC2626] text-white',
    speed: 'Pressure testing',
    themeBg: 'bg-[#0A2614]',
    accentColor: '#4D78FF',
    tags: ['Borehole Pumps', 'Pipe Leaks', 'Pressure Valves'],
  },
]

// Chowdeck Trade Directory Structure (Matching Explore Supported Trades)
const TRADE_ACCORDION_ITEMS = {
  metro: [
    {
      id: 'solar-electrical',
      slug: 'electrical',
      title: 'Solar & Electrical Power',
      desc: 'Certified solar engineers and licensed electricians for residential inverter setups, hybrid battery systems, safety audits, and clean domestic power.',
      bg: 'bg-[#DBD5F9]',
      textColor: 'text-[#4C1D95]',
      tags: ['Solar Inverters', 'Lithium Batteries', 'Distribution Boards', 'Prepaid Meters', 'Safety Earthing'],
      image: '/images/services/nigerian_electrician_ibrahim.jpg',
      alt: 'Electrician working on electrical panel in Kano',
      artisanName: 'Ibrahim Aliyu',
      artisanTitle: 'Master Solar Engineer',
      artisanRating: '4.95 ★ (48 reviews)',
      icon: 'storefront',
    },
    {
      id: 'phone-gadgets',
      slug: 'phone-repair',
      title: 'Smart Devices & Gadgets',
      desc: 'Fast same-day repairs for cracked smartphone screens, genuine high-capacity battery replacements, logic-board micro-soldering, and certified diagnostics.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      tags: ['OLED Screens', 'TrueTone Transfer', 'Battery Health 100%', 'Board Micro-Soldering', 'Charging Ports'],
      image: '/images/services/nigerian_specialist_salamah.jpg',
      alt: 'Phone technician repairing smartphone in display lab',
      artisanName: 'Garba Danbatta',
      artisanTitle: 'Display & Board Specialist',
      artisanRating: '4.92 ★ (64 reviews)',
      icon: 'basket',
    },
    {
      id: 'ac-cooling',
      slug: 'ac-cooling',
      title: 'AC & Climate Control',
      desc: 'Precision air conditioning servicing, eco-friendly refrigerant top-ups, commercial compressor overhauls, and deep antibacterial coil cleaning.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      tags: ['Refrigerant Top-up', 'Compressor Overhaul', 'Deep Coil Cleaning', 'Split Unit Mounting', 'Chiller Repair'],
      image: '/images/services/air_conditioner_repair_technician.jpg',
      alt: 'Technician servicing air conditioning cooling system',
      artisanName: 'Musa Bello',
      artisanTitle: 'HVAC & Cooling Engineer',
      artisanRating: '4.90 ★ (38 reviews)',
      icon: 'bottle',
    },
    {
      id: 'borehole-plumbing',
      slug: 'plumbing',
      title: 'Plumbing & Water Systems',
      desc: 'Vetted plumbers for emergency pipe leak repairs, borehole submersible pump pulling and servicing, overhead tank connections, and clean sanitary fittings.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      tags: ['Submersible Pumps', 'Pressure Control Valves', 'Pipe Leak Detection', 'Overhead Tanks', 'Clean Piping'],
      image: '/images/services/nigerian_plumber_jonah.jpg',
      alt: 'Plumbing specialist inspecting water piping',
      artisanName: 'Aliyu Sani',
      artisanTitle: 'Master Plumbing Technician',
      artisanRating: '4.88 ★ (42 reviews)',
      icon: 'crate',
    },
  ],
  workshop: [
    {
      id: 'auto-mechanic',
      slug: 'auto-mechanic',
      title: 'Automotive & Diagnostics',
      desc: 'Computerized vehicle OBD2 diagnostic scanning, ceramic brake service, suspension overhauls, routine oil changes, and expert engine repairs.',
      bg: 'bg-[#DBD5F9]',
      textColor: 'text-[#4C1D95]',
      tags: ['OBD2 Engine Scans', 'Ceramic Brake Pads', 'Suspension Bushings', 'Alternators', 'Transmission Check'],
      image: '/images/services/car_mechanic_repairing_engine.jpg',
      alt: 'Mechanic servicing car engine diagnostics in workshop',
      artisanName: 'Suleiman Yahaya',
      artisanTitle: 'Automotive Diagnostic Tech',
      artisanRating: '4.91 ★ (52 reviews)',
      icon: 'storefront',
    },
    {
      id: 'carpentry',
      slug: 'carpentry',
      title: 'Carpentry & Woodwork',
      desc: 'Master craftsmen for custom office cabinetry, solid hardwood wardrobes, precision door fittings, architectural woodwork, and bespoke furniture framing.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      tags: ['Custom Office Desks', 'Hardwood Wardrobes', 'Door Frame Fitting', 'Roof Trusses', 'Cabinet Joinery'],
      image: '/images/services/nigerian_carpenter_kabiru.jpg',
      alt: 'Carpenter working on wooden construction in Nigeria',
      artisanName: 'Kabiru Idris',
      artisanTitle: 'Master Furniture Joiner',
      artisanRating: '4.94 ★ (36 reviews)',
      icon: 'basket',
    },
    {
      id: 'computer-repair',
      slug: 'computer-repair',
      title: 'Computers & Hardware Labs',
      desc: 'Hardware bench repairs, NVMe SSD speed upgrades, screen replacements, thermal paste re-application, logic-board diagnostics, and clean OS restoration.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      tags: ['Thermal Paste Service', 'NVMe SSD Upgrades', 'Laptop Displays', 'BIOS Diagnostics', 'Data Recovery'],
      image: '/images/services/computer_repair_technician.jpg',
      alt: 'Technician repairing laptop motherboard in workshop',
      artisanName: 'Hamza Tech',
      artisanTitle: 'Computer Hardware Specialist',
      artisanRating: '4.89 ★ (31 reviews)',
      icon: 'bottle',
    },
    {
      id: 'painting',
      slug: 'painting',
      title: 'Painting & Surface Finishes',
      desc: 'Architectural interior and exterior painting, POP plastering, damp-proof waterproofing, decorative wall screeding, and clean post-job site cleanup.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      tags: ['POP Plastering', 'Damp Waterproofing', 'Satin Paint Coats', 'Decorative Screeding', 'Exterior Facades'],
      image: '/images/services/house_painter_painting_wall.jpg',
      alt: 'Painter applying smooth coat to interior wall',
      artisanName: 'Mustapha Nura',
      artisanTitle: 'Surface & Plaster Specialist',
      artisanRating: '4.93 ★ (45 reviews)',
      icon: 'crate',
    },
  ],
}

// Pixel-perfect SVG Emblems matching Explore Supported Trades.png (Storefront, Grocery Basket, Medicine Bottle & Pills, Produce Crate)
function renderAccordionTradeIcon(icon: string) {
  if (icon === 'storefront') {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
          <path d="M6 22H58V14C58 11.8 56.2 10 54 10H10C7.8 10 6 11.8 6 14V22Z" fill="#0C513F" />
          <rect x="10" y="22" width="44" height="32" rx="2" fill="#146A54" />
          <rect x="24" y="28" width="16" height="26" rx="2" fill="#FFFFFF" />
          <line x1="32" y1="28" x2="32" y2="54" stroke="#0C513F" strokeWidth="2" />
          <circle cx="28" cy="42" r="1.5" fill="#0C513F" />
          <circle cx="36" cy="42" r="1.5" fill="#0C513F" />
          <path d="M30 4L34 4L31 10L35 10L28 18L30 11L26 11Z" fill="#F5A623" />
        </svg>
      </div>
    )
  }
  if (icon === 'basket') {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
          <rect x="18" y="16" width="8" height="16" rx="2" fill="#0C513F" />
          <rect x="28" y="12" width="7" height="20" rx="1.5" fill="#1D4ED8" />
          <rect x="37" y="14" width="9" height="18" rx="2" fill="#DC2626" />
          <rect x="42" y="20" width="7" height="12" rx="1" fill="#FFFFFF" />
          <path d="M32 8V26" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          <path d="M12 26L16 54C16.5 56.5 18.5 58 21 58H43C45.5 58 47.5 56.5 48 54L52 26H12Z" fill="#F5A623" />
          <line x1="20" y1="32" x2="22" y2="52" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="32" x2="29" y2="52" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="32" x2="35" y2="52" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="32" x2="42" y2="52" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }
  if (icon === 'bottle') {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="18" width="22" height="36" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M18 14H28V18H18V14Z" fill="#CBD5E1" />
          <circle cx="23" cy="36" r="7" fill="#60A5FA" />
          <path d="M23 32V40M19 36H27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="32" y="12" width="22" height="42" rx="5" fill="#0052CC" />
          <rect x="36" y="16" width="5" height="10" rx="2.5" fill="#93C5FD" transform="rotate(-30 36 16)" />
          <rect x="46" y="22" width="5" height="10" rx="2.5" fill="#93C5FD" transform="rotate(-30 46 22)" />
          <rect x="36" y="30" width="5" height="10" rx="2.5" fill="#93C5FD" transform="rotate(-30 36 30)" />
          <rect x="46" y="36" width="5" height="10" rx="2.5" fill="#93C5FD" transform="rotate(-30 46 36)" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
      <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
        <circle cx="22" cy="20" r="9" fill="#8B5A2B" />
        <ellipse cx="36" cy="20" rx="10" ry="8" fill="#FBBF24" />
        <path d="M46 14C46 14 52 22 48 28C44 30 40 26 42 20C44 14 46 14 46 14Z" fill="#F97316" />
        <rect x="8" y="24" width="48" height="8" rx="2" fill="#00C466" />
        <rect x="8" y="36" width="48" height="8" rx="2" fill="#00C466" />
        <rect x="8" y="48" width="48" height="8" rx="2" fill="#00C466" />
        <rect x="12" y="22" width="6" height="36" rx="1" fill="#067647" />
        <rect x="46" y="22" width="6" height="36" rx="1" fill="#067647" />
      </svg>
    </div>
  )
}

const FEATURED_PROVIDERS = [
  {
    id: 'p1',
    name: 'Ibrahim Aliyu',
    business: 'Aliyu Power & Solar Systems',
    trade: 'Master Electrician & Solar Installer',
    location: 'Kano / Lagos',
    rating: 4.99,
    reviews: 74,
    jobs: 118,
    verified: true,
    experience: '8 yrs exp',
    avatar: '/images/services/nigerian_electrician_ibrahim.jpg',
    recentJob: '30kVA Solar Hybrid Installation & Panel Rewiring',
    cardBg: 'bg-[#1E1B4B]',
    accentPill: 'bg-[#10B981] text-white',
  },
  {
    id: 'p2',
    name: 'Jonah Blessing',
    business: 'Apex Fluidics & Plumbing Works',
    trade: 'Certified Plumber & Pipe Maintenance Lead',
    location: 'Port Harcourt / Lagos',
    rating: 4.95,
    reviews: 64,
    jobs: 92,
    verified: true,
    experience: '7 yrs exp',
    avatar: '/images/services/nigerian_plumber_jonah.jpg',
    recentJob: 'Commercial Building Pressure Booster & Pipe Overhaul',
    cardBg: 'bg-[#0A1020]',
    accentPill: 'bg-[#4D78FF] text-white',
  },
  {
    id: 'p3',
    name: 'Kabiru Sani',
    business: 'Heritage Woodwork & Precision Joinery',
    trade: 'Master Carpenter & Architectural Joiner',
    location: 'Abuja / Kano',
    rating: 4.98,
    reviews: 82,
    jobs: 140,
    verified: true,
    experience: '10 yrs exp',
    avatar: '/images/services/nigerian_carpenter_kabiru.jpg',
    recentJob: 'Custom Office Cabinetry & Acoustical Timber Paneling',
    cardBg: 'bg-[#D97706]',
    accentPill: 'bg-[#0A1020] text-white',
  },
  {
    id: 'p4',
    name: 'Salamah Othman',
    business: 'MicroTech Hardware Diagnostics',
    trade: 'Device Diagnostics & Electronics Technician',
    location: 'Lagos, Nigeria',
    rating: 4.96,
    reviews: 58,
    jobs: 88,
    verified: true,
    experience: '6 yrs exp',
    avatar: '/images/services/nigerian_specialist_salamah.jpg',
    recentJob: 'Multi-Board Micro-soldering & Logic Diagnostic Repair',
    cardBg: 'bg-[#064E3B]',
    accentPill: 'bg-[#10B981] text-white',
  },
]

const WHO_CONNECTA_SERVES = [
  { title: 'Clients & Global Startups', color: 'bg-[#0A1020] text-white' },
  { title: 'Freelancers & Independent Pros', color: 'bg-[#2E1A47] text-white' },
  { title: 'Collabo Squads & Teams', color: 'bg-[#4D78FF] text-white' },
  { title: 'Technology & Programming', color: 'bg-[#10B981] text-white' },
  { title: 'Design & Creative Pros', color: 'bg-[#F59E0B] text-white' },
  { title: 'Marketing & Sales Experts', color: 'bg-[#0A1020] text-white' },
  { title: 'Business & Finance Talent', color: 'bg-[#8B7CFF] text-white' },
  { title: 'Writing & Translation', color: 'bg-[#10B981] text-white' },
  { title: 'Hospitality & Events Crews', color: 'bg-[#F59E0B] text-white' },
  { title: 'Health & Fitness Coaches', color: 'bg-[#4D78FF] text-white' },
  { title: 'Education & Training Tutors', color: 'bg-[#2E1A47] text-white' },
  { title: 'Remote & Onsite Talent', color: 'bg-[#064E3B] text-white' },
]

const TRUST_GUARANTEES = [
  { title: '100% Escrow Milestone Protection', color: 'bg-[#10B981] text-white' },
  { title: 'Identity Verification Badges', color: 'bg-[#2E1A47] text-white' },
  { title: 'Fair Human Dispute Resolution', color: 'bg-[#0A1020] text-white' },
  { title: 'Two-Way Verified Ratings', color: 'bg-[#F59E0B] text-white' },
  { title: 'Direct Local Bank & Mobile Payouts', color: 'bg-[#4D78FF] text-white' },
  { title: 'Collabo Squad Shared Workspaces', color: 'bg-[#064E3B] text-white' },
  { title: '<1s AI Fit-Ranked Recommendations', color: 'bg-[#8B7CFF] text-white' },
  { title: 'Zero Hidden Subscription Fees', color: 'bg-[#10B981] text-white' },
  { title: 'Evidence-Based Milestone Sign-off', color: 'bg-[#D97706] text-white' },
]

const PROVIDER_BENEFITS = [
  { title: 'Free to Join · Zero Subscriptions', color: 'bg-[#10B981] text-white' },
  { title: 'Escrow-Secured Payments Before You Start', color: 'bg-[#4D78FF] text-white' },
  { title: 'Instant Local Bank & Wallet Payouts', color: 'bg-[#F59E0B] text-white' },
  { title: 'Official Identity Verified Badge', color: 'bg-[#2E1A47] text-white' },
  { title: 'AI-Ranked Discovery & Matches', color: 'bg-[#0A1020] text-white' },
  { title: 'Collabo Squads with Automatic Splits', color: 'bg-[#064E3B] text-white' },
  { title: 'Shared Workspaces & Real-Time Chat', color: 'bg-[#8B7CFF] text-white' },
]

const THREE_STAGES = [
  {
    number: '01',
    title: 'Describe The Work',
    desc: 'Post a project or tell Connecta AI what you need in plain words. Specify milestones, deliverables, requirements, and budget without complicated forms.',
    cardBg: 'bg-[#1E1B4B]',
    accentColor: '#10B981',
    footerMeta: 'Plain English Brief · AI Prompt Engine',
    icon: Search,
  },
  {
    number: '02',
    title: 'Get Matched & Fund Escrow',
    desc: 'AI surfaces the best-fit freelancers or Collabo Squads ranked by real fit in seconds. Fund milestones up front so talent starts knowing money is secured.',
    cardBg: 'bg-[#10B981]',
    accentColor: '#FFFFFF',
    footerMeta: 'Transparent Fit Score · Escrow Vault',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Collaborate, Approve & Release',
    desc: 'Work in a shared project workspace with real-time chat, file sharing, and task tracking. Review deliverables, release escrow, and cash out to local accounts.',
    cardBg: 'bg-[#0A1020]',
    accentColor: '#4D78FF',
    footerMeta: 'Instant Local Payouts · 2-Way Reviews',
    icon: BadgeCheck,
  },
]

const REVIEWS = [
  {
    quote:
      'We needed commercial solar inverters installed and custom boardroom cabinetry built. Through Connecta, we matched with a verified master electrician and certified carpenter within hours. The escrow release gave us total confidence.',
    author: 'Zainab Adeyemi',
    neighborhood: 'Managing Director, Marula & Co · Lagos, Nigeria',
    cardBg: 'bg-[#1E1B4B]',
    rating: 5,
  },
  {
    quote:
      'Whether you need a licensed plumber for your residence or a software engineer for your startup, Connecta brings genuine verified talent with milestone protection and instant local withdrawals.',
    author: 'Kwame Ochieng',
    neighborhood: 'Senior Tech Consultant · Nairobi / Lagos',
    cardBg: 'bg-[#0A1020]',
    rating: 5,
  },
  {
    quote:
      'Finding verified diagnostic technicians and skilled developers used to take weeks of guesswork. Connecta verified professionals delivered the job on time, with payment released only after thorough inspection.',
    author: 'Amina Diallo',
    neighborhood: 'Operations Director, Sahel Logistics · Dakar, Senegal',
    cardBg: 'bg-[#D97706]',
    rating: 5,
  },
]

const FAQS = [
  {
    q: 'How do I create an account?',
    a: 'Download the Connecta app or sign up on the web, then choose your account type: client, specialist, or both. Creating an account is free and takes under a minute.',
  },
  {
    q: 'Is Connecta only for digital tech professionals?',
    a: "Not at all. Connecta covers essential skilled trades like plumbing, electrical and solar installations, AC repair, carpentry and auto mechanics, alongside digital fields like software engineering, design, marketing and finance. Whether you need an experienced plumber or a full-stack engineer, Connecta has verified professionals ready.",
  },
  {
    q: 'How does identity verification work?',
    a: "You will be guided through a quick verification step that confirms your government-issued identity. Once approved, you earn a verification badge that appears on your profile and builds instant trust with clients.",
  },
  {
    q: 'How does escrow protect my payment?',
    a: 'Clients fund milestones up front. The money is held securely and released to the specialist only when the client approves the completed work. Nobody chases invoices, and nobody works unprotected.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Payments release the moment a milestone is approved, landing directly in your Connecta wallet. From there you can cash out straight to local bank accounts across Africa where available.',
  },
  {
    q: 'What happens if a project goes wrong?',
    a: "Every project has a clear resolution process. You can open a dispute with evidence, and our trust and safety team reviews it fairly. Funds stay protected in escrow until the dispute is resolved.",
  },
  {
    q: 'What are Collabo Squads?',
    a: 'A Collabo Squad is a team of specialists who combine complementary skills into one profile, tackle projects too big for one person, and get paid as a team with automatic, fair splits.',
  },
  {
    q: 'Where can I download the app?',
    a: 'The Connecta app is available on the App Store and Google Play for iOS and Android, with smart matching, real-time chat, and an escrow wallet built in.',
  },
]

const SEARCH_SUGGESTIONS = [
  { query: 'Plumbing & Emergency Pipe Repairs', category: 'Plumbing & Cooling' },
  { query: 'Solar Inverter & Electrical Installation', category: 'Electrical & Power' },
  { query: 'Custom Woodwork & Furniture Joinery', category: 'Carpentry & Home' },
  { query: 'Phone, Tablet & Laptop Hardware Diagnostics', category: 'Devices & Gadgets' },
  { query: 'React & Mobile App Developer', category: 'Technology & Programming' },
  { query: 'Brand Identity & UI/UX Designer', category: 'Design & Creative' },
  { query: 'Social Media & Growth Marketer', category: 'Marketing & Sales' },
  { query: 'Auto Diagnostics & Engine Mechanic', category: 'Auto & Mobility' },
  { query: 'Financial Modeling & Bookkeeper', category: 'Business & Finance' },
  { query: 'Collabo Squad for Brand & Office Launch', category: 'Collabo Squads' },
  { query: 'Full-Stack Node.js Engineer', category: 'Technology & Programming' },
  { query: 'Motion Graphics & Video Animator', category: 'Design & Creative' },
]

interface PopularCardItem {
  name: string
  iconColor: string
  iconType: 'starburst' | 'dome' | 'sparkle' | 'arch' | 'diamond' | 'flower' | 'crystal' | 'circle'
}

const POPULAR_CARDS: PopularCardItem[] = [
  { name: 'Web Design', iconColor: '#FFC406', iconType: 'starburst' },
  { name: 'UI/UX Design', iconColor: '#FF874E', iconType: 'dome' },
  { name: 'Solar & Inverter', iconColor: '#09C17E', iconType: 'sparkle' },
  { name: 'Frontend React', iconColor: '#FFB2CD', iconType: 'arch' },
  { name: 'Plumbing', iconColor: '#38BDF8', iconType: 'diamond' },
  { name: 'Brand Identity', iconColor: '#A855F7', iconType: 'flower' },
  { name: 'AC Servicing', iconColor: '#2DD4BF', iconType: 'crystal' },
  { name: 'Auto Mechanic', iconColor: '#F59E0B', iconType: 'circle' },
]

function PopularCardIcon({ type, color }: { type: PopularCardItem['iconType']; color: string }) {
  switch (type) {
    case 'starburst':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M12 2l1.7 2.7 3.2-.8.7 3.1 3 1.3-.9 3.1 2.3 2.2-2.3 2.2.9 3.1-3 1.3-.7 3.1-3.2-.8L12 22l-1.7-2.7-3.2.8-.7-3.1-3-1.3.9-3.1L2 12.6l2.3-2.2-.9-3.1 3-1.3.7-3.1 3.2.8z" />
        </svg>
      )
    case 'dome':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M3 17a9 9 0 0 1 18 0H3z" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
        </svg>
      )
    case 'arch':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M4 17a8 8 0 0 1 16 0H4z" />
        </svg>
      )
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M12 2.5L21 12 12 21.5 3 12z" />
        </svg>
      )
    case 'flower':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9zm0 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
        </svg>
      )
    case 'crystal':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <path d="M12 4C6.5 4 2 12 2 12s4.5 8 10 8 10-8 10-8-4.5-8-10-8zm0 13c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ fill: color }}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
    default:
      return null
  }
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [selectedTradeTab, setSelectedTradeTab] = useState('all')
  const [tradeCategoryGroup, setTradeCategoryGroup] = useState<'metro' | 'workshop'>('metro')
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(0)
  const [isAccordionPaused, setIsAccordionPaused] = useState<boolean>(false)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleVideoSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsVideoMuted(videoRef.current.muted)
    }
  }

  const filteredCategories =
    selectedTradeTab === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.group === selectedTradeTab)

  // Real-time suggestions (Google Search style)
  const suggestions = searchQuery.trim()
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.query.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : SEARCH_SUGGESTIONS.slice(0, 5)

  const showSuggestions = isSearchFocused && suggestions.length > 0

  // Click outside to close Google-style suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSuggestion = (query: string) => {
    setSearchQuery(query)
    setIsSearchFocused(false)
    router.push(`/requests/new?q=${encodeURIComponent(query)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        router.push(`/requests/new?q=${encodeURIComponent(searchQuery)}`)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex].query)
      } else {
        router.push(`/requests/new?q=${encodeURIComponent(searchQuery)}`)
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#0A1020] selection:bg-[#4D78FF] selection:text-white">
      {/* Schema.org Structured Data for Rich Search Snippets & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Connecta',
              url: 'https://myconnecta.ng',
              logo: 'https://myconnecta.ng/brand/connecta-header-icon.svg',
              description:
                "Connecting businesses and households with verified African tradespeople and digital professionals, backed by smart matchmaking and milestone escrow security.",
              sameAs: [
                'https://x.com/Connectainc',
                'https://www.facebook.com/profile.php?id=61587476974482',
                'https://www.instagram.com/connecta_inc',
                'https://www.tiktok.com/@connecta_inc',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Connecta',
              url: 'https://myconnecta.ng',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://myconnecta.ng/requests/new?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a,
                },
              })),
            },
          ]),
        }}
      />

      {/* Unified Professional Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none">
        <header
          className={`pointer-events-auto max-w-6xl mx-auto flex items-center justify-between gap-4 transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_30px_rgb(0,0,0,0.08)]'
              : 'bg-white/85 backdrop-blur-md border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* Left: Brand Logo & Minimal Region */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <div className="relative w-4.5 h-4.5">
                  <Image
                    src="/brand/connecta-header-icon.svg"
                    alt="Connecta Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0A1020]">
                connecta
              </span>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden xs:block" />

            <div className="hidden xs:flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 rounded-full hover:bg-slate-100/70">
              <span className="text-sm leading-none">🇳🇬</span>
              <span className="font-extrabold text-slate-800">NG</span>
              <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2.5]" />
            </div>
          </div>

          {/* Center Navigation: Clean, borderless links with subtle hover pills */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold text-slate-600">
            <Link
              href="/discover"
              className="px-3.5 py-1.5 rounded-full text-emerald-800 font-extrabold hover:bg-emerald-50 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Discover</span>
            </Link>
            <Link
              href="#about"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              About
            </Link>
            <Link
              href="#featured-specialists"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              Specialists
            </Link>
            <Link
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              How It Works
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full text-[#0C513F] font-bold hover:bg-emerald-50 transition-all"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0A1020] px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/onboarding?step=role"
              className="inline-flex items-center text-xs sm:text-sm font-bold text-[#0A1020] bg-slate-100 hover:bg-slate-200 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors shadow-xs"
            >
              Register
            </Link>

            <Link
              href="/onboarding?step=role&role=provider"
              className="hidden md:inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0C513F] px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors"
            >
              Join as Pro
            </Link>

            <Link
              href="/requests/new"
              className="bg-[#0C513F] hover:bg-[#083b2e] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm hover:shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <span>Post Request</span>
              <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="pointer-events-auto md:hidden mt-2 max-w-sm mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            <Link
              href="/discover"
              onClick={() => setMobileNavOpen(false)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Discover Specialists</span>
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 hover:text-[#0C513F] transition-colors"
            >
              About
            </Link>
            <Link
              href="#featured-specialists"
              onClick={() => setMobileNavOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 hover:text-[#0C513F] transition-colors"
            >
              Specialists
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileNavOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 hover:text-[#0C513F] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-[#0C513F] font-bold transition-colors"
            >
              Dashboard
            </Link>
            <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/onboarding?step=role"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-bold text-white bg-[#0A1020] hover:bg-[#4D78FF] text-xs transition-colors shadow-xs"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/onboarding?step=role&role=provider"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs transition-colors"
              >
                Join as Pro
              </Link>
              <Link
                href="/requests/new"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-bold text-white bg-[#0C513F] hover:bg-[#083b2e] text-xs transition-colors"
              >
                Post Service Request
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-clip">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[85vh] sm:min-h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#F5F7FC]"
        >
          {/* Layer 1: Connecta Signature Halftone Dot Matrix Pattern (Full Visibility, No Opacity) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0A2614 2px, transparent 2px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Layer 2: Concentric AI Matchmaking & Collabo Squad Orbital Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            {/* Outer Ring */}
            <div className="w-[840px] sm:w-[980px] h-[840px] sm:h-[980px] rounded-full border border-slate-900/[0.035] flex items-center justify-center">
              {/* Mid Ring (Dashed AI Matching Radius) */}
              <div className="w-[620px] sm:w-[720px] h-[620px] sm:h-[720px] rounded-full border border-dashed border-emerald-500/[0.08] flex items-center justify-center relative">
                {/* Orbiting Talent Node Marker (Amber) */}
                <div className="absolute top-10 right-28 w-2 h-2 rounded-full bg-[#F59E0B]/50 shadow-sm" />
                {/* Inner Ring */}
                <div className="w-[420px] sm:w-[480px] h-[420px] sm:h-[480px] rounded-full border border-slate-900/[0.04] relative">
                  {/* Orbiting Talent Node Marker (Emerald) */}
                  <div className="absolute bottom-12 left-16 w-2.5 h-2.5 rounded-full bg-[#10B981]/50 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Tri-Color Brand Aurora Glows (Azure Blue, Emerald Green, Golden Amber) */}
          <div className="absolute -top-16 left-1/4 -translate-x-1/2 w-[380px] sm:w-[500px] h-[280px] sm:h-[350px] bg-[#1A73E8]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 translate-x-1/3 w-[400px] sm:w-[520px] h-[300px] sm:h-[380px] bg-[#10B981]/12 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[440px] sm:w-[600px] h-[220px] sm:h-[280px] bg-[#F59E0B]/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Layer 4: Floor Transition Vignette towards Ticker Band */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#145241]/10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center justify-center my-auto">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
              {/* Hero Heading Styled with Connecta Brand Colors */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#0A1020] leading-[1.12] sm:leading-[1.08]">
                African talent, woven into{' '}
                <span className="bg-gradient-to-r from-[#1A73E8] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent font-black">
                  high-impact Collabo Squads
                </span>
              </h1>

              {/* Search Capsule with Real-time Suggestions Dropdown */}
              <div ref={searchContainerRef} className="pt-1 sm:pt-2 max-w-3xl mx-auto relative z-40 w-full">
                <div
                  className={`bg-white transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-slate-900/10 focus-within:border-[#10B981] focus-within:ring-4 focus-within:ring-[#10B981]/15 p-1.5 sm:p-2 pl-3 sm:pl-4 flex items-center gap-2 sm:gap-3 ${
                    showSuggestions
                      ? 'rounded-t-[28px] rounded-b-none border-b-transparent shadow-2xl'
                      : 'rounded-full'
                  }`}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[#0A2614] border border-slate-200/80 shadow-xs">
                      <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    </div>
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setIsSearchFocused(true)
                        setActiveSuggestionIndex(-1)
                      }}
                      onFocus={() => setIsSearchFocused(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe what you need (e.g. Plumber in Lagos, Solar Installer, UI/UX Designer, React Dev)..."
                      className="w-full bg-transparent text-xs sm:text-sm md:text-base text-[#0A1020] font-medium placeholder:text-slate-400 focus:outline-none truncate"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          setActiveSuggestionIndex(-1)
                        }}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <Link
                    href={`/requests/new?q=${encodeURIComponent(searchQuery)}`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] px-4 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md group"
                  >
                    <span>Find Talent</span>
                    <span className="text-[#F5A623] group-hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                      </svg>
                    </span>
                  </Link>
                </div>

                {/* Google Search Style Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-b-[28px] shadow-2xl border border-t-0 border-slate-200/90 overflow-hidden text-left z-50">
                    <div className="border-t border-slate-100" />
                    <div className="py-2">
                      {!searchQuery.trim() && (
                        <div className="px-5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                          <span>Trending Searches in Nigeria</span>
                        </div>
                      )}
                      {suggestions.map((item, idx) => {
                        const isSelected = activeSuggestionIndex === idx
                        return (
                          <div
                            key={item.query}
                            onMouseDown={() => handleSelectSuggestion(item.query)}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                            className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-slate-100/90 text-[#4D78FF]'
                                : 'hover:bg-slate-50 text-[#0A1020]'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <Search
                                className={`w-4 h-4 shrink-0 ${
                                  isSelected ? 'text-[#4D78FF]' : 'text-slate-400'
                                }`}
                              />
                              <span className="text-sm font-medium truncate">
                                {searchQuery.trim() ? (
                                  <>
                                    <span className="text-slate-900 font-normal">
                                      {item.query.slice(
                                        0,
                                        item.query
                                          .toLowerCase()
                                          .indexOf(searchQuery.trim().toLowerCase()) +
                                          searchQuery.trim().length
                                      )}
                                    </span>
                                    <span className="font-bold text-slate-900">
                                      {item.query.slice(
                                        item.query
                                          .toLowerCase()
                                          .indexOf(searchQuery.trim().toLowerCase()) +
                                          searchQuery.trim().length
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-slate-800">
                                    {item.query}
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                                {item.category}
                              </span>
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="px-5 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Click to search instantly</span>
                      <span className="font-bold text-slate-500">Connecta Search</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Real Verified Metrics from Connecta Old */}
              <ScrollReveal variant="fade-up">
                <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold">
                  {/* Card 1: Emerald Green */}
                  <div className="flex items-center gap-2 bg-[#10B981] text-white px-3.5 py-2 rounded-full shadow-md shadow-emerald-500/20 border border-white/20 hover:scale-105 transition-all cursor-default">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white tracking-tight">2,548+</span>
                      <span className="text-white/90 font-medium">Professionals Onboard</span>
                    </div>
                  </div>

                  {/* Card 2: Electric Azure Blue */}
                  <div className="flex items-center gap-2 bg-[#4D78FF] text-white px-3.5 py-2 rounded-full shadow-md shadow-blue-500/20 border border-white/20 hover:scale-105 transition-all cursor-default">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Globe className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white tracking-tight">2+</span>
                      <span className="text-white/90 font-medium">Countries Represented</span>
                    </div>
                  </div>

                  {/* Card 3: Deep Royal Purple */}
                  <div className="flex items-center gap-2 bg-[#2E1A47] text-white px-3.5 py-2 rounded-full shadow-md shadow-purple-950/25 border border-white/20 hover:scale-105 transition-all cursor-default">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white tracking-tight">100%</span>
                      <span className="text-white/90 font-medium">Escrow Protected</span>
                    </div>
                  </div>

                  {/* Card 4: Vibrant Golden Amber */}
                  <div className="flex items-center gap-2 bg-[#F59E0B] text-white px-3.5 py-2 rounded-full shadow-md shadow-amber-500/20 border border-white/20 hover:scale-105 transition-all cursor-default">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white tracking-tight">&lt;1s</span>
                      <span className="text-white/90 font-medium">Avg. AI Match Time</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* POPULAR SERVICES MOVING CARDS TICKER BAND (Matching cards.png)    */}
        {/* ================================================================= */}
        <section className="bg-[#145241] pt-4 pb-4 sm:pt-5 sm:pb-5 relative z-10 overflow-hidden">
          {/* Infinite scrolling track moving from right to left */}
          <div className="relative overflow-hidden group py-1">
            {/* Left & Right Smooth Edge Fade Masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#145241] via-[#145241]/90 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#145241] via-[#145241]/90 to-transparent z-10" />

            <div className="animate-marquee-left flex items-center gap-3.5 sm:gap-4.5 py-1">
              {[...POPULAR_CARDS, ...POPULAR_CARDS, ...POPULAR_CARDS, ...POPULAR_CARDS].map((item, idx) => (
                <Link
                  key={`${item.name}-${idx}`}
                  href={`/requests/new?q=${encodeURIComponent(item.name)}`}
                  className="shrink-0 bg-[#246251] hover:bg-[#2C7561] text-white border border-emerald-400/25 hover:border-emerald-300/80 rounded-full h-[46px] sm:h-[50px] px-5 sm:px-6 flex items-center gap-3 sm:gap-3.5 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                >
                  <div className="shrink-0 flex items-center justify-center">
                    <PopularCardIcon type={item.iconType} color={item.iconColor} />
                  </div>
                  <span className="font-bold text-white text-sm sm:text-[15px] tracking-tight whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Organic Scalloped Edge Divider from section-broder.png into About Section */}
        <div className="w-full overflow-hidden leading-none -mt-px relative z-20 pointer-events-none select-none bg-[#F5F7FC]">
          <SectionBorderDivider color="#145241" className="block w-full" />
        </div>

        {/* ================================================================= */}
        {/* ABOUT (VISION AND MISSION & PHILOSOPHY SECTION)                   */}
        {/* ================================================================= */}
        <section id="about" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
          <span id="vision-mission" className="sr-only" />
          {/* Halftone / Dot pattern from image */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal variant="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#0A2614] tracking-tight">
                  Vision &amp; Mission
                </h2>
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600">
                What we believe and what we&apos;re building across Africa.
              </p>
            </div>
            </ScrollReveal>

            {/* Distinct Cards with Angled Arrows (Exact Match from Root Image) */}
            <ScrollReveal variant="fade-up" delay={80}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Vision Card (Amber / Gold from image) */}
              <div className="bg-[#E67E00] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      Vision<br />Statement
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95">
                    A single place where anyone can find work or hire talent across any field, with the trust rails of identity verification, genuine reviews, and milestone escrow that make continent-wide and cross-border work actually work. Opportunity should follow skill, not postcode.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Connecta Ecosystem</span>
                  <span>Pan-African Talent</span>
                </div>
              </div>

              {/* Mission Card (Deep Royal Indigo / Navy from image) */}
              <div className="bg-[#2E1A47] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      Mission<br />Statement
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95">
                    Connecta began with a simple conviction: talent is everywhere on the continent, but access to good work is not. We are closing that gap across both essential skilled trades and modern digital careers, empowering African professionals and global clients with smart discovery and protected payments.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Built for Clients &amp; Freelancers</span>
                  <span>100% Escrow Secured</span>
                </div>
              </div>
            </div>
            </ScrollReveal>

            {/* Core Objectives (Exact Cards from core objectives.png) */}
            <ScrollReveal variant="fade-up" delay={120}>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#D97706] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Continent-Wide Reach:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Talent from every region of Africa, working locally in your neighborhood or internationally online, bridging skilled professionals directly with clients worldwide.
                </p>
              </div>

              <div className="bg-[#10B981] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Every Sector Covered:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Essential physical trades and digital fields: plumbing, electrical, carpentry, auto care, software, design, marketing, finance, and events.
                </p>
              </div>

              <div className="bg-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Built on Real Trust:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Verified identities, honest two-way reviews, and escrow-protected payments on every milestone so strangers work together safely.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

        {/* ================================================================= */}
        {/* WHO CONNECTA SERVES (EXACT LAYOUT FROM who to expect full section) */}
        {/* ================================================================= */}
        <section id="who-connecta-serves" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal variant="scale-up" duration={750}>
              <div className="bg-[#0A2614] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 relative shadow-2xl overflow-hidden">
                {/* Halftone / Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-3xl overflow-hidden"
                  style={{
                    backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />

                <div className="relative z-10 max-w-3xl space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                      ↓
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                      Who Connecta Serves
                    </h2>
                  </div>
                  <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100/90 max-w-2xl">
                    Whether you are hiring qualified tradespeople for your property, contracting digital talent for your company, or forming a multi-skilled Collabo Squad to take on bigger briefs, Connecta is built for the way you work.
                  </p>
                </div>

                {/* Colorful Pill Grid (Exact Match from Root Image) */}
                <div className="mt-10 flex flex-wrap gap-3 relative z-10">
                  {WHO_CONNECTA_SERVES.map((pill, idx) => (
                    <span
                      key={idx}
                      className={`${pill.color} text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-md transition-transform hover:scale-105 cursor-default`}
                    >
                      {pill.title}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ================================================================= */}
        {/* BRAND CHARACTER & TOOLKIT SHOWCASE (ADAPTED TO VISION/MISSION)     */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20 space-y-4">
              <div className="flex items-center gap-3.5 sm:gap-4.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-[2.5px] border-[#0A1020] flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 shadow-sm text-[#0A1020]">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#0A1020] leading-[1.08]">
                  Built for Modern Work
                </h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-slate-600 max-w-2xl pl-0 sm:pl-16">
                Connecting skilled trades and digital professionals across Africa through intelligent matching, verified trust, and collaborative squads.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Electric Azure / Indigo - Across Every Sector */}
            <div className="bg-[#1E1B4B] text-white rounded-3xl overflow-hidden shadow-xl border border-white/10 flex flex-col hover:shadow-2xl transition-all duration-300">
              {/* Simple Clean Graphic */}
              <div className="h-56 sm:h-64 w-full bg-gradient-to-b from-white/10 via-transparent to-transparent flex items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#10B981]/25 border border-[#10B981]/50 flex items-center justify-center text-[#34D399] -mr-4 shadow-xl backdrop-blur-xs">
                    <Wrench className="w-9 h-9" />
                  </div>
                  <div className="w-24 h-24 rounded-full bg-[#4D78FF]/25 border border-[#4D78FF]/50 flex items-center justify-center text-[#93C5FD] -ml-4 shadow-xl backdrop-blur-xs">
                    <Laptop className="w-9 h-9" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-7 sm:p-9 space-y-3 flex-1 flex flex-col justify-start">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Across Every Sector
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Connecta brings together both hands-on trades and digital careers. From plumbing, electrical and auto care to software engineering, design, marketing and finance, talent across every trade finds work and gets hired.
                </p>
              </div>
            </div>

            {/* Card 2: Warm Amber / Gold - AI Matchmaking */}
            <div className="bg-[#B45309] text-white rounded-3xl overflow-hidden shadow-xl border border-white/10 flex flex-col hover:shadow-2xl transition-all duration-300">
              {/* Simple Clean Graphic */}
              <div className="h-56 sm:h-64 w-full bg-gradient-to-b from-white/10 via-transparent to-transparent flex items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full border border-amber-300/20 absolute" />
                  <div className="w-32 h-32 rounded-full border border-amber-300/35 absolute" />
                  <div className="w-20 h-20 rounded-full bg-amber-400/25 border border-amber-300/60 flex items-center justify-center shadow-xl backdrop-blur-xs">
                    <Sparkles className="w-9 h-9 text-amber-200" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-7 sm:p-9 space-y-3 flex-1 flex flex-col justify-start">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Meet Your Match in Seconds
                </h3>
                <p className="text-sm sm:text-base text-amber-50 leading-relaxed font-normal">
                  Tell Connecta what the project needs in plain words. The matching engine studies skills, experience, ratings, availability, and budget to surface fit-ranked recommendations in &lt;1s.
                </p>
              </div>
            </div>

            {/* Card 3: Deep Forest / Emerald - Collabo Squads */}
            <div className="bg-[#0A2614] text-white rounded-3xl overflow-hidden shadow-xl border border-white/10 flex flex-col hover:shadow-2xl transition-all duration-300">
              {/* Simple Clean Graphic */}
              <div className="h-56 sm:h-64 w-full bg-gradient-to-b from-white/10 via-transparent to-transparent flex items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border border-emerald-400/20 absolute" />
                  <div className="w-20 h-20 rounded-full bg-emerald-500/25 border border-emerald-400/60 flex items-center justify-center shadow-xl backdrop-blur-xs">
                    <Users className="w-9 h-9 text-emerald-300" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-7 sm:p-9 space-y-3 flex-1 flex flex-col justify-start">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Great Work Isn&apos;t Solo
                </h3>
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
                  Form a Collabo Squad, combine your skills into one shared profile, and take on briefs too big for one person. Shared workspaces, role tracking, and automatic fair payment splits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PLATFORM FEATURES (EXACT POST-IT MASKING TAPE LAYOUT FROM IMAGE)  */}
        {/* ================================================================= */}
        <section id="features" className="py-16 sm:py-24 lg:py-32 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
          {/* Halftone / Dot pattern from program feature.png */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Circle Down Arrow */}
            <div className="flex items-center gap-3.5 mb-16 sm:mb-20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-[2.5px] border-[#00C466] text-[#00C466] flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#0A2614] tracking-tight">
                Platform Features
              </h2>
            </div>

            {/* Staggered Zig-Zag Cards with Masking Tape and Dog-Ear Curl */}
            <div className="space-y-8 sm:space-y-0 relative pb-6">
              {/* Card 1: Describe The Service You Want (Top Left - Emerald Green) */}
              <div className="w-full md:w-[70%] mr-auto relative z-10 transition-transform hover:-translate-y-1 duration-300">
                {/* Masking Tape on Top */}
                <div
                  className="absolute -top-3.5 left-1/3 sm:left-1/4 w-28 sm:w-36 h-7 sm:h-8 bg-[#D99026]/85 backdrop-blur-xs rounded-xs shadow-xs z-30 pointer-events-none transform -rotate-1"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.18)' }}
                />

                <div className="bg-[#00C466] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-left */}
                  <div className="absolute -bottom-3 left-0 w-8 sm:w-10 h-3 bg-[#008044] rounded-bl-sm transform origin-top-left -skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Describe The Work You Need
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (No Guesswork) Post a project or tell Connecta AI what you need in plain words. Specify deliverables, milestones, and budget without complicated forms.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/requests/new"
                        className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-[#0A2614] hover:bg-slate-100 px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-sm"
                      >
                        <span>Describe Your Project</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Find The Nearest (Middle Right - Deep Royal Purple) */}
              <div className="w-full md:w-[68%] ml-auto md:-mt-8 relative z-20 transition-transform hover:-translate-y-1 duration-300">
                {/* Masking Tape on Top */}
                <div
                  className="absolute -top-3.5 right-1/4 sm:right-1/3 w-28 sm:w-36 h-7 sm:h-8 bg-[#D99026]/85 backdrop-blur-xs rounded-xs shadow-xs z-30 pointer-events-none transform rotate-1"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.18)' }}
                />

                <div className="bg-[#3D2F6B] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-right */}
                  <div className="absolute -bottom-3 right-0 w-8 sm:w-10 h-3 bg-[#241A45] rounded-br-sm transform origin-top-right skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Connecta AI Matching in Seconds
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (&lt;1s Match Time) No endless scrolling through profiles. The matching engine studies skills, experience, ratings, availability, and budget to surface talent that actually fits.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/requests/new"
                        className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-[#3D2F6B] hover:bg-slate-100 px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-sm"
                      >
                        <span>Find Instant Match</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Multi-Tier Verification System (Lower Left - Deep Midnight Navy) */}
              <div className="w-full md:w-[70%] mr-auto md:-mt-8 relative z-30 transition-transform hover:-translate-y-1 duration-300">
                {/* Masking Tape on Top */}
                <div
                  className="absolute -top-3.5 left-1/4 sm:left-1/3 w-28 sm:w-36 h-7 sm:h-8 bg-[#D99026]/85 backdrop-blur-xs rounded-xs shadow-xs z-30 pointer-events-none transform -rotate-1"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.18)' }}
                />

                <div className="bg-[#0B132B] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-left */}
                  <div className="absolute -bottom-3 left-0 w-8 sm:w-10 h-3 bg-[#050A17] rounded-bl-sm transform origin-top-left -skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Identity Verification &amp; Trust Badges
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (Verified Profiles) Every profile undergoes government identity checks and verification badges. Clients hire with complete confidence, and verified talent stands out.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/onboarding?step=role&role=provider"
                        className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-[#0B132B] hover:bg-slate-100 px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-sm"
                      >
                        <span>Get Verified Badge</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Secure Escrow (Bottom Right - Deep Forest Green) */}
              <div className="w-full md:w-[68%] ml-auto md:-mt-8 relative z-40 transition-transform hover:-translate-y-1 duration-300">
                {/* Masking Tape on Top */}
                <div
                  className="absolute -top-3.5 right-1/3 w-28 sm:w-36 h-7 sm:h-8 bg-[#D99026]/85 backdrop-blur-xs rounded-xs shadow-xs z-30 pointer-events-none transform rotate-1"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.18)' }}
                />

                <div className="bg-[#063B23] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-right */}
                  <div className="absolute -bottom-3 right-0 w-8 sm:w-10 h-3 bg-[#032113] rounded-br-sm transform origin-top-right skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Protected Escrow &amp; Local Payouts
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (100% Milestones Protected) Clients fund milestones up front; talent sees money is secured before starting. Funds release only on approval, with instant cash-out to local payout methods.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/onboarding?step=role"
                        className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-[#063B23] hover:bg-slate-100 px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-sm"
                      >
                        <span>Join Protected Escrow</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SUPPORTED SERVICE TRADES (TOP-TO-BOTTOM CARD STACK)               */}
        {/* Responsive Up-To-Down Layout without redundant badge labels       */}
        {/* ================================================================= */}
        <section id="services" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-6 pb-6 border-b border-slate-200/80">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                    ↓
                  </div>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A2614] leading-[1.1]">
                    Explore Supported Trades
                  </h2>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-slate-600 max-w-2xl">
                  Whatever your trade, there is work for it here. Connecta supports both hands-on trades like plumbing, electrical and carpentry, and digital professions like programming and brand design. Talent across every sector gets hired safely.
                </p>
              </div>

              {/* Category Pillar Switcher: Perfectly Fitted and Aligned */}
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200/90 shadow-xs self-start lg:self-auto max-w-full">
                <button
                  type="button"
                  onClick={() => {
                    setTradeCategoryGroup('metro')
                    setActiveAccordionIndex(0)
                  }}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    tradeCategoryGroup === 'metro'
                      ? 'bg-[#0A1020] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Metropolitan Repairs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTradeCategoryGroup('workshop')
                    setActiveAccordionIndex(0)
                  }}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    tradeCategoryGroup === 'workshop'
                      ? 'bg-[#0A1020] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Workshop & Vehicles
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Up-to-Down Vertical Stack of Cards (100% Mobile & Desktop Responsive) */}
          <ScrollReveal variant="fade-up" delay={80}>
            <div className="flex flex-col gap-4 sm:gap-5 w-full">
              {TRADE_ACCORDION_ITEMS[tradeCategoryGroup].map((item, idx) => {
                const isActive = activeAccordionIndex === idx
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveAccordionIndex(isActive ? -1 : idx)
                    }}
                    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-black/90 cursor-pointer select-none transition-all duration-300 ${item.bg} ${
                      isActive
                        ? 'shadow-xl'
                        : 'shadow-sm hover:shadow-md hover:brightness-[0.98]'
                    }`}
                  >
                    {/* Header Row: Trade Emblem + Title + Toggle Arrow */}
                    <div className="p-4 sm:p-6 lg:p-7 flex items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                        <div className="p-1 shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/70 border border-black/10 flex items-center justify-center shadow-2xs">
                          {renderAccordionTradeIcon(item.icon)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                            {item.title}
                          </h3>

                          {!isActive && (
                            <p className="text-xs sm:text-sm text-slate-700/80 font-medium truncate max-w-xl sm:max-w-2xl mt-0.5 sm:mt-1">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center shrink-0">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 ${
                            isActive ? 'rotate-180 bg-black text-white' : 'bg-white text-black'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>

                    {/* Smooth Animated Downward Expansion (Up to Down Flow) */}
                    <div
                      className={`grid transition-all duration-400 ease-in-out ${
                        isActive
                          ? 'grid-rows-[1fr] opacity-100 pb-5 sm:pb-7 px-4 sm:px-7 lg:px-9'
                          : 'grid-rows-[0fr] opacity-0 pb-0 px-4 sm:px-7 lg:px-9 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4 pb-2 border-t border-black/10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                          {/* Left Column: Description, Specialty Tags & CTA */}
                          <div className="lg:col-span-8 space-y-4">
                            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed max-w-2xl antialiased">
                              {item.desc}
                            </p>

                            {/* Sub-Specialty Tags */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-black/10 text-slate-800 shadow-2xs tracking-tight"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Action CTA & Escrow Guarantee */}
                            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                              <Link
                                href={`/requests/new?category=${item.slug}`}
                                className="bg-[#0A1020] hover:bg-black text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
                              >
                                <span>Book {item.title}</span>
                                <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                              </Link>

                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span>Verified Kobo Escrow Protection</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Vetted Artisan Card */}
                          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end">
                            <div className="flex items-center gap-3.5 bg-black/85 text-white p-3 sm:p-4 rounded-2xl border border-white/20 shadow-xl max-w-xs w-full">
                              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/20">
                                <Image
                                  src={item.image}
                                  alt={item.alt}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold flex items-center gap-1.5 text-sm">
                                  <span className="truncate">{item.artisanName}</span>
                                  <BadgeCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                                </div>
                                <div className="text-xs text-white/90 font-medium truncate">{item.artisanTitle}</div>
                                <div className="text-[11px] text-amber-300 font-bold mt-0.5">{item.artisanRating}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </section>

        {/* ================================================================= */}
        {/* FEATURED VERIFIED SPECIALISTS (CHOWDECK MASONRY GALLERY LAYOUT)   */}
        {/* Exact Layout from Featured Verified Specialists.png               */}
        {/* ================================================================= */}
        <section id="featured-specialists" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
          <span id="specialists" className="sr-only" />
          {/* Subtle Halftone Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Heading, Subtext, Trust Guarantees & Action CTA */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                    ↓
                  </div>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A2614] leading-[1.1] sm:leading-[1.05]">
                  Featured Verified Specialists
                </h2>

                <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600">
                  Connect with vetted tradespeople and digital professionals across Africa. Government ID verified, fit-ranked by Connecta AI, and backed by milestone escrow protection.
                </p>

                {/* Trust Guarantee Checklist Cards (Smooth & Aligned) */}
                <div className="space-y-2.5 pt-1">
                  {[
                    '100% Government Identity & Trust Badge Verified',
                    'Fit-Ranked by Connecta AI Matching Engine',
                    '100% Milestones Escrow-Protected',
                    'Direct Local Bank & Mobile Payouts',
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#10B981]/60 transition-all hover:scale-[1.01]"
                    >
                      <span className="w-7 h-7 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100/80">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#0A2614] tracking-tight">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Link
                    href="/requests/new"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-8 py-4 text-sm font-extrabold shadow-xl hover:scale-105 transition-all"
                  >
                    <span>Explore All Talent</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <span className="text-xs font-semibold text-slate-500">
                    2,548+ active professionals ready
                  </span>
                </div>
              </div>

              {/* Right Column: 2-Column Staggered Masonry Photo Grid matching Featured Verified Specialists.png */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 items-start">
                  {/* Column 1 */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Card 1: Square Photo (Ibrahim Aliyu - Master Electrician) */}
                    <Link
                      href={`/requests/new?providerId=${FEATURED_PROVIDERS[0].id}`}
                      className="group relative block aspect-square rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border-2 border-black/10 bg-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Image
                        src={FEATURED_PROVIDERS[0].avatar}
                        alt={FEATURED_PROVIDERS[0].name}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white space-y-1">
                        <div className="font-extrabold text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                          {FEATURED_PROVIDERS[0].name}
                        </div>
                        <div className="text-xs font-semibold text-emerald-200 truncate">
                          {FEATURED_PROVIDERS[0].trade}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white/80">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          <span>{FEATURED_PROVIDERS[0].location}</span>
                        </div>
                      </div>
                    </Link>

                    {/* Card 2: Portrait Aspect Ratio (Jonah Blessing - Plumbing & Fluidics) */}
                    <Link
                      href={`/requests/new?providerId=${FEATURED_PROVIDERS[1].id}`}
                      className="group relative block aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border-2 border-black/10 bg-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Image
                        src={FEATURED_PROVIDERS[1].avatar}
                        alt={FEATURED_PROVIDERS[1].name}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white space-y-1">
                        <div className="font-extrabold text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                          {FEATURED_PROVIDERS[1].name}
                        </div>
                        <div className="text-xs font-semibold text-emerald-200 truncate">
                          {FEATURED_PROVIDERS[1].trade}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white/80">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          <span>{FEATURED_PROVIDERS[1].location}</span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Card 3: Landscape Aspect Ratio (Kabiru Sani - Precision Woodwork) */}
                    <Link
                      href={`/requests/new?providerId=${FEATURED_PROVIDERS[2].id}`}
                      className="group relative block aspect-[4/3] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border-2 border-black/10 bg-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Image
                        src={FEATURED_PROVIDERS[2].avatar}
                        alt={FEATURED_PROVIDERS[2].name}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white space-y-1">
                        <div className="font-extrabold text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                          {FEATURED_PROVIDERS[2].name}
                        </div>
                        <div className="text-xs font-semibold text-emerald-200 truncate">
                          {FEATURED_PROVIDERS[2].trade}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white/80">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          <span>{FEATURED_PROVIDERS[2].location}</span>
                        </div>
                      </div>
                    </Link>

                    {/* Card 4: Square Aspect Ratio (Salamah Othman - Device Diagnostics) */}
                    <Link
                      href={`/requests/new?providerId=${FEATURED_PROVIDERS[3].id}`}
                      className="group relative block aspect-square rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border-2 border-black/10 bg-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Image
                        src={FEATURED_PROVIDERS[3].avatar}
                        alt={FEATURED_PROVIDERS[3].name}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white space-y-1">
                        <div className="font-extrabold text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                          {FEATURED_PROVIDERS[3].name}
                        </div>
                        <div className="text-xs font-semibold text-emerald-200 truncate">
                          {FEATURED_PROVIDERS[3].trade}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white/80">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          <span>{FEATURED_PROVIDERS[3].location}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HOW CONNECTA WORKS (ADAPTED TO CORE OBJECTIVES CARDS LAYOUT)      */}
        {/* ================================================================= */}
        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span id="how-it-work" className="sr-only" />
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#0A2614]">
                How Connecta Works
              </h2>
            </div>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600">
              From brief to payout, in one flow. Every project moves through the same protected path, whichever side you&apos;re on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_STAGES.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.number}
                  className={`${st.cardBg} text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
                >
                  {/* Halftone / Dot pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                      backgroundSize: '18px 18px',
                    }}
                  />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-black text-white/30 tracking-tight">
                        {st.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                        <h3 className="text-2xl font-extrabold tracking-tight">
                          {st.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/80 relative z-10">
                    <span>{st.footerMeta}</span>
                    <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              )
            })}
            </div>
          </ScrollReveal>
        </section>

        {/* ================================================================= */}
        {/* THE CONNECTA TRUST STANDARD (EXACT MATCH TO core objectives.png)   */}
        {/* ================================================================= */}
        <section id="trust-standard" className="py-16 sm:py-24 lg:py-32 bg-[#F4FBF7] relative overflow-hidden border-y border-emerald-100">
          {/* Halftone Dot Pattern from core objectives.png */}
          <div
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#03CF6A 2px, transparent 2px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Circle ↓ Badge (Centered & Perfectly Fitted) */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 space-y-5">
              <div className="flex items-center justify-center">
                <div className="w-11 h-11 rounded-full border-2 border-[#0A1020] bg-white flex items-center justify-center font-bold text-xl text-[#0A1020] shrink-0 shadow-xs">
                  ↓
                </div>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A2614] tracking-tight leading-[1.1]">
                The Connecta Trust Standard
              </h2>

              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600 max-w-2xl mx-auto">
                Every system on Connecta exists so neither side has to trust blindly. Trust is engineered into the platform with government ID verification, milestone escrow, verified reviews, and a fair dispute process.
              </p>
            </div>

            {/* Vertically Stacked Cards (Exact Visual Match to core objectives.png) */}
            <div className="space-y-6 sm:space-y-8">
              {/* Card 1: Vibrant Golden Amber (#F39200) */}
              <div className="bg-[#F39200] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.8] shrink-0" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Identity Verification &amp; Trust Badges:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Every profile can be verified with government identity checks. Verified members earn an official trust badge that appears on their profile, building instant credibility and ensuring verified accountability.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Verified Government Identity</span>
                  </div>
                  <Link
                    href="/onboarding?step=role&role=provider"
                    className="bg-white/20 hover:bg-white/30 px-3.5 py-1 rounded-full text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Get Trust Badge</span>
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Vibrant Emerald Green (#03CF6A) */}
              <div className="bg-[#03CF6A] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.8] shrink-0" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Protected Escrow Milestones:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Funds are secured before work starts and released only upon approval. Clients fund milestones up front, freelancers see money is protected, and nobody chases invoices or works unpaid.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Protected Escrow Vaults</span>
                  </div>
                  <Link
                    href="/onboarding?step=role"
                    className="bg-white/20 hover:bg-white/30 px-3.5 py-1 rounded-full text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Escrow Protected Flow</span>
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Royal Purple / Deep Indigo (#453478) */}
              <div className="bg-[#453478] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.8] shrink-0" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Honest Reviews &amp; Fair Dispute Mediation:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Two-way ratings build reputation that feeds back into AI matching. If something goes wrong, either side can open a dispute: evidence is reviewed fairly by real people, with funds locked until resolved.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Two-Way Verified Ratings</span>
                  </div>
                  <Link
                    href="#faq"
                    className="bg-white/20 hover:bg-white/30 px-3.5 py-1 rounded-full text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Mediation FAQs</span>
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Tactile Trust Guarantees Cloud */}
            <div className="mt-12 flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {TRUST_GUARANTEES.map((g, idx) => (
                <span
                  key={idx}
                  className={`${g.color} text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{g.title}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CUSTOMER REVIEWS (VISION/MISSION ADAPTATION)                       */}
        {/* ================================================================= */}
        <section id="reviews" className="py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#0A2614]">
                Verified Customer Stories
              </h2>
            </div>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600">
              Real stories from clients and talent across Africa. Two-way reviews tied directly to completed projects and escrow-protected milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className={`${r.cardBg} text-white rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
              >
                {/* Halftone dot texture */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-1.5">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>

                  <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed font-medium">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-white/90 relative z-10">
                  <div>
                    <div className="text-white text-base sm:text-lg font-black tracking-tight">{r.author}</div>
                    <div className="text-white/75 text-xs sm:text-sm font-normal mt-0.5">{r.neighborhood}</div>
                  </div>
                  <CornerDownRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS (EXACT TWO-COLUMN LAYOUT FROM faqs.png) */}
        {/* ================================================================= */}
        <section id="faq" className="py-16 sm:py-24 lg:py-32 bg-white border-y border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Outer Box Card matching faqs.png */}
            <div className="border-2 border-[#0A1020] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-14 bg-white shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                {/* Left Column: FAQs. */}
                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#0A2614] tracking-tight">
                    FAQs.
                  </h2>

                  <div className="space-y-3.5" role="tablist" aria-orientation="vertical">
                    {FAQS.map((faq, index) => {
                      const isActive = (openFaq ?? 0) === index
                      return (
                        <button
                          key={index}
                          id={`faq-tab-${index}`}
                          role="tab"
                          aria-selected={isActive}
                          aria-expanded={isActive}
                          aria-controls={`faq-panel-${index}`}
                          onClick={() => setOpenFaq(index)}
                          className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                            isActive
                              ? 'bg-black text-white shadow-xl scale-[1.01]'
                              : 'bg-white border border-slate-200 hover:border-slate-300 text-[#0A2614]'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-extrabold leading-snug">
                            {faq.q}
                          </span>
                          {isActive && (
                            <span className="shrink-0 text-[#F5A623]">
                              {/* 12-Point Golden Starburst matching faqs.png */}
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                              </svg>
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right Column: Ans. */}
                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#0A2614] tracking-tight">
                    Ans.
                  </h2>

                  {/* Saturated Amber / Yellow Answer Card matching faqs.png */}
                  <div
                    id={`faq-panel-${openFaq ?? 0}`}
                    role="tabpanel"
                    aria-labelledby={`faq-tab-${openFaq ?? 0}`}
                    className="bg-[#F5A623] rounded-3xl p-8 sm:p-12 text-[#0A1020] shadow-xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-start relative"
                  >
                    {/* Black 12-Point Starburst matching faqs.png */}
                    <div className="text-[#0A1020]">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                      </svg>
                    </div>

                    {/* Answer text */}
                    <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed mt-6 text-[#0A1020]/95">
                      {FAQS[openFaq ?? 0]?.a}
                    </p>

                    <div className="mt-auto pt-8 border-t border-[#0A1020]/15 flex items-center justify-between text-xs font-bold text-[#0A1020]/80">
                      <span>8 Sectors · Escrow Secured</span>
                      <span>
                        Question {((openFaq ?? 0) + 1).toString().padStart(2, '0')} of {FAQS.length.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PROVIDER CTA BANNER (WHO CONNECTA SERVES STYLE GRAND CONTAINER)    */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F7FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A2614] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-2xl">
              {/* Halftone / Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-5 max-w-xl text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0">
                      ↓
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                    African talent is ready. Are you?
                  </h3>
                  <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100">
                    Post a project and meet your match today, or build the profile that puts your work in front of clients worldwide. Free to join · Escrow-protected · Local payouts available.
                  </p>

                  {/* Provider Benefits Pills */}
                  <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 justify-center md:justify-start">
                    {PROVIDER_BENEFITS.map((b, idx) => (
                      <span
                        key={idx}
                        className={`${b.color} text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-md transition-transform hover:scale-105 cursor-default`}
                      >
                        {b.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 z-10">
                  <Link
                    href="/requests/new"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all hover:scale-105"
                  >
                    <span>Hire African Talent</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/onboarding?step=role&role=provider"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-bold text-white transition-colors"
                  >
                    Start Freelancing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Organic Decorative Section Border (Matching section broder.png) */}
      <SectionBorderDivider flip={true} color="#0A2614" className="-mb-1 relative z-20" />

      {/* ================================================================= */}
      {/* SIMPLIFIED GREEN FOOTER (FULL WIDTH EDGE-TO-EDGE IN BRAND GREEN)  */}
      {/* ================================================================= */}
      <footer className="w-full bg-[#0A2614] text-white pt-12 sm:pt-20 pb-10 border-t-2 border-[#10B981]/20 relative overflow-hidden">
        {/* Halftone / Dot pattern extending full-width */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Connecta Brand & Navigation */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0 text-white">
                    ↓
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                    Connecta.
                  </h2>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100/90 max-w-xl">
                  African talent, woven into the world&apos;s work. Connecting households and businesses with verified tradespeople and digital professionals through milestone escrow.
                </p>
              </div>

              {/* Quick Navigation Links arranged cleanly like a footer */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                  Explore Platform
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Link
                    href="#services"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Services &amp; Trades</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/discover"
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Discover Pros</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>How It Works</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="#trust-standard"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Trust &amp; Escrow</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="#faq"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>FAQs</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/onboarding?step=role"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                </div>
              </div>

              {/* Social Channels & Contact Pill */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://x.com/Connectainc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Twitter / X (@Connectainc)"
                >
                  𝕏
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61587476974482"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Facebook (@Connecta)"
                >
                  fb
                </a>
                <a
                  href="https://www.instagram.com/connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Instagram (@connecta_inc)"
                >
                  ig
                </a>
                <a
                  href="https://www.tiktok.com/@connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105"
                  title="TikTok (@connecta_inc)"
                >
                  tk
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-emerald-400 text-xs font-bold transition-all hover:scale-105"
                  title="WhatsApp (+234 812 345 6789)"
                >
                  wa
                </a>
                <a
                  href="mailto:support@myconnecta.ng"
                  className="text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>support@myconnecta.ng</span>
                </a>
                <a
                  href="tel:+2348123456789"
                  className="text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>+234 812 345 6789</span>
                </a>
              </div>
            </div>

            {/* Right Column: Saturated Emerald Callout Card (Adapting FAQ Ans. Card) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#10B981] rounded-3xl p-8 sm:p-10 text-[#062419] shadow-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between relative">
                {/* Deep Green 12-Point Starburst (Matching FAQ Starburst) */}
                <div className="text-[#062419]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                  </svg>
                </div>

                {/* Main Callout Copy */}
                <div className="space-y-4 my-auto py-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#062419]">
                    Ready to hire or offer services?
                  </h3>
                  <p className="text-base sm:text-lg font-semibold leading-relaxed text-[#062419]/90">
                    Post a project brief in under a minute or create your specialist profile. 100% milestone escrow protection with instant local payouts.
                  </p>
                </div>

                {/* Action Buttons inside Card */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/requests/new"
                    className="bg-[#062419] hover:bg-black text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                  >
                    <span>Post a Request</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/onboarding?step=role&role=provider"
                    className="bg-white/20 hover:bg-white/30 border border-[#062419]/25 text-[#062419] px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold transition-all"
                  >
                    Join as Specialist
                  </Link>
                </div>

                {/* Card Bottom Meta Strip */}
                <div className="mt-8 pt-6 border-t border-[#062419]/20 flex items-center justify-between text-xs font-bold text-[#062419]/80">
                  <span>100% Escrow Secured</span>
                  <span>myconnecta.ng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status & Copyright Strip */}
          <div className="mt-16 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
            <div className="flex flex-wrap items-center gap-3">
              <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
              <span>•</span>
              <Link href="/discover" className="hover:text-white underline-offset-4 hover:underline transition-colors font-bold text-emerald-300">
                Discover
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white underline-offset-4 hover:underline transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white underline-offset-4 hover:underline transition-colors">
                Terms of Service
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Verified Marketplace</span>
              </span>
              <span>•</span>
              <span>Nigeria &amp; Pan-Africa</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
