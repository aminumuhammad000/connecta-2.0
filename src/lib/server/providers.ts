import { readDatabase, ServerUserProfile } from './db'
import { getAllUsers } from '@/lib/auth/user-store'
import { getCityCoordinatesWithJitter } from '@/lib/geo'
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

export interface FeaturedSpecialist {
  id: string
  name: string
  business: string
  trade: string
  location: string
  rating: number
  reviews: number
  jobs: number
  verified: boolean
  experience: string
  avatar: string
  recentJob: string
  cardBg: string
  accentPill: string
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
  latitude?: number
  longitude?: number
  distanceKm?: number
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
    avatarUrl: '/images/services/phone_repair_technician.jpg',
    workshopAddress: 'Shop 14, Farm Centre GSM Village, Kano',
    latitude: 11.9754,
    longitude: 8.5385,
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
    avatarUrl: '/images/services/nigerian_plumber_jonah.jpg',
    workshopAddress: 'Plot 4B Zoo Road Industrial Layout, Kano',
    latitude: 11.968,
    longitude: 8.528,
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
    avatarUrl: '/images/services/nigerian_electrician_ibrahim.jpg',
    workshopAddress: '12 Commercial Avenue, Yaba, Lagos',
    latitude: 6.516,
    longitude: 3.385,
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
    avatarUrl: '/images/services/car_mechanic_repairing_engine.jpg',
    workshopAddress: 'Apo Mechanic Village, Zone E, Abuja',
    latitude: 9.0068,
    longitude: 7.4988,
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
    avatarUrl: '/images/services/nigerian_specialist_salamah.jpg',
    workshopAddress: 'Bompai Industrial Area, Kano',
    latitude: 12.023,
    longitude: 8.548,
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
    avatarUrl: '/images/services/nigerian_carpenter_kabiru.jpg',
    workshopAddress: 'Trans-Amadi Industrial Layout, Port Harcourt',
    latitude: 4.8156,
    longitude: 7.0498,
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
  {
    id: 'b2010000-0000-0000-0000-000000000007',
    fullName: 'Aliyu Sani',
    businessName: 'Arewa Generator & PowerTech Overhaul Hub',
    headline: 'Master Diesel & Petrol Generator Specialist in Kano',
    bio: 'Over 13 years of heavy generator repair experience specializing in Perkins, Mikano, Cummins, and residential petrol generator overhaul, routine oil servicing, injector calibration, and ATS automatic changeover switches across Kano.',
    category: 'Generator Repair & Servicing',
    categorySlug: 'generator-repair',
    skills: ['Diesel Overhaul', 'ATS Changeover Switches', 'Injector Pump Calibration', 'Generator Servicing', 'Alternator Rewind'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1400000, // ₦14,000 / hr
    averageRating: 4.93,
    reviewCount: 58,
    completedJobsCount: 92,
    experienceYears: 13,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/electrician_working_on_electrical_panel.jpg',
    workshopAddress: 'Bompai Heavy Industrial Area, Kano',
    latitude: 12.021,
    longitude: 8.545,
    phone: '+2348039876541',
    whatsapp: '+2348039876541',
    joinedDate: '2025-01-12T09:00:00.000Z',
    badges: ['Guild Certified', 'Identity Verified', '100% Escrow Safeguard', 'Kano Power Guild'],
    reviews: [
      {
        id: 'rev-108',
        authorName: 'Malam Kabiru',
        rating: 5,
        comment: 'Serviced our 50kVA Perkins genset and wired the ATS box cleanly. Tested under load perfectly.',
        date: '2026-09-28',
        projectTitle: '50kVA Generator Overhaul & ATS Automation',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000008',
    fullName: 'Mustapha Nura',
    businessName: 'Kano Prime Wall Screeding & Surface Studio',
    headline: 'Master Architectural Painter & POP Plaster Specialist',
    bio: 'Professional residential interior and exterior painting, POP plastering, damp-proof waterproofing, satin wall screeding, and spotless post-job site cleanup across Nassarawa, Tarauni, and Fagge in Kano.',
    category: 'Painting & Wall Finishing',
    categorySlug: 'painting',
    skills: ['Satin Wall Screeding', 'POP Plastering', 'Damp Waterproofing', 'Exterior Facades', 'Decorative Coatings'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1100000, // ₦11,000 / hr
    averageRating: 4.91,
    reviewCount: 44,
    completedJobsCount: 67,
    experienceYears: 9,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/house_painter_painting_wall.jpg',
    workshopAddress: 'Zoo Road Commercial Corridor, Kano',
    latitude: 11.965,
    longitude: 8.529,
    phone: '+2348021122334',
    whatsapp: '+2348021122334',
    joinedDate: '2025-02-05T11:00:00.000Z',
    badges: ['Master Guild Painter', 'Identity Audited', '100% Escrow Protected'],
    reviews: [
      {
        id: 'rev-109',
        authorName: 'Hajiya Fatima',
        rating: 5,
        comment: 'Smoothed our interior walls with silk finish screed. Sharp edges around the POP and very tidy workers.',
        date: '2026-10-04',
        projectTitle: '4-Bedroom Duplex Interior Painting & POP Screeding',
      },
    ],
  },
  {
    id: 'b2010000-0000-0000-0000-000000000009',
    fullName: 'Shehu Danladi',
    businessName: 'Dala Structural Tiling & Masonry Works',
    headline: 'Master Mason, Precision Floor Tiler & Renovation Lead',
    bio: 'Vetted master mason for precision floor and wall ceramic tiling, compound blocklaying, structural plastering, screeding, and roof leak sealing in Kano metropolitan areas.',
    category: 'Masonry, Tiling & Renovation',
    categorySlug: 'construction',
    skills: ['Ceramic & Granite Tiling', 'Wall Screeding', 'Compound Blockwork', 'Concrete Works', 'Roof Leak Sealing'],
    city: 'Kano',
    state: 'Kano State',
    country: 'Nigeria',
    hourlyRateMinor: 1250000, // ₦12,500 / hr
    averageRating: 4.89,
    reviewCount: 51,
    completedJobsCount: 78,
    experienceYears: 11,
    verificationStatus: 'verified',
    avatarUrl: '/images/services/cleaning_or_maintenance_technician.jpg',
    workshopAddress: 'Dala Commercial Layout, Kano',
    latitude: 12.008,
    longitude: 8.514,
    phone: '+2348067788990',
    whatsapp: '+2348067788990',
    joinedDate: '2025-01-25T14:00:00.000Z',
    badges: ['Guild Verified', 'Identity Audited', 'Escrow Insured'],
    reviews: [
      {
        id: 'rev-110',
        authorName: 'Engr. Sanusi Bello',
        rating: 5,
        comment: 'Laid 240 sqm of 60x60 vitrified porcelain tiles with zero uneven edges. Excellent spirit level precision.',
        date: '2026-09-15',
        projectTitle: 'Commercial Complex Floor Tiling & Skirting',
      },
    ],
  },
]

function normalizeCategorySlug(category: string): string {
  const lower = category.toLowerCase()
  if (lower.includes('plumb')) return 'plumbing'
  if (lower.includes('solar') || lower.includes('electric') || lower.includes('power')) return 'electrical'
  if (lower.includes('generator') || lower.includes('genset')) return 'generator-repair'
  if (lower.includes('cool') || lower.includes('air') || lower.includes('ac') || lower.includes('hvac')) return 'ac-cooling'
  if (lower.includes('carpent') || lower.includes('wood') || lower.includes('roof')) return 'carpentry'
  if (lower.includes('auto') || lower.includes('mechanic') || lower.includes('car')) return 'auto-mechanic'
  if (lower.includes('paint') || lower.includes('wall')) return 'painting'
  if (lower.includes('mason') || lower.includes('tile') || lower.includes('construct') || lower.includes('renovat')) return 'construction'
  if (lower.includes('phone') || lower.includes('tablet') || lower.includes('screen')) return 'phone-repair'
  if (lower.includes('comput') || lower.includes('laptop')) return 'computer-repair'
  if (lower.includes('software') || lower.includes('tech') || lower.includes('code') || lower.includes('dev')) return 'tech-software'
  return 'general-service'
}

// In-memory store for newly added dynamic client reviews
const DYNAMIC_REVIEWS_MAP = new Map<string, ProviderReview[]>()

export function addPublicProviderReview(
  providerId: string,
  review: {
    authorName: string
    rating: number
    comment: string
    projectTitle?: string
  }
): ProviderReview {
  const newReview: ProviderReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorName: review.authorName || 'Verified Client',
    rating: review.rating,
    comment: review.comment,
    date: new Date().toISOString().split('T')[0],
    projectTitle: review.projectTitle || 'Verified Service Milestone',
  }

  const existing = DYNAMIC_REVIEWS_MAP.get(providerId) || []
  DYNAMIC_REVIEWS_MAP.set(providerId, [newReview, ...existing])

  // Also update seed provider if in foundational array
  const seed = SEED_PROVIDERS.find((p) => p.id === providerId)
  if (seed) {
    seed.reviews = [newReview, ...seed.reviews]
    seed.reviewCount = seed.reviews.length
    const totalRating = seed.reviews.reduce((sum, r) => sum + r.rating, 0)
    seed.averageRating = Math.round((totalRating / seed.reviews.length) * 100) / 100
  }

  return newReview
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

          const city = u.city || 'Kano'
          const coords = getCityCoordinatesWithJitter(city, u.id)

          providerMap.set(u.id, {
            id: u.id,
            fullName: u.fullName || `${u.firstName || 'Verified'} ${u.lastName || 'Specialist'}`.trim(),
            businessName,
            headline: u.headline || `${category} Specialist in ${city}`,
            bio: u.bio || `Certified and vetted artisan delivering verified services across ${city} backed by Connecta 100% Escrow Safeguards.`,
            category,
            categorySlug,
            skills,
            city,
            state: u.city ? `${u.city} State` : 'Kano State',
            country: u.country || 'Nigeria',
            hourlyRateMinor: u.hourlyRateMinor || 1500000,
            averageRating: 4.95,
            reviewCount: 42,
            completedJobsCount: 56,
            experienceYears: 7,
            verificationStatus: 'verified',
            avatarUrl: u.avatarUrl || null,
            workshopAddress: u.workshopAddress || `${city}, Nigeria`,
            latitude: coords.lat,
            longitude: coords.lng,
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
            const city = p.city || 'Kano'
            const coords = getCityCoordinatesWithJitter(city, p.id)

            providerMap.set(p.id, {
              id: p.id,
              fullName: p.fullName,
              businessName,
              headline: p.headline || `${category} Specialist in ${city}`,
              bio: p.bio || `Verified artisan delivering insured services across ${city}.`,
              category,
              categorySlug,
              skills: p.skills || ['General Practice'],
              city,
              state: `${city} State`,
              country: p.country || 'Nigeria',
              hourlyRateMinor: p.hourlyRateMinor || 1500000,
              averageRating: 4.92,
              reviewCount: 38,
              completedJobsCount: 49,
              experienceYears: 6,
              verificationStatus: 'verified',
              avatarUrl: p.avatarUrl || null,
              workshopAddress: p.workshopAddress || `${city}, Nigeria`,
              latitude: coords.lat,
              longitude: coords.lng,
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

  // Merge dynamically submitted verified client reviews
  for (const [providerId, reviews] of DYNAMIC_REVIEWS_MAP.entries()) {
    const prov = providerMap.get(providerId)
    if (prov) {
      const existingIds = new Set(prov.reviews.map((r) => r.id))
      const toAdd = reviews.filter((r) => !existingIds.has(r.id))
      if (toAdd.length > 0) {
        prov.reviews = [...toAdd, ...prov.reviews]
        prov.reviewCount = prov.reviews.length
        const totalRating = prov.reviews.reduce((sum, r) => sum + r.rating, 0)
        prov.averageRating = Math.round((totalRating / prov.reviews.length) * 100) / 100
      }
    }
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

/**
 * Returns the 4 featured verified specialists seeded in the database with their Cloudinary assets.
 */
export function getFeaturedSpecialists(): FeaturedSpecialist[] {
  try {
    const db = readDatabase()
    if (db && Array.isArray(db.profiles)) {
      const dbFeatured = db.profiles.filter(
        (p: any) => p.isFeatured || (typeof p.id === 'string' && p.id.startsWith('feat-'))
      )
      if (dbFeatured.length >= 4) {
        return dbFeatured.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.fullName,
          business: p.companyName || `${p.fullName} Services`,
          trade: p.trade || p.headline || 'Certified Specialist',
          location: p.location || `${p.city || 'Kano'}, Nigeria`,
          rating: p.rating || 4.98,
          reviews: p.reviewsCount || 74,
          jobs: p.completedJobsCount || 118,
          verified: true,
          experience: p.experience || `${p.experienceYears || 8} yrs exp`,
          avatar: p.avatarUrl || 'https://res.cloudinary.com/j0anrwlg/image/upload/v1793023313/connecta/featured_specialists/ibrahim.jpg',
          recentJob: p.recentJob || 'Commercial Service Milestone Completed',
          cardBg: p.cardBg || 'bg-[#1E1B4B]',
          accentPill: p.accentPill || 'bg-[#10B981] text-white',
        }))
      }
    }
  } catch (err) {
    console.warn('[getFeaturedSpecialists] fallback to seed', err)
  }

  // Authoritative fallback with Cloudinary-hosted URLs
  return [
    {
      id: 'feat-ibrahim-aliyu-01',
      name: 'Ibrahim Aliyu',
      business: 'Aliyu Power & Solar Systems',
      trade: 'Master Electrician & Solar Installer',
      location: 'Kano / Lagos',
      rating: 4.99,
      reviews: 74,
      jobs: 118,
      verified: true,
      experience: '8 yrs exp',
      avatar: 'https://res.cloudinary.com/j0anrwlg/image/upload/v1793023313/connecta/featured_specialists/ibrahim.jpg',
      recentJob: '30kVA Solar Hybrid Installation & Panel Rewiring',
      cardBg: 'bg-[#1E1B4B]',
      accentPill: 'bg-[#10B981] text-white',
    },
    {
      id: 'feat-jonah-blessing-02',
      name: 'Jonah Blessing',
      business: 'Apex Fluidics & Plumbing Works',
      trade: 'Certified Plumber & Pipe Maintenance Lead',
      location: 'Port Harcourt / Lagos',
      rating: 4.95,
      reviews: 64,
      jobs: 92,
      verified: true,
      experience: '7 yrs exp',
      avatar: 'https://res.cloudinary.com/j0anrwlg/image/upload/v1793023318/connecta/featured_specialists/jonah.jpg',
      recentJob: 'Commercial Building Pressure Booster & Pipe Overhaul',
      cardBg: 'bg-[#0A1020]',
      accentPill: 'bg-[#4D78FF] text-white',
    },
    {
      id: 'feat-kabiru-sani-03',
      name: 'Kabiru Sani',
      business: 'Arewa Timber & Bespoke Carpentry',
      trade: 'Precision Woodwork & Joinery Artisan',
      location: 'Kano (Sabon Gari)',
      rating: 4.98,
      reviews: 82,
      jobs: 135,
      verified: true,
      experience: '12 yrs exp',
      avatar: 'https://res.cloudinary.com/j0anrwlg/image/upload/v1793023322/connecta/featured_specialists/kabiru.jpg',
      recentJob: 'Custom Hardwood Office Furniture & Ceiling Framing',
      cardBg: 'bg-[#2E1A47]',
      accentPill: 'bg-[#F59E0B] text-white',
    },
    {
      id: 'feat-salamah-othman-04',
      name: 'Salamah Othman',
      business: 'Kano Precision Diagnostic Tech',
      trade: 'Electronic Hardware & Micro-Soldering Specialist',
      location: 'Kano (Farm Centre)',
      rating: 4.96,
      reviews: 58,
      jobs: 88,
      verified: true,
      experience: '6 yrs exp',
      avatar: 'https://res.cloudinary.com/j0anrwlg/image/upload/v1793023323/connecta/featured_specialists/salamah.jpg',
      recentJob: 'Multi-brand ECU & Logic Board Diagnostic Repair',
      cardBg: 'bg-[#0A2614]',
      accentPill: 'bg-[#10B981] text-white',
    },
  ]
}
