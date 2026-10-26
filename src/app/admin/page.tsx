import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import AdminClientView from './AdminClientView'
import { readDatabase } from '@/lib/server/db'
import { getAllUsers } from '@/lib/auth/user-store'
import { getAllPublicProviders } from '@/lib/server/providers'

export const metadata: Metadata = {
  title: 'Admin Command Center | Connecta Local Services Kano',
  description:
    'Internal operations, verification queues, service request monitoring, and milestone escrow management for Connecta.',
  robots: {
    index: false,
    follow: false,
  },
}

// Fallback seed cases for verification queue
const INITIAL_VERIFICATION_CASES = [
  {
    id: 'vc-101',
    providerName: 'Malam Sanusi Danbatta',
    businessName: 'Danbatta Tech & Micro-Soldering Lab',
    trade: 'Electrical & Appliance Repair',
    city: 'Kano (Farm Centre)',
    status: 'under_review' as const,
    submittedAt: '2026-10-24 14:30',
    documentType: 'National Identification Number (NIN) Slip',
    documentNumber: 'NIN-92817349102',
    yearsOfExperience: 10,
  },
  {
    id: 'vc-102',
    providerName: 'Engr. Mustapha Balarabe',
    businessName: 'Arewa Pipe & High-Pressure Borehole Engineering',
    trade: 'Plumbing & Pipefitting',
    city: 'Kano (Zoo Road)',
    status: 'under_review' as const,
    submittedAt: '2026-10-24 16:15',
    documentType: 'CAC Certificate of Business Registration',
    documentNumber: 'RC-1849204',
    yearsOfExperience: 12,
  },
  {
    id: 'vc-103',
    providerName: 'Aliyu Sani',
    businessName: 'Arewa Generator & PowerTech Overhaul Hub',
    trade: 'Generator Repair & Servicing',
    city: 'Kano (Bompai Heavy Industrial)',
    status: 'approved' as const,
    submittedAt: '2026-10-23 11:20',
    documentType: 'Trade Guild Master Craftsman License',
    documentNumber: 'KANO-GEN-2024-88',
    yearsOfExperience: 13,
  },
  {
    id: 'vc-104',
    providerName: 'Aisha Bello Suleiman',
    businessName: 'Sahara ColdTech & HVAC Refrigeration',
    trade: 'Air Conditioning & Cooling',
    city: 'Kano (Bompai)',
    status: 'under_review' as const,
    submittedAt: '2026-10-25 09:45',
    documentType: 'HVAC Association Certified License',
    documentNumber: 'HVAC-NG-4482',
    yearsOfExperience: 8,
  },
]

const SEED_SERVICE_REQUESTS = [
  {
    id: 'req-201',
    customerId: 'cust-101',
    customerName: 'Hajiya Amina Bello',
    customerCompany: 'Bello Residences',
    title: 'Emergency Burst Water Pipe Repair & Pressure Valve Fitting',
    category: 'Plumbing & Pipes',
    categorySlug: 'plumbing',
    description: 'Main inflow pipe leaking behind the bathroom wall, needing immediate PPR pipe welding and pressure balance valve.',
    urgency: 'emergency' as const,
    serviceMode: 'onsite' as const,
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 2500000,
    budgetMaxMinor: 4500000,
    currency: 'NGN',
    status: 'open' as const,
    requiredSkills: ['PPR Pipe Welding', 'Leak Detection', 'Pressure Valves'],
    proposalsCount: 3,
    createdAt: '2026-10-26T08:30:00.000Z',
  },
  {
    id: 'req-202',
    customerId: 'cust-102',
    customerName: 'Alhaji Umar Faruk',
    customerCompany: 'Faruk Logistics Hub',
    title: '15kVA Commercial Solar Inverter & LiFePO4 Battery Installation',
    category: 'Electrical & Solar',
    categorySlug: 'electrical',
    description: 'Full three-phase distribution box integration with automated changeover switch for warehouse depot.',
    urgency: 'scheduled' as const,
    serviceMode: 'onsite' as const,
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 15000000,
    budgetMaxMinor: 25000000,
    currency: 'NGN',
    status: 'matching' as const,
    requiredSkills: ['Three-Phase Solar', 'Inverter Sizing', 'ATS Switches'],
    proposalsCount: 5,
    createdAt: '2026-10-25T14:15:00.000Z',
  },
  {
    id: 'req-203',
    customerId: 'cust-103',
    customerName: 'Dr. Mansur Ibrahim',
    customerCompany: 'Prime Dental Clinic',
    title: 'Inverter Split AC Deep Chemical Cleaning & Gas Recharge',
    category: 'AC & Refrigeration',
    categorySlug: 'ac-cooling',
    description: 'Four units of Panasonic Inverter ACs blowing warm air. Need coil deep flush and R410A refrigerant recharge.',
    urgency: 'today' as const,
    serviceMode: 'onsite' as const,
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 4000000,
    budgetMaxMinor: 6500000,
    currency: 'NGN',
    status: 'booked' as const,
    requiredSkills: ['R410A Refrigerant', 'Coil Cleaning', 'Inverter PCB Check'],
    proposalsCount: 2,
    createdAt: '2026-10-25T11:00:00.000Z',
  },
  {
    id: 'req-204',
    customerId: 'cust-104',
    customerName: 'Barrister Nura Danladi',
    customerCompany: 'Danladi & Co Chambers',
    title: 'Hardwood Executive Desk & Fitted Law Library Shelving',
    category: 'Carpentry & Woodwork',
    categorySlug: 'carpentry',
    description: 'Custom mahogany timber bookcases with concealed LED channel lighting and matching 8-foot conference table.',
    urgency: 'scheduled' as const,
    serviceMode: 'onsite' as const,
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 25000000,
    budgetMaxMinor: 45000000,
    currency: 'NGN',
    status: 'open' as const,
    requiredSkills: ['Hardwood Joinery', 'Bookcase Framing', 'Timber Sanding'],
    proposalsCount: 4,
    createdAt: '2026-10-24T16:45:00.000Z',
  },
]

const SEED_BOOKINGS = [
  {
    id: 'bk-501',
    bookingNumber: 'CON-2026-0081',
    customerId: 'cust-101',
    clientName: 'Hajiya Amina Bello',
    clientCompany: 'Bello Residences',
    providerId: 'b2010000-0000-0000-0000-000000000002',
    providerName: 'Engr. Mustapha Balarabe',
    providerTitle: 'Certified Master Plumber',
    title: 'Borehole Submersible Pump Overhaul & Float Switch Automation',
    category: 'Plumbing & Pipes',
    location: 'Zoo Road GRA, Kano',
    totalAmountMinor: 12000000,
    currency: 'NGN',
    escrowStatus: 'locked' as const,
    bookingStatus: 'in_progress' as const,
    progressPercentage: 65,
    appointmentDate: '2026-10-27',
    milestones: [
      { id: 'm-1', title: 'Pump Pulling & Motor Diagnostics', amountMinor: 4000000, status: 'completed' as const },
      { id: 'm-2', title: 'Submersible Impeller Replacement & Cable Rewind', amountMinor: 5000000, status: 'current' as const },
      { id: 'm-3', title: 'Water Tank Float Sensor Calibration & Final Test', amountMinor: 3000000, status: 'pending' as const },
    ],
    createdAt: '2026-10-24T10:00:00.000Z',
  },
  {
    id: 'bk-502',
    bookingNumber: 'CON-2026-0082',
    customerId: 'cust-102',
    clientName: 'Alhaji Umar Faruk',
    clientCompany: 'Faruk Logistics Hub',
    providerId: 'b2010000-0000-0000-0000-000000000007',
    providerName: 'Aliyu Sani',
    providerTitle: 'Master Diesel Generator Specialist',
    title: '50kVA Perkins Diesel Overhaul & ATS Synchronisation',
    category: 'Generator Repair',
    location: 'Bompai Heavy Industrial, Kano',
    totalAmountMinor: 35000000,
    currency: 'NGN',
    escrowStatus: 'locked' as const,
    bookingStatus: 'in_progress' as const,
    progressPercentage: 40,
    appointmentDate: '2026-10-28',
    milestones: [
      { id: 'm-4', title: 'Cylinder Head Gasket & Injector Service', amountMinor: 15000000, status: 'completed' as const },
      { id: 'm-5', title: 'ATS Contactor & Phase Relays Rewiring', amountMinor: 12000000, status: 'current' as const },
      { id: 'm-6', title: 'Full Load Bank Test (40kW Endurance)', amountMinor: 8000000, status: 'pending' as const },
    ],
    createdAt: '2026-10-23T15:30:00.000Z',
  },
  {
    id: 'bk-503',
    bookingNumber: 'CON-2026-0079',
    customerId: 'cust-103',
    clientName: 'Dr. Mansur Ibrahim',
    clientCompany: 'Prime Dental Clinic',
    providerId: 'b2010000-0000-0000-0000-000000000005',
    providerName: 'Aisha Bello Suleiman',
    providerTitle: 'HVAC ColdTech Engineer',
    title: 'Clinic VRF Dual Multi-Split Cooling Installation',
    category: 'AC & Refrigeration',
    location: 'Nassarawa Hospital Road, Kano',
    totalAmountMinor: 22000000,
    currency: 'NGN',
    escrowStatus: 'released' as const,
    bookingStatus: 'completed' as const,
    progressPercentage: 100,
    appointmentDate: '2026-10-22',
    milestones: [
      { id: 'm-7', title: 'Copper Pipe Wall Chasing & Nitrogen Pressure Test', amountMinor: 10000000, status: 'completed' as const },
      { id: 'm-8', title: 'Indoor Units Split Mounting & Vacuum Drainage', amountMinor: 7000000, status: 'completed' as const },
      { id: 'm-9', title: 'Refrigerant Charge & Commissioning', amountMinor: 5000000, status: 'completed' as const },
    ],
    createdAt: '2026-10-20T09:00:00.000Z',
  },
]

const SEED_DISPUTES = [
  {
    id: 'dsp-01',
    disputeNumber: 'DIS-2026-0012',
    bookingId: 'bk-499',
    bookingNumber: 'CON-2026-0074',
    bookingTitle: 'Aluminium Pop-Up Ceiling & Wall Plastering in Fagge',
    amountMinor: 8500000,
    claimantName: 'Alhaji Sani Fagge (Client)',
    claimantRole: 'Customer',
    respondentName: 'Mustapha Nura (Plasterer)',
    respondentRole: 'Provider',
    reason: 'Client noted uneven screeding surface around cornices before final coat dry.',
    status: 'mediation' as const,
    filedDate: '2026-10-24',
    lastUpdate: '2026-10-25 15:10',
    evidenceItems: 4,
    notes: 'Provider agreed to sand down uneven joints and re-skim without additional labor charge.',
  },
]

export default function AdminPage() {
  const db = readDatabase()
  const registeredUsers = getAllUsers()
  const dbProfiles = db.profiles || []
  const seedProviders = getAllPublicProviders()

  const usersMap = new Map()

  for (const sp of seedProviders) {
    usersMap.set(sp.id, {
      id: sp.id,
      fullName: sp.fullName,
      businessName: sp.businessName,
      email: `${sp.fullName.toLowerCase().replace(/[^a-z]/g, '')}@connecta.ng`,
      phone: sp.phone || '+2348000000000',
      role: 'provider' as const,
      city: sp.city,
      state: sp.state,
      trade: sp.category,
      verificationStatus: sp.verificationStatus,
      experienceYears: sp.experienceYears,
      averageRating: sp.averageRating,
      completedJobs: sp.completedJobsCount,
      hourlyRateMinor: sp.hourlyRateMinor,
      joinedDate: sp.joinedDate,
      accountStatus: 'active' as const,
    })
  }

  for (const ru of registeredUsers) {
    usersMap.set(ru.id, {
      id: ru.id,
      fullName: ru.fullName || `${ru.firstName || ''} ${ru.lastName || ''}`.trim() || 'Connecta User',
      businessName: ru.businessName || `${ru.fullName || 'User'} Services`,
      email: ru.email,
      phone: ru.phone || '+2348000000000',
      role: (ru.role === 'provider' ? 'provider' : 'customer') as 'customer' | 'provider',
      city: ru.city || 'Kano',
      state: ru.city ? `${ru.city} State` : 'Kano State',
      trade: ru.primaryCategory || 'General Handyman',
      verificationStatus: (ru.role === 'provider' ? 'verified' : 'unverified') as 'verified' | 'unverified',
      experienceYears: (ru as any).yearsExperience || 5,
      averageRating: 4.9,
      completedJobs: 12,
      hourlyRateMinor: ru.hourlyRateMinor || 1200000,
      joinedDate: ru.createdAt || new Date().toISOString(),
      accountStatus: ((ru as any).accountStatus || 'active') as 'active' | 'suspended',
    })
  }

  for (const dp of dbProfiles) {
    if (!usersMap.has(dp.id)) {
      usersMap.set(dp.id, {
        id: dp.id,
        fullName: dp.fullName,
        businessName: dp.companyName || `${dp.fullName} Services`,
        email: dp.email,
        phone: dp.phone,
        role: dp.role as 'customer' | 'provider',
        city: dp.city,
        state: `${dp.city} State`,
        trade: dp.skills?.[0] || 'Local Services',
        verificationStatus: (dp.role === 'provider' ? 'verified' : 'unverified') as 'verified' | 'unverified',
        experienceYears: 7,
        averageRating: 4.88,
        completedJobs: 18,
        hourlyRateMinor: dp.hourlyRateMinor || 1500000,
        joinedDate: dp.createdAt,
        accountStatus: (dp.accountStatus || 'active') as 'active' | 'suspended',
      })
    }
  }

  const allUsers = Array.from(usersMap.values())
  const serviceRequests = db.service_requests && db.service_requests.length > 0
    ? (db.service_requests as any)
    : SEED_SERVICE_REQUESTS
  const bookings = db.bookings && db.bookings.length > 0
    ? (db.bookings as any)
    : SEED_BOOKINGS
  const disputes = db.disputes && db.disputes.length > 0
    ? (db.disputes as any)
    : SEED_DISPUTES
  const verificationCases = INITIAL_VERIFICATION_CASES

  const totalEscrowLockedMinor = bookings
    .filter((b: any) => b.escrowStatus === 'locked' || b.escrowStatus === 'partially_released')
    .reduce((sum: number, b: any) => sum + (b.totalAmountMinor || 0), 0)

  const totalEscrowReleasedMinor = bookings
    .filter((b: any) => b.escrowStatus === 'released')
    .reduce((sum: number, b: any) => sum + (b.totalAmountMinor || 0), 0)

  const totalPlatformFeeRevenueMinor = Math.round(
    (totalEscrowLockedMinor + totalEscrowReleasedMinor) * 0.05
  )

  const metrics = {
    totalUsers: allUsers.length,
    totalCustomers: allUsers.filter((u: any) => u.role === 'customer').length,
    totalProviders: allUsers.filter((u: any) => u.role === 'provider').length,
    totalJobs: serviceRequests.length,
    activeJobs: serviceRequests.filter((j: any) => j.status === 'open' || j.status === 'matching').length,
    totalContracts: bookings.length,
    activeContracts: bookings.filter((b: any) => b.bookingStatus === 'in_progress').length,
    completedContracts: bookings.filter((b: any) => b.bookingStatus === 'completed').length,
    totalEscrowLockedMinor,
    totalEscrowReleasedMinor,
    totalPlatformFeeRevenueMinor,
    pendingVerificationsCount: verificationCases.filter((v) => v.status === 'under_review').length,
    openDisputesCount: disputes.filter((d: any) => d.status !== 'resolved').length,
  }

  const emailDispatches =
    Array.isArray(db.email_dispatches) && db.email_dispatches.length > 0
      ? db.email_dispatches
      : [
          {
            id: 'disp-101',
            subject: 'Kano Artisan Escrow Protection & On-Site Guidelines',
            audienceType: 'providers' as const,
            recipientCount: 16,
            category: 'Service Notice',
            message:
              'All verified tradespeople are reminded that all milestone payments in Kano must be verified through the Connecta Escrow Vault prior to commencing on-site pipe welding, wire routing, or timber installation.',
            ctaText: 'Review Escrow Policies',
            ctaUrl: '/escrow-terms',
            sentAt: '2026-10-24 16:30',
            sentBy: 'Malam Aminu Danbatta (Admin)',
            status: 'delivered' as const,
          },
          {
            id: 'disp-102',
            subject: 'Emergency Handyman & Trade Coverage Now Active in Sabon Gari & Nassarawa',
            audienceType: 'clients' as const,
            recipientCount: 28,
            category: 'Announcement',
            message:
              'We are proud to announce enhanced 45-minute arrival time guarantees for all certified plumbers, air conditioning technicians, and emergency electricians booked in Kano central districts.',
            ctaText: 'Explore Verified Services',
            ctaUrl: '/discover',
            sentAt: '2026-10-25 11:15',
            sentBy: 'Malam Aminu Danbatta (Admin)',
            status: 'delivered' as const,
          },
        ]

  const initialData = {
    metrics,
    users: allUsers,
    serviceRequests,
    bookings,
    disputes,
    verificationCases,
    emailDispatches,
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1020] text-white flex items-center justify-center font-bold">Loading Admin Portal...</div>}>
      <AdminClientView initialData={initialData} />
    </Suspense>
  )
}
