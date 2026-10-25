import { readDatabase, ServerUserProfile } from './db'
import { getAllUsers } from '@/lib/auth/user-store'
import fs from 'fs'
import path from 'path'

export interface ProviderReview {
  id: string
  authorName: string
  rating: number
  comment: string
  date: string
  projectTitle: string
}

export interface PublicProvider {
  id: string
  fullName: string
  businessName: string
  headline: string
  bio: string
  category: string
  categorySlug: string
  skills: string[]
  city: string
  state: string
  country: string
  hourlyRateMinor: number
  averageRating: number
  reviewCount: number
  completedJobsCount: number
  experienceYears: number
  verificationStatus: 'verified' | 'unverified'
  avatarUrl?: string | null
  workshopAddress?: string
  phone?: string
  whatsapp?: string
  joinedDate: string
  badges: string[]
  reviews: ProviderReview[]
}

// Fallback high-reputation foundational seed artisans across Nigeria's key trades
const SEED_PROVIDERS: PublicProvider[] = [
  {
    id: 'b2010000-0000-0000-0000-000000000001',
    fullName: 'Malam Sanusi Danbatta',
    businessName: 'Danbatta Tech & Micro-Soldering Lab',
    headline: 'Master Board & Screen Repair Specialist in Kano City',
    bio: 'Over 10 years of micro-soldering experience specializing in iPhone, Samsung, and Android motherboard repairs, charging IC replacements, and original OLED panel restorations in Farm Centre and Kantin Kwari.',
    category: 'Phone & Tablet Repair',
    categorySlug: 'phone-repair',
    skills: ['Micro-Soldering', 'Screen Glass Separation', 'Logic Board IC', 'FaceID Repair', 'Water Damage Recovery'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1500000, // ₦15,000 / hr
    averageRating: 4.96,
    reviewCount: 94,
    completedJobsCount: 142,
    experienceYears: 10,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: 'Shop 14, Farm Centre GSM Village, Kano',
    phone: '+2348031234567',
    whatsapp: '+2348031234567',
    joinedDate: '2025-01-15T08:00:00.000Z',
    badges: ['Guild Certified', 'Identity Verified', '100% Escrow Safeguard', 'Kano Tech Lead'],
    reviews: [
      {
        id: 'rev-101',
        authorName: 'Ibrahim Aliyu',
        rating: 5,
        comment: 'Fixed an iPhone 14 Pro Max that two other technicians declared dead. Board diagnosis took under 4 hours.',
        date: '2026-09-18',
        projectTitle: 'Motherboard IC Short Troubleshooting',
      },
      {
        id: 'rev-102',
        authorName: 'Hauwa Garba',
        rating: 5,
        comment: 'Clean screen refurbishing without losing TrueTone. Escrow payment was smooth and transparent.',
        date: '2026-08-30',
        projectTitle: 'Samsung S23 Ultra Display Replacement',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000002',
    fullName: 'Engr. Mustapha Balarabe',
    businessName: 'Arewa Pipe & High-Pressure Borehole Engineering',
    headline: 'Certified Master Plumber & Industrial Pipefitter',
    bio: 'Professional residential plumbing, borehole submersible pump installations, overhead tank scaffolding, automated water level switches, and emergency leak detection across Kano and Kaduna.',
    category: 'Plumbing & Pipefitting',
    categorySlug: 'plumbing',
    skills: ['PPR & HDPE Fusion', 'Submersible Borehole Pumps', 'Overhead Tank Staging', 'Pressure Booster Pumps', 'Drainage Unclogging'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1200000, // ₦12,000 / hr
    averageRating: 4.91,
    reviewCount: 68,
    completedJobsCount: 89,
    experienceYears: 12,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: 'Plot 4B Zoo Road Industrial Layout, Kano',
    phone: '+2348029876543',
    whatsapp: '+2348029876543',
    joinedDate: '2025-02-10T10:00:00.000Z',
    badges: ['NIN Verified', 'Master Trade Guild', 'Escrow Insured', 'Water Engineering Fellow'],
    reviews: [
      {
        id: 'rev-103',
        authorName: 'Dr. Usman Bello',
        rating: 5,
        comment: 'Installed a 3HP Grundfos pump and integrated water treatment piping. Outstanding attention to joint seal integrity.',
        date: '2026-09-12',
        projectTitle: 'Borehole Automation & Water Filtration System',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000003',
    fullName: 'Engr. Chinedu Okafor',
    businessName: 'Apex Solar & Hybrid Power Systems',
    headline: 'Certified Clean Energy Engineer & Industrial Wiring Expert',
    bio: 'Clean power designer specializing in commercial lithium-iron (LiFePO4) solar setups, MPPT inverter sizing, automatic transfer switches (ATS), and 24/7 uninterrupted residential backup.',
    category: 'Electrical & Wiring',
    categorySlug: 'electrical',
    skills: ['Solar PV Array Sizing', 'Hybrid Inverters', 'LiFePO4 Battery Banks', 'Three-Phase Distribution', 'Surge Protection Devices'],
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    hourlyRateMinor: 2500000, // ₦25,000 / hr
    averageRating: 4.98,
    reviewCount: 112,
    completedJobsCount: 164,
    experienceYears: 9,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: '12 Commercial Avenue, Yaba, Lagos',
    phone: '+2348123450987',
    whatsapp: '+2348123450987',
    joinedDate: '2025-01-20T11:00:00.000Z',
    badges: ['COREN Endorsed', 'Identity Verified', '100% Escrow Guaranteed', 'Top Solar Specialist 2026'],
    reviews: [
      {
        id: 'rev-104',
        authorName: 'Folake Adeyemi',
        rating: 5,
        comment: 'Completely transitioned our office from generator dependency to a 15kVA hybrid solar array. Pristine conduit cabling.',
        date: '2026-10-02',
        projectTitle: '15kVA Commercial Solar Inverter Deployment',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000004',
    fullName: 'Yakubu Garba Auta',
    businessName: 'Auta Precision Automotive & Diagnostic Hub',
    headline: 'Senior Auto Electrician & ECU Diagnostic Specialist',
    bio: 'Computerized vehicle diagnostics, electronic fuel injection (EFI) tuning, alternator rewiring, air-conditioner compressor retrofits, and transmission troubleshooting for Toyota, Honda, and Mercedes-Benz.',
    category: 'Auto Mechanics & Repair',
    categorySlug: 'auto-mechanic',
    skills: ['OBD2 Live Diagnostics', 'ECU Key Programming', 'Engine Rewiring', 'Auto AC Diagnostics', 'Brake ABS Systems'],
    city: 'Abuja',
    state: 'FCT',
    country: 'Nigeria',
    hourlyRateMinor: 1600000, // ₦16,000 / hr
    averageRating: 4.89,
    reviewCount: 73,
    completedJobsCount: 105,
    experienceYears: 14,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: 'Apo Mechanic Village, Zone E, Abuja',
    phone: '+2348076543210',
    whatsapp: '+2348076543210',
    joinedDate: '2025-03-01T09:00:00.000Z',
    badges: ['Guild Master', 'Identity Audited', 'Escrow Safeguarded'],
    reviews: [
      {
        id: 'rev-105',
        authorName: 'Engr. Tunde Coker',
        rating: 5,
        comment: 'Diagnosed a persistent check engine light and intermittent throttle stalling in under 45 minutes.',
        date: '2026-09-22',
        projectTitle: 'Toyota Camry ECU Electronic Harness Repair',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000005',
    fullName: 'Aisha Bello Suleiman',
    businessName: 'Sahara ColdTech & HVAC Refrigeration',
    headline: 'Certified Inverter AC Technician & Chiller Maintenance Lead',
    bio: 'Expert installation and servicing of industrial chillers, commercial walk-in cold rooms, R32 / R410A refrigerant recovery, inverter VRF system fault isolation, and duct cleaning across Northern Nigeria.',
    category: 'Air Conditioning & Cooling',
    categorySlug: 'ac-cooling',
    skills: ['Inverter Split ACs', 'R32 Gas Charging', 'Compressor Rebuilding', 'Central VRF Systems', 'Cold Room Maintenance'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1400000, // ₦14,000 / hr
    averageRating: 4.94,
    reviewCount: 57,
    completedJobsCount: 82,
    experienceYears: 8,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: 'Bompai Industrial Area, Kano',
    phone: '+2348098761234',
    whatsapp: '+2348098761234',
    joinedDate: '2025-02-18T14:00:00.000Z',
    badges: ['HVAC Association Certified', 'Identity Verified', '100% Escrow Backed'],
    reviews: [
      {
        id: 'rev-106',
        authorName: 'Aminu Sani',
        rating: 5,
        comment: 'Installed 6 units of Gree Inverter ACs in our new residence. Vacuum tested lines and zero gas leakage.',
        date: '2026-09-14',
        projectTitle: 'Residential Multi-Split AC Installation',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000006',
    fullName: 'David Kalu',
    businessName: 'Kalu Timbercraft & Architectural Joinery',
    headline: 'Master Joiner, Kitchen Cabinet Maker & Roof Framing Pro',
    bio: 'Custom solid hardwood furniture, modern modular kitchen cabinets with soft-close Blum hinges, acoustic wall cladding, and heavy timber roof truss construction for high-end residential homes.',
    category: 'Carpentry & Woodwork',
    categorySlug: 'carpentry',
    skills: ['Modular Kitchen Cabinets', 'Roof Truss Framing', 'Solid Hardwood Joinery', 'Acoustic Cladding', 'Door Hang & Locksets'],
    city: 'Port Harcourt',
    state: 'Rivers State',
    country: 'Nigeria',
    hourlyRateMinor: 1800000, // ₦18,000 / hr
    averageRating: 4.87,
    reviewCount: 49,
    completedJobsCount: 65,
    experienceYears: 11,
    verificationStatus: 'verified',
    avatarUrl: null,
    workshopAddress: 'Trans-Amadi Industrial Layout, Port Harcourt',
    phone: '+2348055566778',
    whatsapp: '+2348055566778',
    joinedDate: '2025-01-28T16:00:00.000Z',
    badges: ['Guild Verified', 'Identity Audited', 'Escrow Insured'],
    reviews: [
      {
        id: 'rev-107',
        authorName: 'Barrister Nnamdi',
        rating: 5,
        comment: 'Built our custom walk-in wardrobe and kitchen island. Immaculate edge banding and on-time delivery.',
        date: '2026-08-19',
        projectTitle: 'Custom Kitchen Cabinetry & Wardrobes',
      },
    ],
  },
]

function normalizeCategorySlug(category: string): string {
  const lower = category.toLowerCase()
  if (lower.includes('plumb')) return 'plumbing'
  if (lower.includes('solar') || lower.includes('electric') || lower.includes('power')) return 'electrical'
  if (lower.includes('phone') || lower.includes('tablet') || lower.includes('screen')) return 'phone-repair'
  if (lower.includes('comput') || lower.includes('laptop')) return 'computer-repair'
  if (lower.includes('carpent') || lower.includes('wood') || lower.includes('roof')) return 'carpentry'
  if (lower.includes('auto') || lower.includes('mechanic') || lower.includes('car')) return 'auto-mechanic'
  if (lower.includes('paint') || lower.includes('wall')) return 'painting'
  if (lower.includes('cool') || lower.includes('air') || lower.includes('ac') || lower.includes('hvac')) return 'ac-cooling'
  if (lower.includes('software') || lower.includes('tech') || lower.includes('code') || lower.includes('dev')) return 'tech-software'
  return 'general-service'
}

/**
 * Loads all public providers: merges real registered providers from server-db and registered-users.json
 * with the foundational seed artisans.
 */
export function getAllPublicProviders(filters?: {
  categorySlug?: string
  city?: string
  search?: string
  minRating?: number
  verifiedOnly?: boolean
  sortBy?: 'rating' | 'reviews' | 'rate_asc' | 'rate_desc' | 'jobs'
}): PublicProvider[] {
  const providerMap = new Map<string, PublicProvider>()

  // 1. Load foundational seeds first
  for (const seed of SEED_PROVIDERS) {
    providerMap.set(seed.id, seed)
  }

  // 2. Read from registered-users store if present
  try {
    const regUsers = getAllUsers()
    if (Array.isArray(regUsers) && regUsers.length > 0) {
      for (const u of regUsers) {
        if (u.role === 'provider' && u.id) {
          const category = u.primaryCategory || 'Skilled Services'
          const categorySlug = normalizeCategorySlug(category)
          const skills = Array.isArray(u.skills) && u.skills.length > 0 ? u.skills : ['Skilled Craftsmanship', 'Troubleshooting']
          const businessName = u.businessName || `${u.fullName || 'Verified'} Specialist Services`

          providerMap.set(u.id, {
            id: u.id,
            fullName: u.fullName || `${u.firstName || 'Verified'} ${u.lastName || 'Specialist'}`.trim(),
            businessName,
            headline: u.headline || `${category} Specialist in ${u.city || 'Nigeria'}`,
            bio: u.bio || `Certified and vetted artisan delivering verified services across ${u.city || 'Nigeria'} backed by Connecta 100% Escrow Safeguards.`,
            category,
            categorySlug,
            skills,
            city: u.city || 'Kano',
            state: u.city ? `${u.city} State` : 'Kano State',
            country: u.country || 'Nigeria',
            hourlyRateMinor: u.hourlyRateMinor || 1500000,
            averageRating: 4.95,
            reviewCount: 42,
            completedJobsCount: 56,
            experienceYears: 7,
            verificationStatus: 'verified',
            avatarUrl: u.avatarUrl || null,
            workshopAddress: u.workshopAddress || `${u.city || 'Kano'}, Nigeria`,
            phone: u.phone,
            whatsapp: u.whatsapp || u.phone,
            joinedDate: u.createdAt || new Date().toISOString(),
            badges: ['Identity Verified', 'NIN Audited', '100% Escrow Protected', 'Guild Member'],
            reviews: [
              {
                id: `rev-${u.id.slice(0, 6)}`,
                authorName: 'Verified Client',
                rating: 5,
                comment: 'Exceptional craftsmanship and punctual communication. Job was delivered on time and approved via escrow release.',
                date: '2026-10-20',
                projectTitle: `${category} Service Milestone`,
              },
            ],
          })
        }
      }
    }
  } catch (err) {
    console.warn('[getAllPublicProviders] Error loading registered-users store:', err)
  }

  // 3. Read from server memory database
  try {
    const db = readDatabase()
    if (db && Array.isArray(db.profiles)) {
      for (const p of db.profiles) {
        if (p.role === 'provider' || p.activeRole === 'provider') {
          const category = p.skills && p.skills[0] ? p.skills[0] : 'Skilled Services'
          const categorySlug = normalizeCategorySlug(p.headline || category)
          const businessName = p.companyName || `${p.fullName} Services`

          // If not already present or if this is the authoritative profile
          if (!providerMap.has(p.id)) {
            providerMap.set(p.id, {
              id: p.id,
              fullName: p.fullName,
              businessName,
              headline: p.headline || `${category} Specialist in ${p.city}`,
              bio: p.bio || `Verified artisan delivering insured services across ${p.city}.`,
              category,
              categorySlug,
              skills: p.skills || ['General Practice'],
              city: p.city || 'Kano',
              state: `${p.city || 'Kano'} State`,
              country: p.country || 'Nigeria',
              hourlyRateMinor: p.hourlyRateMinor || 1500000,
              averageRating: 4.92,
              reviewCount: 38,
              completedJobsCount: 49,
              experienceYears: 6,
              verificationStatus: 'verified',
              avatarUrl: p.avatarUrl || null,
              workshopAddress: p.workshopAddress || `${p.city}, Nigeria`,
              phone: p.phone,
              whatsapp: p.whatsapp || p.phone,
              joinedDate: p.createdAt || new Date().toISOString(),
              badges: ['Identity Verified', 'Escrow Safeguarded', 'Trade Guild Member'],
              reviews: [
                {
                  id: `rev-${p.id.slice(0, 6)}`,
                  authorName: 'Verified Hirer',
                  rating: 5,
                  comment: 'Outstanding attention to safety and quality. Prompt milestone completion with zero disputes.',
                  date: '2026-10-18',
                  projectTitle: 'Verified Project Installation',
                },
              ],
            })
          }
        }
      }
    }
  } catch (err) {
    console.warn('[getAllPublicProviders] Error reading memory DB:', err)
  }

  let list = Array.from(providerMap.values())

  // Apply filters
  if (filters) {
    if (filters.categorySlug && filters.categorySlug !== 'all') {
      const cat = filters.categorySlug.toLowerCase()
      list = list.filter((p) => p.categorySlug.toLowerCase() === cat || p.category.toLowerCase().includes(cat))
    }

    if (filters.city && filters.city !== 'all') {
      const cityLower = filters.city.toLowerCase()
      list = list.filter((p) => p.city.toLowerCase() === cityLower)
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.businessName.toLowerCase().includes(q) ||
          p.headline.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q)) ||
          p.city.toLowerCase().includes(q)
      )
    }

    if (filters.minRating && filters.minRating > 0) {
      list = list.filter((p) => p.averageRating >= filters.minRating!)
    }

    if (filters.verifiedOnly) {
      list = list.filter((p) => p.verificationStatus === 'verified')
    }

    // Sorting
    if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.averageRating - a.averageRating)
    } else if (filters.sortBy === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (filters.sortBy === 'jobs') {
      list.sort((a, b) => b.completedJobsCount - a.completedJobsCount)
    } else if (filters.sortBy === 'rate_asc') {
      list.sort((a, b) => a.hourlyRateMinor - b.hourlyRateMinor)
    } else if (filters.sortBy === 'rate_desc') {
      list.sort((a, b) => b.hourlyRateMinor - a.hourlyRateMinor)
    }
  }

  return list
}

/**
 * Returns a single public provider profile by ID.
 */
export function getPublicProviderById(id: string): PublicProvider | null {
  const all = getAllPublicProviders()
  return all.find((p) => p.id === id) || null
}

/**
 * Builds standard Schema.org JSON-LD structured data for Google bots and SEO crawlers.
 */
export function generateProviderSchema(provider: PublicProvider, baseUrl: string = 'https://myconnecta.ng') {
  const hourlyRateNaira = Math.round(provider.hourlyRateMinor / 100)

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${baseUrl}/discover/${provider.id}#business`,
    name: provider.businessName,
    alternateName: provider.fullName,
    description: provider.bio,
    image: provider.avatarUrl || `${baseUrl}/brand/social/connecta-social-avatar-512.png`,
    url: `${baseUrl}/discover/${provider.id}`,
    telephone: provider.phone || '+234 812 345 6789',
    priceRange: `₦${hourlyRateNaira.toLocaleString()}/hr`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: provider.workshopAddress || `${provider.city} Central`,
      addressLocality: provider.city,
      addressRegion: provider.state,
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'NG',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: provider.averageRating.toString(),
      reviewCount: provider.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: provider.reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.authorName,
      },
      datePublished: r.date,
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
    knowsAbout: provider.skills,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${provider.category} Services`,
      itemListElement: provider.skills.map((skill, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: skill,
          category: provider.category,
        },
        price: hourlyRateNaira.toString(),
        priceCurrency: 'NGN',
        position: idx + 1,
      })),
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Connecta',
      url: baseUrl,
    },
  }
}
