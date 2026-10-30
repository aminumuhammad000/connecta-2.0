import { NextRequest, NextResponse } from 'next/server'
import {
  readDatabase,
  writeDatabase,
  DEFAULT_PLATFORM_SETTINGS,
  getPlatformSettings,
  updatePlatformSettings,
  getInAppNotifications,
  addInAppNotification,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  settleDisputeWithSplit,
  adjustUserBalance,
  moderateServiceRequest,
  toggleFeaturedProvider,
} from '@/lib/server/db'
import { getAllUsers, saveUser } from '@/lib/auth/user-store'
import { getAllPublicProviders } from '@/lib/server/providers'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth/admin-auth'

// Default seed cases for verification queue
const INITIAL_VERIFICATION_CASES = [
  {
    id: 'vc-101',
    providerName: 'Malam Sanusi Danbatta',
    businessName: 'Danbatta Tech & Micro-Soldering Lab',
    trade: 'Electrical & Appliance Repair',
    city: 'Kano (Farm Centre)',
    status: 'under_review',
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
    status: 'under_review',
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
    status: 'approved',
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
    status: 'under_review',
    submittedAt: '2026-10-25 09:45',
    documentType: 'HVAC Association Certified License',
    documentNumber: 'HVAC-NG-4482',
    yearsOfExperience: 8,
  },
]

// Fallback seed jobs / service requests for demonstration if db has none
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
    urgency: 'emergency',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 2500000, // ₦25,000
    budgetMaxMinor: 4500000, // ₦45,000
    currency: 'NGN',
    status: 'open',
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
    urgency: 'scheduled',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 15000000, // ₦150,000
    budgetMaxMinor: 25000000, // ₦250,000
    currency: 'NGN',
    status: 'matching',
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
    urgency: 'today',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 4000000, // ₦40,000
    budgetMaxMinor: 6500000, // ₦65,000
    currency: 'NGN',
    status: 'booked',
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
    urgency: 'scheduled',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 25000000, // ₦250,000
    budgetMaxMinor: 45000000, // ₦450,000
    currency: 'NGN',
    status: 'open',
    requiredSkills: ['Hardwood Joinery', 'Bookcase Framing', 'Timber Sanding'],
    proposalsCount: 4,
    createdAt: '2026-10-24T16:45:00.000Z',
  },
]

// Fallback seed contracts / escrow projects
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
    totalAmountMinor: 12000000, // ₦120,000
    currency: 'NGN',
    escrowStatus: 'locked',
    bookingStatus: 'in_progress',
    progressPercentage: 65,
    appointmentDate: '2026-10-27',
    milestones: [
      { id: 'm-1', title: 'Pump Pulling & Motor Diagnostics', amountMinor: 4000000, status: 'completed' },
      { id: 'm-2', title: 'Submersible Impeller Replacement & Cable Rewind', amountMinor: 5000000, status: 'current' },
      { id: 'm-3', title: 'Water Tank Float Sensor Calibration & Final Test', amountMinor: 3000000, status: 'pending' },
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
    totalAmountMinor: 35000000, // ₦350,000
    currency: 'NGN',
    escrowStatus: 'locked',
    bookingStatus: 'in_progress',
    progressPercentage: 40,
    appointmentDate: '2026-10-28',
    milestones: [
      { id: 'm-4', title: 'Cylinder Head Gasket & Injector Service', amountMinor: 15000000, status: 'completed' },
      { id: 'm-5', title: 'ATS Contactor & Phase Relays Rewiring', amountMinor: 12000000, status: 'current' },
      { id: 'm-6', title: 'Full Load Bank Test (40kW Endurance)', amountMinor: 8000000, status: 'pending' },
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
    totalAmountMinor: 22000000, // ₦220,000
    currency: 'NGN',
    escrowStatus: 'released',
    bookingStatus: 'completed',
    progressPercentage: 100,
    appointmentDate: '2026-10-22',
    milestones: [
      { id: 'm-7', title: 'Copper Pipe Wall Chasing & Nitrogen Pressure Test', amountMinor: 10000000, status: 'completed' },
      { id: 'm-8', title: 'Indoor Units Split Mounting & Vacuum Drainage', amountMinor: 7000000, status: 'completed' },
      { id: 'm-9', title: 'Refrigerant Charge & Commissioning', amountMinor: 5000000, status: 'completed' },
    ],
    createdAt: '2026-10-20T09:00:00.000Z',
  },
]

// Fallback seed disputes
const SEED_DISPUTES = [
  {
    id: 'dsp-01',
    disputeNumber: 'DIS-2026-0012',
    bookingId: 'bk-499',
    bookingNumber: 'CON-2026-0074',
    bookingTitle: 'Aluminium Pop-Up Ceiling & Wall Plastering in Fagge',
    amountMinor: 8500000, // ₦85,000
    claimantName: 'Alhaji Sani Fagge (Client)',
    claimantRole: 'Customer',
    respondentName: 'Mustapha Nura (Plasterer)',
    respondentRole: 'Provider',
    reason: 'Client noted uneven screeding surface around cornices before final coat dry.',
    status: 'mediation',
    filedDate: '2026-10-24',
    lastUpdate: '2026-10-25 15:10',
    evidenceItems: 4,
    notes: 'Provider agreed to sand down uneven joints and re-skim without additional labor charge.',
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const auth = await verifyAdminToken(token)
    if (!auth.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Admin authentication required or session timed out after 2 hours',
          reason: auth.reason,
        },
        { status: 401 }
      )
    }

    const db = readDatabase()

    // 1. Compile all users
    const registeredUsers = getAllUsers()
    const dbProfiles = db.profiles || []
    const seedProviders = getAllPublicProviders()

    const usersMap = new Map()

    // Helper to get wallet for a user
    const getUserWallet = (uid: string) => {
      const w = db.wallets.find((item) => item.userId === uid)
      return w ? {
        balanceMinor: w.balanceMinor,
        escrowBalanceMinor: w.escrowBalanceMinor,
        sparksBalance: w.sparksBalance,
        currency: w.currency,
      } : null
    }

    // Seed providers
    for (const sp of seedProviders) {
      usersMap.set(sp.id, {
        id: sp.id,
        fullName: sp.fullName,
        businessName: sp.businessName,
        email: `${sp.fullName.toLowerCase().replace(/[^a-z]/g, '')}@connecta.ng`,
        phone: sp.phone || '+2348000000000',
        role: 'provider',
        city: sp.city,
        state: sp.state,
        trade: sp.category,
        verificationStatus: sp.verificationStatus || 'verified',
        experienceYears: sp.experienceYears || 8,
        averageRating: sp.averageRating || 4.9,
        completedJobs: sp.completedJobsCount || 12,
        hourlyRateMinor: sp.hourlyRateMinor || 1500000,
        joinedDate: sp.joinedDate,
        accountStatus: 'active',
        isFeatured: (sp as any).isFeatured || false,
        badges: sp.badges || ['Verified Pro'],
        ninNumber: (sp as any).ninNumber || '',
        wallet: getUserWallet(sp.id),
      })
    }

    // Registered users
    for (const ru of registeredUsers) {
      const existing = usersMap.get(ru.id) || {}
      usersMap.set(ru.id, {
        ...existing,
        id: ru.id,
        fullName: ru.fullName || `${ru.firstName || ''} ${ru.lastName || ''}`.trim() || 'Connecta User',
        businessName: ru.businessName || `${ru.fullName || 'User'} Services`,
        email: ru.email,
        phone: ru.phone || '+2348000000000',
        role: ru.role || 'customer',
        city: ru.city || 'Kano',
        state: ru.city ? `${ru.city} State` : 'Kano State',
        trade: ru.primaryCategory || 'General Handyman',
        verificationStatus: (ru as any).verificationStatus || (ru.role === 'provider' ? 'verified' : 'unverified'),
        experienceYears: (ru as any).yearsExperience || 5,
        averageRating: 4.9,
        completedJobs: 12,
        hourlyRateMinor: ru.hourlyRateMinor || 1200000,
        joinedDate: ru.createdAt || new Date().toISOString(),
        accountStatus: (ru as any).accountStatus || 'active',
        isFeatured: (ru as any).isFeatured || false,
        badges: (ru as any).badges || [],
        ninNumber: ru.ninNumber || '',
        wallet: getUserWallet(ru.id),
      })
    }

    // DB Profiles (takes precedence)
    for (const dp of dbProfiles) {
      usersMap.set(dp.id, {
        id: dp.id,
        fullName: dp.fullName,
        businessName: dp.companyName || `${dp.fullName} Services`,
        email: dp.email,
        phone: dp.phone,
        role: dp.role,
        city: dp.city,
        state: `${dp.city} State`,
        trade: dp.trade || dp.skills?.[0] || 'Local Services',
        verificationStatus: dp.verificationStatus || (dp.role === 'provider' ? 'verified' : 'unverified'),
        experienceYears: dp.experienceYears || 7,
        averageRating: 4.88,
        completedJobs: 18,
        hourlyRateMinor: dp.hourlyRateMinor || 1500000,
        joinedDate: dp.createdAt,
        accountStatus: dp.accountStatus || 'active',
        isFeatured: Boolean(dp.isFeatured),
        badges: dp.badges || (dp.role === 'provider' ? ['Verified Pro'] : []),
        ninNumber: dp.ninNumber || '',
        wallet: getUserWallet(dp.id),
      })
    }

    const allUsers = Array.from(usersMap.values())

    // 2. Service Requests
    const serviceRequests = db.service_requests && db.service_requests.length > 0
      ? db.service_requests
      : SEED_SERVICE_REQUESTS

    // 3. Contracts / Bookings
    const bookings = db.bookings && db.bookings.length > 0
      ? db.bookings
      : SEED_BOOKINGS

    // 4. Disputes
    const disputes = db.disputes && db.disputes.length > 0
      ? db.disputes
      : SEED_DISPUTES

    // 5. Verification Cases (merge real providers + seed cases)
    const providerCases = allUsers
      .filter((u: any) => u.role === 'provider')
      .map((u: any) => ({
        id: `vc-${u.id}`,
        providerId: u.id,
        providerName: u.fullName,
        businessName: u.businessName || `${u.fullName} Services`,
        trade: u.trade,
        city: u.city,
        status: u.verificationStatus === 'verified' ? ('approved' as const) : ('under_review' as const),
        submittedAt: u.joinedDate ? u.joinedDate.replace('T', ' ').slice(0, 16) : '2026-10-25 10:00',
        documentType: u.ninNumber ? 'National Identification Number (NIN) Slip' : 'Trade Guild Master Craftsman License',
        documentNumber: u.ninNumber || `NIN-${u.id.slice(0, 8).toUpperCase()}`,
        yearsOfExperience: u.experienceYears || 8,
      }))

    const verificationCases = providerCases.length > 0 ? providerCases : INITIAL_VERIFICATION_CASES

    // 6. Pending Withdrawals
    const pendingWithdrawals = db.wallet_transactions
      .filter((tx) => tx.type === 'withdrawal' && tx.status === 'pending')
      .map((tx) => {
        const u = allUsers.find((user: any) => user.id === tx.userId)
        return {
          ...tx,
          userName: u?.fullName || 'Connecta User',
          userEmail: u?.email || '',
        }
      })

    // 7. Platform Settings & In-App Notifications
    const platformSettings = db.platform_settings || DEFAULT_PLATFORM_SETTINGS
    const inAppNotifications = db.in_app_notifications || []

    // 6. Financial Ledger
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
      openDisputesCount: disputes.filter((d) => d.status !== 'resolved').length,
    }

    const emailDispatches =
      Array.isArray(db.email_dispatches) && db.email_dispatches.length > 0
        ? db.email_dispatches
        : [
            {
              id: 'disp-101',
              subject: 'Kano Artisan Escrow Protection & On-Site Guidelines',
              audienceType: 'providers',
              recipientCount: 16,
              category: 'Service Notice',
              message:
                'All verified tradespeople are reminded that all milestone payments in Kano must be verified through the Connecta Escrow Vault prior to commencing on-site pipe welding, wire routing, or timber installation.',
              ctaText: 'Review Escrow Policies',
              ctaUrl: '/escrow-terms',
              sentAt: '2026-10-24 16:30',
              sentBy: 'Malam Aminu Danbatta (Admin)',
              status: 'delivered',
            },
            {
              id: 'disp-102',
              subject: 'Emergency Handyman & Trade Coverage Now Active in Sabon Gari & Nassarawa',
              audienceType: 'clients',
              recipientCount: 28,
              category: 'Announcement',
              message:
                'We are proud to announce enhanced 45-minute arrival time guarantees for all certified plumbers, air conditioning technicians, and emergency electricians booked in Kano central districts.',
              ctaText: 'Explore Verified Services',
              ctaUrl: '/discover',
              sentAt: '2026-10-25 11:15',
              sentBy: 'Malam Aminu Danbatta (Admin)',
              status: 'delivered',
            },
          ]

    const adminEmail = (auth.payload?.email || process.env.ADMIN_EMAIL || 'admin@connecta.ng').toLowerCase().trim()
    const adminProfile = db.profiles.find((p) => p.email?.toLowerCase() === adminEmail) || db.profiles.find((p) => p.role === 'admin') || null
    const adminWallet = adminProfile ? db.wallets.find((w) => w.userId === adminProfile.id) || null : null

    return NextResponse.json({
      success: true,
      data: {
        adminProfile: adminProfile
          ? {
              ...adminProfile,
              wallet: adminWallet,
            }
          : null,
        metrics,
        users: allUsers,
        serviceRequests,
        bookings,
        disputes,
        verificationCases,
        emailDispatches,
        platformSettings,
        inAppNotifications,
        pendingWithdrawals,
      },
    })
  } catch (error: any) {
    console.error('[API /api/admin GET] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve admin data', error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const auth = await verifyAdminToken(token)
    if (!auth.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Admin authentication required or session timed out after 2 hours',
          reason: auth.reason,
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, payload } = body

    if (!action) {
      return NextResponse.json({ success: false, message: 'Action is required' }, { status: 400 })
    }

    const db = readDatabase()

    if (action === 'toggle_user_status') {
      const { userId, newStatus } = payload
      const userProfile = db.profiles.find((p) => p.id === userId)
      if (userProfile) {
        userProfile.accountStatus = newStatus
        userProfile.updatedAt = new Date().toISOString()
        writeDatabase(db)
        saveUser({
          ...userProfile,
          role: userProfile.role || 'customer',
          welcomeSparks: userProfile.welcomeSparks || 500,
        })
      }
      return NextResponse.json({ success: true, message: `User status changed to ${newStatus}` })
    }

    if (action === 'update_user_profile') {
      const { userId, updates } = payload
      const profile = db.profiles.find((p) => p.id === userId)
      if (profile) {
        if (updates.fullName) {
          profile.fullName = updates.fullName
          const parts = updates.fullName.trim().split(/\s+/)
          profile.firstName = parts[0]
          profile.lastName = parts.slice(1).join(' ')
        }
        if (updates.email) profile.email = updates.email
        if (updates.phone) profile.phone = updates.phone
        if (updates.city) profile.city = updates.city
        if (updates.trade) {
          profile.trade = updates.trade
          profile.headline = `${updates.trade} Specialist`
          profile.skills = [updates.trade]
        }
        if (updates.ninNumber) profile.ninNumber = updates.ninNumber
        if (updates.hourlyRateMinor) profile.hourlyRateMinor = Number(updates.hourlyRateMinor)
        if (updates.role) {
          profile.role = updates.role
          profile.activeRole = updates.role
        }
        if (updates.verificationStatus) {
          profile.verificationStatus = updates.verificationStatus
        }
        profile.updatedAt = new Date().toISOString()
        writeDatabase(db)

        saveUser({
          ...profile,
          role: profile.role || 'customer',
          welcomeSparks: profile.welcomeSparks || 500,
        })
        return NextResponse.json({ success: true, message: 'User profile updated successfully', user: profile })
      }
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    if (action === 'reset_user_password') {
      const { userId, newPassword } = payload
      const profile = db.profiles.find((p) => p.id === userId)
      if (profile) {
        profile.password = newPassword
        profile.updatedAt = new Date().toISOString()
        writeDatabase(db)
        saveUser({
          ...profile,
          password: newPassword,
          role: profile.role || 'customer',
          welcomeSparks: profile.welcomeSparks || 500,
        })
        return NextResponse.json({ success: true, message: `Password reset successfully for ${profile.fullName}` })
      }
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    if (action === 'adjust_user_wallet') {
      const { userId, balanceDeltaMinor, sparksDelta, reason } = payload
      const success = adjustUserBalance(userId, Number(balanceDeltaMinor) || 0, Number(sparksDelta) || 0, reason)
      if (success) {
        return NextResponse.json({ success: true, message: 'Wallet balance and Sparks successfully adjusted' })
      }
      return NextResponse.json({ success: false, message: 'User wallet not found' }, { status: 404 })
    }

    if (action === 'toggle_featured_provider') {
      const { providerId, isFeatured } = payload
      const success = toggleFeaturedProvider(providerId, isFeatured)
      return NextResponse.json({ success, message: `Provider featured status updated` })
    }

    if (action === 'update_verification') {
      const { caseId, status, rejectionReason, providerId } = payload
      const pId = providerId || (caseId ? caseId.replace(/^vc-/, '') : null)
      const provider = db.profiles.find((p) => p.id === pId || p.fullName.toLowerCase().includes((caseId || '').toLowerCase()))
      if (provider) {
        provider.verificationStatus = status === 'approved' ? 'verified' : 'unverified'
        if (status === 'approved') {
          if (!provider.badges) provider.badges = []
          if (!provider.badges.includes('Verified Pro')) provider.badges.push('Verified Pro')
        }
        provider.updatedAt = new Date().toISOString()
        writeDatabase(db)
      }
      return NextResponse.json({
        success: true,
        message: `Verification ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        caseId,
        status,
        rejectionReason,
      })
    }

    if (action === 'force_escrow_release') {
      const { bookingId } = payload
      const booking = db.bookings.find((b) => b.id === bookingId)
      if (booking) {
        booking.escrowStatus = 'released'
        booking.bookingStatus = 'completed'
        booking.progressPercentage = 100
        if (booking.milestones) {
          booking.milestones.forEach((m) => { m.status = 'completed' })
        }
        writeDatabase(db)
      }
      return NextResponse.json({ success: true, message: `Escrow for booking ${bookingId} released successfully` })
    }

    if (action === 'refund_escrow') {
      const { bookingId } = payload
      const booking = db.bookings.find((b) => b.id === bookingId)
      if (booking) {
        booking.escrowStatus = 'released'
        booking.bookingStatus = 'disputed'
        writeDatabase(db)
      }
      return NextResponse.json({ success: true, message: `Escrow for booking ${bookingId} refunded to client` })
    }

    if (action === 'resolve_dispute') {
      const { disputeId, resolution } = payload
      const dispute = db.disputes.find((d) => d.id === disputeId)
      if (dispute) {
        dispute.status = 'resolved'
        dispute.notes += ` [Resolution]: ${resolution}`
        dispute.lastUpdate = new Date().toISOString().replace('T', ' ').slice(0, 16)
        writeDatabase(db)
      }
      return NextResponse.json({ success: true, message: `Dispute ${disputeId} marked as resolved` })
    }

    if (action === 'settle_dispute_split') {
      const { disputeId, providerPercent, clientPercent, resolutionNotes } = payload
      const success = settleDisputeWithSplit(disputeId, Number(providerPercent), Number(clientPercent), resolutionNotes)
      if (success) {
        return NextResponse.json({ success: true, message: 'Dispute resolved with split payout successfully' })
      }
      return NextResponse.json({ success: false, message: 'Failed to settle dispute' }, { status: 400 })
    }

    if (action === 'moderate_job') {
      const { requestId, status, updates } = payload
      const success = moderateServiceRequest(requestId, status, updates)
      if (success) {
        return NextResponse.json({ success: true, message: `Job ${requestId} updated to ${status}` })
      }
      return NextResponse.json({ success: false, message: 'Service request not found' }, { status: 404 })
    }

    if (action === 'process_withdrawal') {
      const { txId, decision, payoutReference, reason } = payload
      if (decision === 'approve') {
        const success = approveWithdrawal(txId, payoutReference)
        return NextResponse.json({ success, message: 'Withdrawal approved and marked completed' })
      } else {
        const success = rejectWithdrawal(txId, reason || 'Rejected by Compliance Desk')
        return NextResponse.json({ success, message: 'Withdrawal rejected and refunded to user vault' })
      }
    }

    if (action === 'send_in_app_notification') {
      const { userId, title, message, type } = payload
      const notif = addInAppNotification({
        userId: userId || 'all',
        title,
        message,
        type: type || 'info',
      })
      return NextResponse.json({ success: true, message: 'In-app notification broadcasted successfully', notification: notif })
    }

    if (action === 'update_platform_settings') {
      const settings = updatePlatformSettings(payload)
      return NextResponse.json({ success: true, message: 'Platform settings updated successfully', settings })
    }

    if (action === 'update_admin_profile') {
      const { fullName, phone, whatsapp, headline, bio, city, country, skills, companyName } = payload || {}
      const adminEmail = (auth.payload?.email || process.env.ADMIN_EMAIL || 'admin@connecta.ng').toLowerCase().trim()
      const profile = db.profiles.find((p) => p.email?.toLowerCase() === adminEmail) || db.profiles.find((p) => p.role === 'admin')
      if (profile) {
        if (fullName) {
          profile.fullName = fullName
          const parts = fullName.trim().split(/\s+/)
          profile.firstName = parts[0] || profile.firstName
          profile.lastName = parts.slice(1).join(' ') || profile.lastName
        }
        if (phone) profile.phone = phone
        if (whatsapp) profile.whatsapp = whatsapp
        if (headline) profile.headline = headline
        if (bio) profile.bio = bio
        if (city) profile.city = city
        if (country) profile.country = country
        if (skills && Array.isArray(skills)) profile.skills = skills
        if (companyName) profile.companyName = companyName
        profile.updatedAt = new Date().toISOString()
        writeDatabase(db)
        saveUser({
          ...profile,
          avatarUrl: profile.avatarUrl || undefined,
          role: profile.role || 'admin',
          welcomeSparks: profile.welcomeSparks || 500,
        })
        return NextResponse.json({ success: true, message: 'Admin profile updated successfully', profile })
      }
      return NextResponse.json({ success: false, message: 'Admin profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 })
  } catch (error: any) {
    console.error('[API /api/admin POST] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process admin action', error: String(error) },
      { status: 500 }
    )
  }
}
