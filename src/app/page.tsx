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
} from 'lucide-react'
import { ConnectaCornerHelix } from '@/components/Connecta3DDecoration'

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

// Chowdeck Horizontal Accordion Structure (Matching Explore Supported Trades.png)
const TRADE_ACCORDION_ITEMS = {
  metro: [
    {
      id: 'solar-electrical',
      slug: 'electrical',
      title: 'Solar & Electrical Power',
      collapsedTitle: 'Solar & Electrical',
      desc: 'Certified solar engineers and licensed electricians for residential inverter setups, hybrid battery systems, safety audits, and clean domestic power.',
      bg: 'bg-[#DBD5F9]',
      textColor: 'text-[#4C1D95]',
      badge: 'Rapid 45-Min Arrival',
      badgeColor: 'bg-[#0C513F] text-white',
      tags: ['Solar Inverters', 'Lithium Batteries', 'Distribution Boards', 'Prepaid Meters', 'Safety Earthing'],
      image: '/images/services/electrician_working_on_electrical_panel.jpg',
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
      collapsedTitle: 'Phones & Gadgets',
      desc: 'Fast same-day repairs for cracked smartphone screens, genuine high-capacity battery replacements, logic-board micro-soldering, and certified diagnostics.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      badge: 'Same-Day Screen Swaps',
      badgeColor: 'bg-[#B45309] text-white',
      tags: ['OLED Screens', 'TrueTone Transfer', 'Battery Health 100%', 'Board Micro-Soldering', 'Charging Ports'],
      image: '/images/services/phone_repair_technician.jpg',
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
      collapsedTitle: 'AC & Refrigeration',
      desc: 'Precision air conditioning servicing, eco-friendly refrigerant top-ups, commercial compressor overhauls, and deep antibacterial coil cleaning.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      badge: 'Cooling Guarantee',
      badgeColor: 'bg-[#1D4ED8] text-white',
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
      collapsedTitle: 'Plumbing & Piping',
      desc: 'Vetted plumbers for emergency pipe leak repairs, borehole submersible pump pulling and servicing, overhead tank connections, and clean sanitary fittings.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      badge: 'Pressure-Tested Guarantee',
      badgeColor: 'bg-[#047857] text-white',
      tags: ['Submersible Pumps', 'Pressure Control Valves', 'Pipe Leak Detection', 'Overhead Tanks', 'Clean Piping'],
      image: '/images/services/cleaning_or_maintenance_technician.jpg',
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
      collapsedTitle: 'Auto Diagnostics',
      desc: 'Computerized vehicle OBD2 diagnostic scanning, ceramic brake service, suspension overhauls, routine oil changes, and expert engine repairs.',
      bg: 'bg-[#DBD5F9]',
      textColor: 'text-[#4C1D95]',
      badge: 'OBD2 Computer Scan Included',
      badgeColor: 'bg-[#0C513F] text-white',
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
      collapsedTitle: 'Carpentry & Wood',
      desc: 'Master craftsmen for custom office cabinetry, solid hardwood wardrobes, precision door fittings, architectural woodwork, and bespoke furniture framing.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      badge: 'Master Guild Certified',
      badgeColor: 'bg-[#B45309] text-white',
      tags: ['Custom Office Desks', 'Hardwood Wardrobes', 'Door Frame Fitting', 'Roof Trusses', 'Cabinet Joinery'],
      image: '/images/services/carpenter_working_in_nigeria.jpg',
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
      collapsedTitle: 'Computers & Laptops',
      desc: 'Hardware bench repairs, NVMe SSD speed upgrades, screen replacements, thermal paste re-application, logic-board diagnostics, and clean OS restoration.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      badge: 'Certified Bench Lab',
      badgeColor: 'bg-[#1D4ED8] text-white',
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
      collapsedTitle: 'Painting & POP',
      desc: 'Architectural interior and exterior painting, POP plastering, damp-proof waterproofing, decorative wall screeding, and clean post-job site cleanup.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      badge: 'Spotless Cleanup Guarantee',
      badgeColor: 'bg-[#047857] text-white',
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
    avatar: '/images/services/electrician_working_on_electrical_panel.jpg',
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
    avatar: '/images/services/cleaning_or_maintenance_technician.jpg',
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
    avatar: '/images/services/carpenter_working_in_nigeria.jpg',
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
    avatar: '/images/services/phone_repair_technician.jpg',
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
  const [heroMouseOffset, setHeroMouseOffset] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(true)

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 80
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 60
    setHeroMouseOffset({ x, y })
  }

  const handleHeroMouseLeave = () => {
    setHeroMouseOffset({ x: 0, y: 0 })
  }

  // Auto-cycle Explore Supported Trades accordion every 3 seconds (smooth shrink & expand)
  useEffect(() => {
    if (isAccordionPaused) return

    const items = TRADE_ACCORDION_ITEMS[tradeCategoryGroup] || []
    if (items.length <= 1) return

    const timer = setInterval(() => {
      setActiveAccordionIndex((prev) => (prev + 1) % items.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [isAccordionPaused, tradeCategoryGroup])

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
                'https://twitter.com/myconnecta',
                'https://linkedin.com/company/myconnecta',
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

      {/* Chowdeck-style Floating Header (Exact match to header.png) */}
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Pill Group: Connecta Brand Pill + Country Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="bg-[#0C513F] hover:bg-[#083b2e] text-white px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all hover:scale-105 shrink-0"
            >
              <div className="relative w-5 h-5 shrink-0">
                <Image
                  src="/brand/connecta-header-icon.svg"
                  alt="Connecta Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">connecta</span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white/95 px-3 py-2 rounded-full shadow-md border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
              <span className="text-sm leading-none">🇳🇬</span>
              <span className="font-extrabold text-slate-900 tracking-tight text-xs">NG</span>
              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 flex items-center justify-center text-[10px] ml-0.5">
                <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            </div>
          </div>

          {/* Center Navigation Pill (Authentic Connecta Links) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-extrabold text-slate-900 bg-white/95 px-7 py-3 rounded-full shadow-md border border-slate-200/80 backdrop-blur-md">
            <Link href="#services" className="hover:text-[#0C513F] transition-colors">
              Services & Trades
            </Link>
            <Link href="#featured-specialists" className="hover:text-[#0C513F] transition-colors">
              Specialists
            </Link>
            <Link href="#how-it-works" className="hover:text-[#0C513F] transition-colors">
              How It Works
            </Link>
            <Link href="#trust-standard" className="hover:text-[#0C513F] transition-colors">
              Trust & Escrow
            </Link>
            <Link href="#about" className="hover:text-[#0C513F] transition-colors">
              About
            </Link>
            <Link href="#faq" className="hover:text-[#0C513F] transition-colors">
              FAQs
            </Link>
          </nav>

          {/* Right Group: Connecta Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/onboarding?role=provider"
              className="hidden sm:inline-flex items-center text-xs font-extrabold text-slate-900 bg-white/95 hover:bg-slate-50 px-4.5 py-2.5 rounded-full shadow-md border border-slate-200/80 transition-colors"
            >
              Join as Pro
            </Link>

            <Link
              href="/requests/new"
              className="bg-[#0C513F] hover:bg-[#083b2e] text-white px-5 py-2.5 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 shrink-0"
            >
              <span>Hire Talent</span>
              <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Chowdeck-Style Large Text Motion & Ambient Hero Video Background */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden relative min-h-[660px] flex items-center justify-center"
        >
          {/* Hero Video as Background of Hero Section with Balanced Translucency */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/hero.mp4"
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="w-full h-full object-cover scale-105 opacity-40 transition-opacity duration-700"
            />
            {/* Elegant multi-layer overlay for optimal readability while showing video action */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F7FC]/75 via-[#F5F7FC]/50 to-[#F5F7FC]/90 backdrop-blur-[0.5px]" />
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#0A1020 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Connecta Radiant Chromatic Aura Mesh (Smoothly Follows Mouse Movement with Easing) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10 transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${heroMouseOffset.x}px, ${heroMouseOffset.y}px, 0)`,
            }}
          >
            <div className="relative w-[750px] sm:w-[980px] lg:w-[1150px] h-[520px] sm:h-[640px] opacity-70 sm:opacity-85 mix-blend-multiply filter blur-[75px] sm:blur-[115px] lg:blur-[145px] transform-gpu">
              {/* Center Glow: Connecta Vibrant Emerald (#10B981 / #00C466) */}
              <div className="absolute top-[18%] left-[24%] w-[380px] h-[340px] rounded-full bg-gradient-to-tr from-[#10B981] via-[#00C466] to-[#34D399] opacity-90 animate-pulse duration-[8000ms]" />

              {/* Top-Right Ambient Flare: Connecta Golden Amber (#F59E0B / #F5A623) */}
              <div className="absolute top-[6%] right-[14%] w-[360px] h-[300px] rounded-full bg-gradient-to-br from-[#F59E0B] via-[#F5A623] to-[#F97316] opacity-85" />

              {/* Lower-Center Anchor: Connecta Electric Tech Blue (#4D78FF / #3B82F6) */}
              <div className="absolute bottom-[10%] left-[18%] w-[440px] h-[340px] rounded-full bg-gradient-to-r from-[#4D78FF] via-[#3B82F6] to-[#2563EB] opacity-90" />

              {/* Lower-Right Deep Violet/Indigo: Connecta Tech Indigo (#6366F1 / #8B5CF6) */}
              <div className="absolute bottom-[8%] right-[18%] w-[380px] h-[320px] rounded-full bg-gradient-to-tl from-[#8B5CF6] via-[#6366F1] to-[#4D78FF] opacity-80" />

              {/* Top-Left Fresh Mint Glow: Connecta Forest Mint (#0C513F / #10B981) */}
              <div className="absolute top-[12%] left-[10%] w-[320px] h-[280px] rounded-full bg-gradient-to-br from-[#0C513F] to-[#10B981] opacity-70" />
            </div>
          </div>

          {/* Floating Audio Control Pill */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
            <button
              type="button"
              onClick={toggleVideoSound}
              className="flex items-center gap-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-slate-200/90 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
              title={isVideoMuted ? 'Unmute video' : 'Mute video'}
            >
              {isVideoMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span>Unmute Video</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#10B981]" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Chowdeck-style Hero Heading (Static as requested) */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A1020] leading-[1.08]">
                African talent, woven into{' '}
                <span className="inline-block relative text-[#4D78FF] underline decoration-[#F59E0B] decoration-wavy decoration-2">
                  high-impact Collabo Squads
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                From plumbers, electricians and technicians to developers, designers and financial advisors, Connecta connects verified African professionals with clients everywhere. Matched with speed, protected by milestone escrow.
              </p>

              {/* Google-style Search Capsule with Real-time Suggestions Dropdown */}
              <div ref={searchContainerRef} className="pt-3 max-w-3xl mx-auto relative z-40">
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
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md group"
                  >
                    <span>Find Talent</span>
                    <span className="text-[#F5A623] group-hover:text-white transition-colors">
                      {/* 12-Point Golden Starburst matching FAQ */}
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
              <div className="pt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-slate-200/90 hover:border-[#10B981]/50 hover:shadow-lg transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#0A2614] tracking-tight">2,548+</span>
                    <span className="text-slate-600 font-medium">Professionals Onboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-slate-200/90 hover:border-[#4D78FF]/50 hover:shadow-lg transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#4D78FF]/15 text-[#4D78FF] flex items-center justify-center shrink-0">
                    <Globe className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#0A2614] tracking-tight">2+</span>
                    <span className="text-slate-600 font-medium">Countries Represented</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-lg transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-emerald-700 tracking-tight">100%</span>
                    <span className="text-slate-600 font-medium">Escrow Protected</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-slate-200/90 hover:border-[#F59E0B]/50 hover:shadow-lg transition-all">
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#D97706] tracking-tight">&lt;1s</span>
                    <span className="text-slate-600 font-medium">Avg. AI Match Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ABOUT (VISION AND MISSION & PHILOSOPHY SECTION)                   */}
        {/* ================================================================= */}
        <section id="about" className="py-24 sm:py-32 lg:py-36 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
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
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                  ↓
                </div>
                <h2 className="text-5xl sm:text-7xl font-black text-[#0A2614] tracking-tight">
                  Vision &amp; Mission
                </h2>
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600">
                What we believe and what we&apos;re building across Africa.
              </p>
            </div>

            {/* Distinct Cards with Angled Arrows (Exact Match from Root Image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Vision Card (Amber / Gold from image) */}
              <div className="bg-[#E67E00] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
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
              <div className="bg-[#2E1A47] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
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

            {/* Core Objectives (Exact Cards from core objectives.png) */}
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
          </div>
        </section>

        {/* ================================================================= */}
        {/* WHO CONNECTA SERVES (EXACT LAYOUT FROM who to expect full section) */}
        {/* ================================================================= */}
        <section id="who-connecta-serves" className="py-24 sm:py-32 lg:py-36 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-[#0A2614] text-white rounded-3xl p-8 sm:p-14 lg:p-16 relative shadow-2xl overflow-hidden">
              {/* Halftone / Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-3xl overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              {/* 3D Glass Helix Ribbon & Floating Beads from deco.png (Seamless Top-Right Corner Integration) */}
              <div className="absolute top-0 right-0 w-[220px] sm:w-[300px] lg:w-[380px] h-[200px] sm:h-[260px] lg:h-[320px] pointer-events-none z-10 flex items-start justify-end overflow-hidden">
                <ConnectaCornerHelix className="w-full h-full" />
              </div>

              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0">
                    ↓
                  </div>
                  <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-white">
                    Who Connecta Serves
                  </h2>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100">
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
          </div>
        </section>

        {/* ================================================================= */}
        {/* BRAND CHARACTER & TOOLKIT SHOWCASE (ADAPTED TO VISION/MISSION)     */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Electric Azure / Indigo */}
            <div className="bg-[#1E1B4B] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-1.webp"
                  alt="Connecta Multi-Trade Certification & Emblem"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#10B981] text-white shadow-md">
                  Continent-Wide
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-[#10B981] shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Across Every Sector</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Connecta brings together both hands-on trades and digital careers. From plumbing, electrical and auto care to software engineering, design, marketing and finance, talent across every trade finds work and gets hired.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Skilled Trades &amp; Digital Work</span>
                  <span className="text-[#10B981]">Local &amp; Global</span>
                </div>
              </div>
            </div>

            {/* Card 2: Warm Amber / Gold */}
            <div className="bg-[#D97706] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-2.webp"
                  alt="Connecta AI Matching Engine Visualization"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#0A1020] text-white shadow-md border border-white/20">
                  AI Matchmaking
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-amber-200 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Meet Your Match in Seconds</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    Tell Connecta what the project needs in plain words. The matching engine studies skills, experience, ratings, availability, and budget to surface fit-ranked recommendations in &lt;1s.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-100">
                  <span>Transparent Fit Score</span>
                  <span>&lt;1s Match Time</span>
                </div>
              </div>
            </div>

            {/* Card 3: Deep Forest / Emerald */}
            <div className="bg-[#0A2614] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-3.webp"
                  alt="Connecta Collabo Squad Shared Workspace"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#4D78FF] text-white shadow-md">
                  Collabo Squads
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-emerald-300 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Great Work Isn&apos;t Solo</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Form a Collabo Squad, combine your skills into one shared profile, and take on briefs too big for one person. Shared workspaces, role tracking, and automatic fair payment splits.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-emerald-200">
                  <span>Shared Workspace</span>
                  <span>Automatic Splits</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PLATFORM FEATURES (EXACT POST-IT MASKING TAPE LAYOUT FROM IMAGE)  */}
        {/* ================================================================= */}
        <section id="features" className="py-24 sm:py-32 lg:py-36 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
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
              <h2 className="text-5xl sm:text-7xl font-black text-[#0A2614] tracking-tight">
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

                <div className="bg-[#00C466] text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-left */}
                  <div className="absolute -bottom-3 left-0 w-8 sm:w-10 h-3 bg-[#008044] rounded-bl-sm transform origin-top-left -skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Describe The Work You Need
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (No Guesswork) Post a project or tell Connecta AI what you need in plain words. Specify deliverables, milestones, and budget without complicated forms.
                    </p>
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

                <div className="bg-[#3D2F6B] text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-right */}
                  <div className="absolute -bottom-3 right-0 w-8 sm:w-10 h-3 bg-[#241A45] rounded-br-sm transform origin-top-right skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Connecta AI Matching in Seconds
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (&lt;1s Match Time) No endless scrolling through profiles. The matching engine studies skills, experience, ratings, availability, and budget to surface talent that actually fits.
                    </p>
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

                <div className="bg-[#0B132B] text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-left */}
                  <div className="absolute -bottom-3 left-0 w-8 sm:w-10 h-3 bg-[#050A17] rounded-bl-sm transform origin-top-left -skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Identity Verification &amp; Trust Badges
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (Verified Profiles) Every profile undergoes government identity checks and verification badges. Clients hire with complete confidence, and verified talent stands out.
                    </p>
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

                <div className="bg-[#063B23] text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl relative">
                  {/* Curled paper corner flap at bottom-right */}
                  <div className="absolute -bottom-3 right-0 w-8 sm:w-10 h-3 bg-[#032113] rounded-br-sm transform origin-top-right skew-x-12 shadow-xs pointer-events-none" />

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      Protected Escrow &amp; Local Payouts
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (100% Milestones Protected) Clients fund milestones up front; talent sees money is secured before starting. Funds release only on approval, with instant cash-out to local payout methods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SUPPORTED SERVICE TRADES (CHOWDECK-STYLE EXPANDING ACCORDION)     */}
        {/* Exact Layout & Visual Identity from Explore Supported Trades.png  */}
        {/* ================================================================= */}
        <section id="services" className="py-24 sm:py-32 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                  ↓
                </div>
                <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-[#0A2614]">
                  Explore Supported Trades
                </h2>
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-600 max-w-2xl">
                Whatever your trade, there is work for it here. Connecta supports both hands-on trades like plumbing, electrical and carpentry, and digital professions like programming and brand design. Talent across every sector gets hired safely.
              </p>
            </div>

            {/* Category Pillar Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 self-start md:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setTradeCategoryGroup('metro')
                  setActiveAccordionIndex(0)
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tradeCategoryGroup === 'metro'
                    ? 'bg-[#0A1020] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tradeCategoryGroup === 'workshop'
                    ? 'bg-[#0A1020] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Workshop & Vehicles
              </button>
            </div>
          </div>

          {/* Chowdeck-style 4-Card Horizontal Expanding Accordion (Auto-cycles every 3s, Smooth Hover & Crossfade) */}
          <div
            className="w-full overflow-x-auto sm:overflow-visible pb-2 scrollbar-none"
            onMouseEnter={() => setIsAccordionPaused(true)}
            onMouseLeave={() => setIsAccordionPaused(false)}
          >
            <div className="flex gap-4 sm:gap-5 items-stretch h-[480px] sm:h-[530px] min-w-[700px] sm:min-w-0 w-full">
              {TRADE_ACCORDION_ITEMS[tradeCategoryGroup].map((item, idx) => {
                const isActive = activeAccordionIndex === idx
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => {
                      setActiveAccordionIndex(idx)
                      setIsAccordionPaused(true)
                    }}
                    onClick={() => {
                      setActiveAccordionIndex(idx)
                      setIsAccordionPaused(true)
                    }}
                    className={`relative overflow-hidden rounded-[28px] border-2 border-black cursor-pointer select-none transition-[flex-grow,flex-basis,max-width,width,box-shadow,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${item.bg} ${
                      isActive
                        ? 'flex-[5_1_0%] min-w-[320px] sm:min-w-[440px] shadow-2xl cursor-default'
                        : 'flex-[1_1_0%] min-w-[76px] sm:min-w-[96px] md:min-w-[108px] max-w-[130px] shadow-sm hover:shadow-lg hover:brightness-[0.97]'
                    }`}
                  >
                    {/* EXPANDED CONTENT LAYER (Smooth cross-fade & gentle scale reveal) */}
                    <div
                      className={`h-full w-full flex flex-col justify-between p-6 sm:p-9 lg:p-10 transition-all duration-500 ease-out ${
                        isActive
                          ? 'opacity-100 scale-100 pointer-events-auto delay-100'
                          : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                      }`}
                    >
                      {/* Top Row: Icon + Guarantee Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="p-1 shrink-0">
                          {renderAccordionTradeIcon(item.icon)}
                        </div>
                        <span className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 shrink-0 ${item.badgeColor}`}>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>{item.badge}</span>
                        </span>
                      </div>

                      {/* Middle Content: Title, Description, Tags, and Visual Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto py-2">
                        <div className="md:col-span-7 space-y-3.5">
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight antialiased">
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-700/90 font-medium leading-relaxed max-w-lg antialiased">
                            {item.desc}
                          </p>
                          {/* Sub-Specialty Tags */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-black/10 text-slate-800 shadow-2xs tracking-tight"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Visual: Vetted Artisan Card Frame */}
                        <div className="md:col-span-5 hidden sm:flex flex-col items-center justify-center">
                          <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-2 border-black/25 shadow-xl bg-slate-900/10 group">
                            <Image
                              src={item.image}
                              alt={item.alt}
                              fill
                              sizes="220px"
                              className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs">
                              <div className="font-extrabold flex items-center gap-1">
                                <span>{item.artisanName}</span>
                                <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" />
                              </div>
                              <div className="text-[10px] text-white/80">{item.artisanRating}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Direct Action CTA */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-black/10">
                        <Link
                          href={`/requests/new?category=${item.slug}`}
                          className="bg-[#0A1020] hover:bg-black text-white px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
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

                    {/* COLLAPSED VERTICAL CARD VIEW (Smooth cross-fade & centered vertical typography) */}
                    <div
                      className={`h-full w-full flex flex-col items-center justify-between py-8 transition-all duration-500 ease-out pointer-events-none ${
                        isActive
                          ? 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                          : 'opacity-100 scale-100'
                      }`}
                    >
                      {/* Top: Iconic SVG Emblem */}
                      <div className="pt-1">
                        {renderAccordionTradeIcon(item.icon)}
                      </div>

                      {/* Bottom: Rotated Vertical Typography Reading Bottom to Top */}
                      <div className="flex-1 flex items-end justify-center pb-2">
                        <span
                          className={`[writing-mode:vertical-rl] rotate-180 text-lg sm:text-xl lg:text-2xl font-black tracking-tight whitespace-nowrap select-none ${item.textColor}`}
                        >
                          {item.collapsedTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* FEATURED VERIFIED SPECIALISTS (CHOWDECK MASONRY GALLERY LAYOUT)   */}
        {/* Exact Layout from Featured Verified Specialists.png               */}
        {/* ================================================================= */}
        <section id="featured-specialists" className="py-24 sm:py-32 lg:py-36 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
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

                <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-[#0A2614] leading-[1.05]">
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
                    href="/onboarding?role=client"
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
        <section id="how-it-works" className="py-24 sm:py-32 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                ↓
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-[#0A2614]">
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
                  className={`${st.cardBg} text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
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
        </section>

        {/* ================================================================= */}
        {/* THE CONNECTA TRUST STANDARD (EXACT MATCH TO core objectives.png)   */}
        {/* ================================================================= */}
        <section id="trust-standard" className="py-24 sm:py-32 lg:py-36 bg-[#F4FBF7] relative overflow-hidden border-y border-emerald-100">
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
                  <span className="bg-white/20 px-3 py-1 rounded-full">Official Trust Badge Required</span>
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
                  <span className="bg-white/20 px-3 py-1 rounded-full">Funds Released Only Upon Client Approval</span>
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
                  <span className="bg-white/20 px-3 py-1 rounded-full">Fair Human Dispute Resolution</span>
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
        <section id="reviews" className="py-24 sm:py-32 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-xl shrink-0">
                ↓
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-[#0A2614]">
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

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(r.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-white/10 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Verified Booking</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal italic">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90 relative z-10">
                  <div>
                    <div className="text-white text-sm font-extrabold">{r.author}</div>
                    <div className="text-white/70 font-normal">{r.neighborhood}</div>
                  </div>
                  <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS (EXACT TWO-COLUMN LAYOUT FROM faqs.png) */}
        {/* ================================================================= */}
        <section id="faq" className="py-24 sm:py-32 lg:py-36 bg-white border-y border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Outer Box Card matching faqs.png */}
            <div className="border-2 border-[#0A1020] rounded-3xl p-6 sm:p-10 lg:p-14 bg-white shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                {/* Left Column: FAQs. */}
                <div className="space-y-6">
                  <h2 className="text-5xl sm:text-7xl font-black text-[#0A2614] tracking-tight">
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
                  <h2 className="text-5xl sm:text-7xl font-black text-[#0A2614] tracking-tight">
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
        <section className="py-24 sm:py-32 lg:py-36 bg-[#F5F7FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A2614] text-white rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
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

                  <h3 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
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
                    href="/onboarding?role=client"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all hover:scale-105"
                  >
                    <span>Hire African Talent</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/onboarding?role=provider"
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

      {/* ================================================================= */}
      {/* SIMPLIFIED GREEN FOOTER (FULL WIDTH EDGE-TO-EDGE IN BRAND GREEN)  */}
      {/* ================================================================= */}
      <footer className="w-full bg-[#0A2614] text-white pt-16 sm:pt-24 pb-12 border-t-2 border-[#10B981]/20 relative overflow-hidden">
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
                    href="#featured-specialists"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Specialists</span>
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
                    href="/onboarding"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                </div>
              </div>

              {/* Social Channels & Contact Pill */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
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
                  title="Facebook"
                >
                  fb
                </a>
                <a
                  href="https://www.instagram.com/connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Instagram"
                >
                  ig
                </a>
                <a
                  href="mailto:support@myconnecta.ng"
                  className="text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 rounded-full transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>support@myconnecta.ng</span>
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
                    href="/onboarding?role=provider"
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
            <p>© 2026 Connecta. All rights reserved.</p>

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
