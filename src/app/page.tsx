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
} from 'lucide-react'

const DYNAMIC_PHRASES = [
  'solar & inverters',
  'broken phone screens',
  'emergency pipe leaks',
  'air conditioner fixes',
  'car engine diagnostics',
  'custom furniture & woodwork',
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
      title: 'Solar & Electrical',
      collapsedTitle: 'Solar & Electrical',
      desc: 'Find vetted electricians and certified solar engineers for residential solar installations, inverter fault diagnosis, prepaid meters, and safe domestic wiring.',
      bg: 'bg-[#DBD5F9]',
      textColor: 'text-[#4C1D95]',
      badge: '45-Min Emergency Ready',
      badgeColor: 'bg-[#0C513F] text-white',
      tags: ['Solar Inverter Sizing', 'Lithium Battery Packs', 'Distribution Boards', 'Prepaid Meters', 'Earthing'],
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
      title: 'Phones & Gadgets',
      collapsedTitle: 'Phones & Gadgets',
      desc: 'Instant same-day repairs for cracked smartphone screens, genuine high-capacity battery replacements, board micro-soldering, and laptop diagnostics with warranty.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      badge: 'Under 1-Hr Display Swap',
      badgeColor: 'bg-[#B45309] text-white',
      tags: ['OLED Screen Swaps', 'TrueTone Transfer', 'Battery Health 100%', 'Board Micro-Soldering', 'Charging Ports'],
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
      title: 'AC & Refrigeration',
      collapsedTitle: 'AC & Refrigeration',
      desc: 'High-precision air conditioning servicing, genuine R410A refrigerant gas top-ups, commercial cold room compressor overhauls, and deep coil antibacterial cleaning.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      badge: 'Cooling Guarantee',
      badgeColor: 'bg-[#1D4ED8] text-white',
      tags: ['R410A Refrigerant Top-up', 'Compressor Overhaul', 'Deep Coil Cleaning', 'Split Unit Mounting', 'Chiller Repair'],
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
      title: 'Borehole & Plumbing',
      collapsedTitle: 'Borehole & Plumbing',
      desc: 'Certified plumbers for emergency pipe leak repairs, borehole submersible pump pulling and servicing, overhead tank connections, and high-pressure bathroom fittings.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      badge: 'Pressure-Tested Guarantee',
      badgeColor: 'bg-[#047857] text-white',
      tags: ['Submersible Pumps', 'Pressure Control Valves', 'Pipe Leak Detection', 'Overhead Tanks', 'Water Filtration'],
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
      title: 'Auto Diagnostics',
      collapsedTitle: 'Auto Diagnostics',
      desc: 'Computerized vehicle OBD2 diagnostic scanning, ceramic brake pad replacement, suspension servicing, routine oil maintenance, and engine troubleshooting across metropolitan Kano.',
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
      desc: 'Master carpenters for custom office cabinetry, solid mahogany wardrobes, door fittings, roof woodwork, and precision framing built to last generations.',
      bg: 'bg-[#FCECB2]',
      textColor: 'text-[#B45309]',
      badge: 'Certified Hardwood Guild',
      badgeColor: 'bg-[#B45309] text-white',
      tags: ['Custom Office Desks', 'Mahogany Wardrobes', 'Door Frame Fitting', 'Roof Trusses', 'Cabinet Joinery'],
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
      title: 'Computer & Laptops',
      collapsedTitle: 'Computer & Laptops',
      desc: 'Hardware upgrades, NVMe SSD installation, laptop screen replacement, thermal paste re-application, motherboard soldering, and operating system recovery.',
      bg: 'bg-[#98C7FF]',
      textColor: 'text-[#1D4ED8]',
      badge: 'Hardware Bench Lab',
      badgeColor: 'bg-[#1D4ED8] text-white',
      tags: ['Thermal Paste Re-pad', 'NVMe SSD Upgrades', 'Laptop Displays', 'BIOS Flashing', 'OS Recovery'],
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
      title: 'Painting & POP',
      collapsedTitle: 'Painting & POP',
      desc: 'Interior and exterior painting, POP plastering, damp-proof waterproofing, decorative screeding, smooth wall finishes, and spotless site clean-up.',
      bg: 'bg-[#CBF3E4]',
      textColor: 'text-[#047857]',
      badge: 'Spotless Site Clean Guarantee',
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
    business: 'Arewa Solar & Inverter Engineering',
    trade: 'Master Electrician & Solar Sizing',
    location: 'Nassarawa GRA, Kano',
    rating: 4.95,
    reviews: 48,
    jobs: 72,
    verified: true,
    experience: '8 yrs exp',
    avatar: '/images/services/electrician_working_on_electrical_panel.jpg',
    recentJob: '3.5kVA Inverter Installation in Bompai',
    cardBg: 'bg-[#1E1B4B]',
    accentPill: 'bg-[#10B981] text-white',
  },
  {
    id: 'p2',
    name: 'Garba Danbatta',
    business: 'Danbatta Phone & Display Lab',
    trade: 'Micro-soldering & Display Specialist',
    location: 'Sabon Gari, Kano',
    rating: 4.92,
    reviews: 64,
    jobs: 110,
    verified: true,
    experience: '10 yrs exp',
    avatar: '/images/services/phone_repair_technician.jpg',
    recentJob: 'iPhone 13 OLED & Battery Replacement',
    cardBg: 'bg-[#0A1020]',
    accentPill: 'bg-[#4D78FF] text-white',
  },
  {
    id: 'p3',
    name: 'Kabiru Sani',
    business: 'Sani Modern Woodwork & Furniture',
    trade: 'Cabinetry & Door Fitting Craftsman',
    location: 'Bompai, Kano',
    rating: 4.97,
    reviews: 52,
    jobs: 85,
    verified: true,
    experience: '12 yrs exp',
    avatar: '/images/services/carpenter_working_in_nigeria.jpg',
    recentJob: 'Solid Mahogany Office Desks',
    cardBg: 'bg-[#D97706]',
    accentPill: 'bg-[#0A1020] text-white',
  },
]

const WHO_CONNECTA_SERVES = [
  { title: 'Homeowners & Tenants', color: 'bg-[#0A1020] text-white' },
  { title: 'Business Owners & Offices', color: 'bg-[#2E1A47] text-white' },
  { title: 'Facility Managers', color: 'bg-[#4D78FF] text-white' },
  { title: 'Certified Electricians', color: 'bg-[#10B981] text-white' },
  { title: 'Phone & Device Techs', color: 'bg-[#F59E0B] text-white' },
  { title: 'Auto Mechanics & Diagnostics', color: 'bg-[#0A1020] text-white' },
  { title: 'Precision Carpenters', color: 'bg-[#8B7CFF] text-white' },
  { title: 'AC & Refrigeration Engineers', color: 'bg-[#10B981] text-white' },
  { title: 'Real Estate Landlords', color: 'bg-[#F59E0B] text-white' },
  { title: 'Borehole & Plumber Specialists', color: 'bg-[#4D78FF] text-white' },
  { title: 'Apprentices & Trade Guilds', color: 'bg-[#2E1A47] text-white' },
  { title: 'And Many More...', color: 'bg-[#064E3B] text-white' },
]

const TRUST_GUARANTEES = [
  { title: 'NIN Identity Verified', color: 'bg-[#10B981] text-white' },
  { title: 'CAC Business Registration', color: 'bg-[#2E1A47] text-white' },
  { title: 'Physical Workshop Inspection', color: 'bg-[#0A1020] text-white' },
  { title: 'Itemized Labor & Parts in Kobo', color: 'bg-[#F59E0B] text-white' },
  { title: '10MB Photo Evidence Protocol', color: 'bg-[#4D78FF] text-white' },
  { title: 'Zero Middleman Markups', color: 'bg-[#064E3B] text-white' },
  { title: 'Verified-Only Completed Reviews', color: 'bg-[#8B7CFF] text-white' },
  { title: 'Auditable Dispute Mediation', color: 'bg-[#10B981] text-white' },
  { title: 'Escrow Payment Safeguards', color: 'bg-[#D97706] text-white' },
]

const PROVIDER_BENEFITS = [
  { title: 'Zero Upfront Listing Fees', color: 'bg-[#10B981] text-white' },
  { title: 'Instant NGN Bank Payouts', color: 'bg-[#4D78FF] text-white' },
  { title: 'Direct Customer Leads', color: 'bg-[#F59E0B] text-white' },
  { title: 'Official Verified Artisan Badge', color: 'bg-[#2E1A47] text-white' },
  { title: 'In-App Photo Evidence Records', color: 'bg-[#0A1020] text-white' },
  { title: 'Trade Guild Recognition', color: 'bg-[#064E3B] text-white' },
  { title: 'Transparent Change Order Approvals', color: 'bg-[#8B7CFF] text-white' },
]

const THREE_STAGES = [
  {
    number: '01',
    title: 'Describe Your Issue & Location',
    desc: 'Tell us what needs fixing in your home, vehicle, or device. Add photos and select your urgency—emergency dispatch, today, or scheduled.',
    cardBg: 'bg-[#1E1B4B]',
    accentColor: '#10B981',
    footerMeta: 'Instant Broadcast • Kano Metropolitan',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare Itemized Quotes',
    desc: 'Eligible local technicians in Kano review your issue and submit transparent line-item estimates detailing labor, materials, and time in kobo.',
    cardBg: 'bg-[#10B981]',
    accentColor: '#FFFFFF',
    footerMeta: 'Labor + Parts in Kobo • Certified Transparent',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Verified Execution & Escrow',
    desc: 'Select the best quote. Track technician arrival, review before/after photo evidence, pay securely in NGN, and leave a verified review.',
    cardBg: 'bg-[#0A1020]',
    accentColor: '#4D78FF',
    footerMeta: 'Before & After Evidence • Verified Review',
    icon: BadgeCheck,
  },
]

const REVIEWS = [
  {
    quote:
      'My solar inverter went off unexpectedly during heavy rain. Ibrahim arrived in Nassarawa within an hour, diagnosed a blown balancer, and had our power back before sunset. Completely transparent pricing.',
    author: 'Amina Bello',
    neighborhood: 'Nassarawa GRA, Kano',
    service: 'Solar Inverter Troubleshooting',
    cardBg: 'bg-[#1E1B4B]',
    tagColor: 'bg-[#10B981] text-white',
    rating: 5,
  },
  {
    quote:
      'I had a cracked iPhone 14 Pro screen and was worried about fake replacement screens. Danbatta showed me the genuine OLED panel, transferred TrueTone, and finished in under 45 minutes.',
    author: 'Usman Farouk',
    neighborhood: 'Sabon Gari, Kano',
    service: 'Screen Replacement',
    cardBg: 'bg-[#0A1020]',
    tagColor: 'bg-[#4D78FF] text-white',
    rating: 5,
  },
  {
    quote:
      'Finding a reliable carpenter for custom office desks in Bompai was always a gamble until Connecta. Kabiru submitted an itemized quote for mahogany wood, delivered on time, and the finishing is top class.',
    author: 'Fatima Sanusi',
    neighborhood: 'Bompai Industrial, Kano',
    service: 'Custom Office Cabinetry',
    cardBg: 'bg-[#D97706]',
    tagColor: 'bg-[#0A1020] text-white',
    rating: 5,
  },
]

const FAQS = [
  {
    q: 'What is Connecta?',
    a: 'Connecta is a technology platform that connects homes and businesses with verified artisans and technicians across Nigeria. We provide transparent itemized quoting, digital job evidence, and escrow protection so you can discover, hire, and get things fixed with total peace of mind.',
  },
  {
    q: 'Does Connecta offer verified same-day repairs?',
    a: 'Yes. With local artisans stationed across metropolitan zones, emergency repairs such as plumbing pipe leaks, solar inverter faults, and phone screen replacements can typically be attended to within 45 to 60 minutes.',
  },
  {
    q: 'Will my quotes be transparent with no hidden charges?',
    a: 'Every quotation on Connecta is itemized with explicit breakdowns for labor, replacement parts, and visit fees in Nigerian Naira. If additional concealed faults are uncovered on-site, the technician must submit a formal digital Change Order with photo evidence that you approve first.',
  },
  {
    q: 'How do I sign up as a service provider on Connecta?',
    a: 'Simply click "Vendors" or "Become a Provider", submit your trade profile, experience, and upload government-issued ID (NIN, Voter Card, or CAC business certificate). Our verification team reviews submissions within 24 to 48 hours before issuing the Verified Artisan Badge.',
  },
  {
    q: 'How are artisans and technicians verified?',
    a: 'Every provider undergoes a mandatory multi-step check: government-issued identification validation, physical verification of workshop location and trade qualification, apprenticeship guarantor verification, and performance reviews before receiving the Verified Artisan Badge.',
  },
  {
    q: 'What happens if a job is not completed satisfactorily?',
    a: 'Connecta incorporates a built-in escrow payment safeguard and dispute resolution process. Both customer and technician can submit photo evidence and notes to our support team for an auditable and fair review.',
  },
]

const SEARCH_SUGGESTIONS = [
  { query: 'Solar Installation', category: 'Electrical & Solar' },
  { query: 'Solar Inverter Troubleshooting', category: 'Electrical & Solar' },
  { query: 'Screen Replacement', category: 'Phone Repair' },
  { query: 'iPhone Battery Replacement', category: 'Phone Repair' },
  { query: 'Borehole Servicing', category: 'Plumbing & Pipes' },
  { query: 'AC Cleaning & Gas Refill', category: 'AC & Cooling' },
  { query: 'Car Diagnostics & OBD2 Scan', category: 'Auto Mechanics' },
  { query: 'House Wiring & Breaker Tripping', category: 'Electrical' },
  { query: 'Water Pipe Leak Repair', category: 'Plumbing' },
  { query: 'Laptop Screen & Thermal Paste', category: 'Computer Repair' },
  { query: 'Custom Wardrobes & Furniture', category: 'Woodwork' },
  { query: 'POP Ceiling & Wall Painting', category: 'Painting & Finishing' },
  { query: 'Submersible Water Pump Fixing', category: 'Plumbing' },
  { query: 'Brake Pad Replacement', category: 'Auto Mechanics' },
  { query: 'Phone Charging Port Fix', category: 'Phone Repair' },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [selectedTradeTab, setSelectedTradeTab] = useState('all')
  const [tradeCategoryGroup, setTradeCategoryGroup] = useState<'metro' | 'workshop'>('metro')
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(0)

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

  // Chowdeck-style cycling text motion
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DYNAMIC_PHRASES.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#0A1020] selection:bg-[#4D78FF] selection:text-white">
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

          {/* Center Navigation Pill (Exact match to header.png: Company Vendors Riders Products ⌄) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-xs font-extrabold text-slate-900 bg-white/95 px-8 py-3 rounded-full shadow-md border border-slate-200/80 backdrop-blur-md">
            <Link href="#about" className="hover:text-[#0C513F] transition-colors">
              Company
            </Link>
            <Link href="/provider/register" className="hover:text-[#0C513F] transition-colors">
              Vendors
            </Link>
            <Link href="#how-it-works" className="hover:text-[#0C513F] transition-colors">
              Riders
            </Link>
            <Link href="#services" className="hover:text-[#0C513F] transition-colors flex items-center gap-1">
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </nav>

          {/* Right Group: More ⌄ & Shopping Cart Button (Exact match to header.png) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/requests/new"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 bg-white/95 px-5 py-2.5 rounded-full shadow-md border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>

            <Link
              href="/requests/new"
              className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-[#10B981] hover:text-[#0C513F] hover:scale-105 transition-all shrink-0"
              title="Cart / Request Basket"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Chowdeck-Style Large Text Motion & Alley Arrangements */}
        <section className="pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden relative">
          {/* Subtle Halftone Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0A1020 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Chowdeck-style Large Heading with Animated Text Motion */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A1020] leading-[1.08]">
                Find trusted local pros for{' '}
                <span className="inline-block relative text-[#4D78FF] transition-all duration-300 underline decoration-[#F59E0B] decoration-wavy decoration-2">
                  {DYNAMIC_PHRASES[phraseIndex]}
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                Discover vetted electricians, plumbers, repair technicians, and carpenters. Compare transparent line-item quotes and hire with confidence.
              </p>

              {/* Google-style Search Capsule with Real-time Suggestions Dropdown */}
              <div ref={searchContainerRef} className="pt-2 max-w-2xl mx-auto relative z-40">
                <div
                  className={`bg-white p-2 sm:p-2.5 transition-all duration-200 shadow-2xl border border-slate-200/90 flex items-center gap-2 ${
                    showSuggestions
                      ? 'rounded-t-3xl rounded-b-none border-b-transparent shadow-2xl'
                      : 'rounded-full'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-3 pl-4">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
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
                      placeholder="What needs fixing? (e.g. inverter fault, screen, pipe leak)"
                      className="w-full bg-transparent text-sm text-[#0A1020] placeholder:text-slate-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          setActiveSuggestionIndex(-1)
                        }}
                        className="text-slate-400 hover:text-slate-700 p-1 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <Link
                    href={`/requests/new?q=${encodeURIComponent(searchQuery)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] shrink-0 shadow-md"
                  >
                    <span>Find a Repairer</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Google Search Style Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-2xl border border-t-0 border-slate-200/90 overflow-hidden text-left z-50">
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
            </div>

            {/* Chowdeck-Style Alley Arrangement with Vision/Mission Styling */}
            <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.slice(0, 4).map((cat, idx) => (
                <div
                  key={cat.slug}
                  className={`group bg-white rounded-3xl p-3 border border-slate-200 shadow-md hover:shadow-2xl hover:border-[#4D78FF] transition-all duration-300 transform ${
                    idx % 2 === 1 ? 'md:translate-y-4' : ''
                  }`}
                >
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {cat.badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full shadow-md ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow">
                      {cat.speed}
                    </div>
                  </div>

                  <div className="p-3 pt-4">
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4 text-[#4D78FF] shrink-0 stroke-[2.5]" />
                      <h3 className="text-base font-extrabold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                    <Link
                      href={`/requests/new?category=${cat.slug}`}
                      className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-[#0A1020] group-hover:text-white text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Instant Quotes</span>
                      <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* BRAND CHARACTER & TOOLKIT SHOWCASE (ADAPTED TO VISION/MISSION)     */}
        {/* ================================================================= */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Vetted Credentials
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-[#10B981] shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Multi-Trade Standards</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Verified credentials across 8 technical artisan trades. Rigorous ID vetting, workshop checks, and trade guild recognition.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Connecta Standard</span>
                  <span className="text-[#10B981]">100% Vetted</span>
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
                  alt="Heavy Duty Mobile Diagnostics Kit"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#0A1020] text-white shadow-md border border-white/20">
                  Precision Equipment
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-amber-200 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Equipped for Every Job</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    Specialized diagnostic tools, transparent component pricing, and documented change orders with zero guesswork.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-100">
                  <span>Hardware Diagnostics</span>
                  <span>Zero Guesswork</span>
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
                  alt="Vibrant Connecta Artisan and Customer Community"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#4D78FF] text-white shadow-md">
                  Vibrant Guild
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-emerald-300 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Community of Craft</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Connecting vetted technical professionals with verified customers. Direct messaging, clear scheduling, and mutual accountability.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-emerald-200">
                  <span>Artisans & Households</span>
                  <span>Mutual Trust</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ABOUT (VISION AND MISSION & PHILOSOPHY SECTION)                   */}
        {/* ================================================================= */}
        <section id="about" className="py-20 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
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
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Core Purpose & Philosophy
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight">
                  Vision & Mission
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                What drives Connecta across Kano and Northern Nigeria.
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
                    To establish Northern Nigeria as a globally competitive hub of verified artisan talent and technical excellence, where rich cultural heritage, skilled trade mastery, and modern digital innovation power sustainable economic growth.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Connecta 2.0 Ecosystem</span>
                  <span>Kano • Northern Nigeria</span>
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
                    To empower Northern technicians, craftspeople, and service specialists through transparent digital discovery, hands-on collaboration, and direct customer connections—bridging traditional craftsmanship with cutting-edge tools to deliver effortless repairs.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Built for Artisans & Customers</span>
                  <span>100% Verified Quality</span>
                </div>
              </div>
            </div>

            {/* Core Objectives (Exact Cards from core objectives.png) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#D97706] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Cultivate Skill Excellence:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Provide practical, itemized quoting tools and evidence logs that equip technicians with industry-standard technical and business capabilities.
                </p>
              </div>

              <div className="bg-[#10B981] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Bridge Culture & Modernity:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Preserve and celebrate Northern trade mastery by integrating traditional artisan reliability into modern digital commerce and mobile platforms.
                </p>
              </div>

              <div className="bg-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Drive Sustainable Growth:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Establish transparent pricing in Naira, eliminating middlemen markups and directly connecting regional technicians with active paying households.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* WHO CONNECTA SERVES (EXACT LAYOUT FROM who to expect full section) */}
        {/* ================================================================= */}
        <section id="who-connecta-serves" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A2614] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
              {/* Halftone / Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg">
                    ↓
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    Who Connecta Serves
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                  Whether you are an emerging technician building your foundational business, an established master artisan expanding across Kano, or a property owner seeking top-tier service talent—Connecta is your platform to connect, grow, and get things fixed.
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
        {/* PLATFORM FEATURES (EXACT POST-IT MASKING TAPE LAYOUT FROM IMAGE)  */}
        {/* ================================================================= */}
        <section id="features" className="py-24 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
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
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A2614] tracking-tight">
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
                      Describe The Service You Want
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      (No Guesswork) Simply explain the fault, attach photos or short video evidence, and select your urgency—emergency dispatch, today, or scheduled.
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
                      Find The Nearest Verified Artisan
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      Connect instantly with nearby background-checked technicians within your neighborhood, minimizing travel delays and high transport fees.
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
                      Rigorous Verification System
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      Every artisan passes government NIN or CAC validation, physical workshop address inspection, apprenticeship guarantor verification, and work quality checks.
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
                      Secure Escrow & Itemized Quotes
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                      Receive transparent line-item pricing in Naira. Your payment is held safely in escrow and only released when you confirm the repair is fully completed to your satisfaction.
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
        <section id="services" className="py-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                  Explore Supported Trades
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Every trade is backed by verified identification, specialized toolkits, and transparent pricing in Nigerian Naira.
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

          {/* Chowdeck-style 4-Card Horizontal Expanding Accordion (Explore Supported Trades.png) */}
          <div className="w-full overflow-x-auto sm:overflow-visible pb-2 scrollbar-none">
            <div className="flex gap-4 sm:gap-5 items-stretch h-[480px] sm:h-[530px] min-w-[700px] sm:min-w-0 w-full transition-all duration-500 ease-in-out">
              {TRADE_ACCORDION_ITEMS[tradeCategoryGroup].map((item, idx) => {
                const isActive = activeAccordionIndex === idx
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveAccordionIndex(idx)}
                    onClick={() => setActiveAccordionIndex(idx)}
                    className={`${item.bg} border-[2px] border-black rounded-[28px] relative overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${
                      isActive
                        ? 'flex-[3.5] p-7 sm:p-10 flex flex-col justify-between shadow-2xl cursor-default'
                        : 'w-24 sm:w-28 md:w-32 shrink-0 flex flex-col items-center justify-between py-8 hover:brightness-98 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isActive ? (
                      /* ACTIVE / EXPANDED CARD VIEW (Like Restaurants in Explore Supported Trades.png) */
                      <div className="h-full flex flex-col justify-between relative z-10">
                        {/* Top Row: Icon + Guarantee Badge */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="p-1">
                            {renderAccordionTradeIcon(item.icon)}
                          </div>
                          <span className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 ${item.badgeColor}`}>
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span>{item.badge}</span>
                          </span>
                        </div>

                        {/* Middle Content: Title, Description, Tags, and Visual Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto py-2">
                          <div className="md:col-span-7 space-y-4">
                            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-lg">
                              {item.desc}
                            </p>
                            {/* Sub-Specialty Tags */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs font-bold px-3 py-1 rounded-full bg-white/75 backdrop-blur-xs border border-black/15 text-slate-800 shadow-2xs"
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

                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <span>Verified Kobo Escrow Protection</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* COLLAPSED VERTICAL CARD VIEW (Exact match to Explore Supported Trades.png) */
                      <div className="h-full flex flex-col items-center justify-between pointer-events-none">
                        {/* Top: Iconic SVG Emblem */}
                        <div className="pt-1">
                          {renderAccordionTradeIcon(item.icon)}
                        </div>

                        {/* Bottom: Rotated Vertical Typography Reading Bottom to Top */}
                        <div className="flex-1 flex items-end justify-center pb-2">
                          <span
                            className={`[writing-mode:vertical-rl] rotate-180 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight whitespace-nowrap select-none ${item.textColor}`}
                          >
                            {item.collapsedTitle}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* FEATURED VERIFIED SPECIALISTS (CLEAN TACTILE CARDS)               */}
        {/* ================================================================= */}
        <section className="py-20 lg:py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
          {/* Subtle Halftone Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Verified Local Master Artisans
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                  Featured Verified Specialists
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                Real local specialists with verified government identity, workshop locations, and proven track records in Kano.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
              {FEATURED_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-[28px] border-[2px] border-black p-5 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Artisan Photo Frame with Floating Badges */}
                    <div className="relative h-56 sm:h-60 w-full rounded-2xl overflow-hidden bg-slate-100 border border-black/10">
                      <Image
                        src={provider.avatar}
                        alt={provider.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

                      {/* Top-Left NIN Verified Pill */}
                      <div className="absolute top-3 left-3 bg-[#0C513F] text-white px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>NIN Verified</span>
                      </div>

                      {/* Top-Right Rating Pill */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-slate-900 flex items-center gap-1 shadow-md border border-white/60">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{provider.rating.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">({provider.reviews})</span>
                      </div>

                      {/* Bottom-Left Neighborhood & Jobs Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-bold">
                        <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          <span>{provider.location}</span>
                        </span>
                        <span className="bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          {provider.jobs} Jobs Done
                        </span>
                      </div>
                    </div>

                    {/* Name & Trade Title */}
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-black text-[#0A1020] tracking-tight group-hover:text-[#10B981] transition-colors">
                          {provider.name}
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {provider.experience}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#10B981]">{provider.trade}</p>
                      <p className="text-xs text-slate-500 font-medium">{provider.business}</p>
                    </div>

                    {/* Recent Verified Work Pill */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Completed Job:</div>
                      <div className="font-extrabold text-[#0A1020] truncate">{provider.recentJob}</div>
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
                    <Link
                      href={`/requests/new?providerId=${provider.id}`}
                      className="w-full py-3.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
                    >
                      <span>Request Quote from {provider.name.split(' ')[0]}</span>
                      <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                    <div className="text-[10px] font-semibold text-center text-slate-400">
                      ₦ Itemized Kobo Quoting · Safe Escrow Protection
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HOW CONNECTA WORKS (ADAPTED TO CORE OBJECTIVES CARDS LAYOUT)      */}
        {/* ================================================================= */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-[#4D78FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Clear 3-Stage Process
            </span>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                How Connecta Works
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Our 3-stage marketplace journey built around credibility, itemized quotes, and verified accountability.
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
        <section id="trust-standard" className="py-20 lg:py-28 bg-[#F4FBF7] relative overflow-hidden border-y border-emerald-100">
          {/* Halftone Dot Pattern from core objectives.png */}
          <div
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#03CF6A 2px, transparent 2px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Circle ↓ Badge */}
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-[#03CF6A] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Guaranteed Artisan Accountability
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight">
                  The Connecta Trust Standard
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Anyone can post an ad online. Connecta ensures that every provider badge reflects actual verified credentials, physical workshop audits, transparent Naira pricing, and escrow protection.
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
                      Rigorous Identity & Workshop Audits:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Every artisan undergoes mandatory multi-point screening—validating National Identification Numbers (NIN), CAC business registration certificates, trade apprenticeship guarantors, and physically inspected workshop premises across Kano metropolitan.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>NIN & CAC Verified Profile</span>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Physical Workshop Inspection Required</span>
                </div>
              </div>

              {/* Card 2: Vibrant Emerald Green (#03CF6A) */}
              <div className="bg-[#03CF6A] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.8] shrink-0" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Transparent Line-Item Quoting in Kobo:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Say goodbye to vague estimates and sudden surprises. Every quote provides an auditable breakdown of genuine parts, labor, and transport calculated in Nigerian Naira kobo minor units, with on-site change orders requiring your explicit digital sign-off.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Exact Integer Minor Units</span>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Zero Hidden Fees • Formal Change Orders</span>
                </div>
              </div>

              {/* Card 3: Royal Purple / Deep Indigo (#453478) */}
              <div className="bg-[#453478] text-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.8] shrink-0" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Protected Escrow & Photo Evidence Safeguards:
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-normal sm:font-medium leading-relaxed text-white/95">
                    Your payment is safely locked in escrow until the repair is fully inspected and approved by you. Technicians upload before-and-after photo evidence directly into the platform, ensuring auditable dispute protection and verified-only customer reviews.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Safe Escrow Milestone Release</span>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full">10MB Photo Evidence Protocol</span>
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
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-[#4D78FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Verified Feedback
            </span>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                Verified Customer Stories
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Authentic reviews tied directly to completed jobs and verified service bookings.
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
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${r.tagColor}`}>
                      {r.service}
                    </span>
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
        <section id="faq" className="py-20 bg-white border-y border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Outer Box Card matching faqs.png */}
            <div className="border-2 border-[#0A1020] rounded-3xl p-6 sm:p-10 lg:p-14 bg-white shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                {/* Left Column: FAQs. */}
                <div className="space-y-6">
                  <h2 className="text-5xl sm:text-7xl font-black text-[#0A2614] tracking-tight">
                    FAQs.
                  </h2>

                  <div className="space-y-3.5">
                    {FAQS.map((faq, index) => {
                      const isActive = (openFaq ?? 0) === index
                      return (
                        <button
                          key={index}
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
                  <div className="bg-[#F5A623] rounded-3xl p-8 sm:p-12 text-[#0A1020] shadow-xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-start relative">
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
                      <span>Verified Connecta Standard</span>
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
        <section className="py-20 bg-[#F5F7FC]">
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
                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg shrink-0">
                      ↓
                    </div>
                    <span className="text-xs font-bold text-[#10B981] bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                      For Skilled Technicians & Workshops
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Grow your trade business on Connecta.
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Join hundreds of verified electricians, mechanics, plumbers, and technicians. Receive real customer requests, send professional quotations, and build a lasting reputation.
                  </p>

                  {/* Provider Benefits Pills */}
                  <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    {PROVIDER_BENEFITS.map((b, idx) => (
                      <span
                        key={idx}
                        className={`${b.color} text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}
                      >
                        {b.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 z-10">
                  <Link
                    href="/provider/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all hover:scale-105"
                  >
                    <span>Apply as a Provider</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/admin/verification"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-bold text-white transition-colors"
                  >
                    Admin Verification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Polished Dark Footer (Vision/Mission & Chowdeck Style) */}
      <footer className="bg-[#061A12] text-white pt-16 sm:pt-24 pb-12 relative overflow-hidden border-t-2 border-[#10B981]/20">
        {/* Halftone / Dot pattern matching Vision/Mission and Who Connecta Serves */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Top Emerald Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-gradient-to-b from-[#10B981]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pre-Footer Callout Card (Tactile Vision & Mission Style) */}
          <div className="bg-[#0A2614] border-2 border-[#10B981]/30 rounded-3xl sm:rounded-[32px] p-8 sm:p-14 relative overflow-hidden shadow-2xl mb-16">
            {/* Inner Halftone Texture */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                backgroundSize: '18px 18px',
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
                    ↓
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-1 rounded-full border border-emerald-400/30">
                    Connecta 2.0 Ecosystem
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Ready to get anything fixed? <br />
                  <span className="text-[#10B981]">Find a verified artisan now.</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-xl">
                  Connecta brings accountability, itemized Naira pricing, and certified artisan talent directly to your doorstep with end-to-end escrow security.
                </p>

                {/* Trust Guarantees Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-bold text-emerald-200">
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
                    <span>NIN & CAC Verified</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
                    <span>Itemized Kobo Pricing</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
                    <span>Safe Escrow Protection</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                <Link
                  href="/requests/new"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white px-8 py-4 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Fix Something Today</span>
                  <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/provider/register"
                  className="inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 hover:border-white/40 text-white px-7 py-4 text-xs sm:text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer backdrop-blur-xs"
                >
                  <span>Join as an Artisan</span>
                  <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Metro Coverage Badges */}
          <div className="py-8 border-b border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <MapPin className="w-4 h-4 text-[#10B981]" />
              <span>Active Service Coverage Across Kano Metropolitan:</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[
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
              ].map((loc) => (
                <Link
                  key={loc}
                  href={`/requests/new?location=${encodeURIComponent(loc)}`}
                  className="group text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#10B981]/20 border border-white/10 hover:border-[#10B981]/40 text-slate-300 hover:text-white transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] group-hover:scale-125 transition-transform duration-300 ease-out" />
                  <span>{loc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 5-Column High-Contrast Modern Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14 border-b border-white/10">
            {/* Column 1: Brand & Headquarters */}
            <div className="md:col-span-2 space-y-5">
              <div className="relative w-36 h-9">
                <Image
                  src="/brand/svg/connecta-logo-white.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Connecta is Nigeria&apos;s trusted local services marketplace. Connecting homeowners, property managers, and businesses with verified artisans and technical repair specialists across Kano and Northern Nigeria.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Headquarters: Kano State, Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#4D78FF] shrink-0" />
                  <a href="mailto:support@connecta.ng" className="hover:text-emerald-400 transition-colors duration-200">
                    support@connecta.ng
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>+234 800 CONNECTA (Toll-Free Support)</span>
                </div>
              </div>

              {/* Nigerian Flag & Currency Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-slate-300 transition-colors duration-200 hover:border-emerald-500/40">
                  <span className="text-sm">🇳🇬</span>
                  <span className="font-bold">Nigeria</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-bold">₦ NGN Minor Units</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                  100% ID Vetted
                </span>
              </div>
            </div>

            {/* Column 2: Supported Trades */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <Wrench className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Service Trades</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <Link href="/requests/new?category=electrical" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Solar & Inverters</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=phone-repair" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Phone & Tablet Lab</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=ac-cooling" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">AC & Refrigeration</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=auto-mechanic" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Auto Mechanics & OBD2</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=carpentry" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Woodwork & Cabinetry</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=plumbing" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Plumbing & Boreholes</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=computer-repair" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Computer Hardware</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new?category=painting" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Painting & Screeding</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Trust */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D78FF]" />
                <span>Platform & Trust</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <Link href="#vision-mission" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Vision & Mission</span>
                  </Link>
                </li>
                <li>
                  <Link href="#who-connecta-serves" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Who Connecta Serves</span>
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">How It Works (3 Stages)</span>
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Supported Catalog</span>
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Frequently Asked Questions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/requests/new" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Broadcast Custom Need</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/verification" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Admin Verification Portal</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Providers & Governance */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>For Artisans & Guilds</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>
                  <Link href="/provider/register" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Apply as a Provider</span>
                  </Link>
                </li>
                <li>
                  <Link href="/provider/register" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">NIN & CAC Verification</span>
                  </Link>
                </li>
                <li>
                  <Link href="/brand" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Brand Identity Guidelines</span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">System Architecture</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link href="/disputes" className="group flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-out">
                    <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-200 text-sm">›</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">Dispute Resolution Policy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Chowdeck-Style Large Stylized Brand Watermark */}
          <div className="pt-8 pb-4 flex items-center justify-center select-none overflow-hidden">
            <span className="text-[13vw] font-black tracking-widest text-white/[0.035] leading-none pointer-events-none whitespace-nowrap uppercase">
              CONNECTA
            </span>
          </div>

          {/* Polished Bottom Status & Copyright Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Connecta Technologies Inc. All rights reserved.</p>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-emerald-400 font-semibold">All Systems Operational</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">Currency: NGN (₦)</span>
              <span>•</span>
              <span className="text-slate-300">Verified Marketplace</span>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-[#10B981]/20 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#10B981]/40 transition-all cursor-pointer hover:scale-105"
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
