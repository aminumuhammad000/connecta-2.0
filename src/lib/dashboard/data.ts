/**
 * Connecta 2.0 Unified Master Dashboard Data Service
 * Supports live Supabase query with graceful fallback to seeded master fixtures.
 */

export interface DashboardMetric {
  label: string
  value: string
  subtext: string
  iconType: 'briefcase' | 'wallet' | 'users' | 'shield' | 'star' | 'sparks'
  changePercent?: string
  color: 'emerald' | 'blue' | 'amber' | 'slate'
}

export interface DashboardBooking {
  id: string
  bookingNumber: string
  title: string
  category: string
  clientName: string
  clientCompany?: string
  clientAvatar?: string
  providerName: string
  providerTitle: string
  providerAvatar?: string
  location: string
  totalAmountMinor: number
  escrowStatus: 'locked' | 'partially_released' | 'released'
  bookingStatus: 'pending' | 'in_progress' | 'completed' | 'disputed'
  progressPercentage: number
  appointmentDate: string
  milestones: {
    id: string
    title: string
    amountMinor: number
    status: 'completed' | 'current' | 'pending'
  }[]
}

export interface DashboardMarketplaceJob {
  id: string
  title: string
  category: string
  categorySlug: string
  clientName: string
  clientCompany: string
  clientAvatar?: string
  city: string
  state: string
  urgency: 'emergency' | 'today' | 'scheduled' | 'flexible'
  budgetMinMinor: number
  budgetMaxMinor: number
  postedTimeAgo: string
  description: string
  requiredSkills: string[]
  proposalsCount: number
}

export interface DashboardSquad {
  id: string
  name: string
  slug: string
  headline: string
  description: string
  leadProviderName: string
  leadProviderAvatar: string
  rating: number
  completedJobsCount: number
  bannerGradient: string
  roles: {
    roleTitle: string
    providerName: string
    splitPercentage: number
    isLead: boolean
  }[]
}

export interface DashboardWalletLedger {
  id: string
  reference: string
  type: 'escrow_hold' | 'escrow_release' | 'withdrawal' | 'deposit'
  amountMinor: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  description: string
  date: string
}

export interface DashboardFeedItem {
  id: string
  actorName: string
  actorRole: string
  actorAvatar: string
  postType: 'milestone_released' | 'job_completed' | 'squad_formed' | 'general'
  title: string
  body: string
  emoji: string
  likesCount: number
  timeAgo: string
}

export interface DashboardFaq {
  q: string
  tag: string
  a: string
}

// =============================================================================
// SEEDED MASTER FIXTURES
// =============================================================================

export const CLIENT_METRICS: DashboardMetric[] = [
  {
    label: 'Active Projects',
    value: '2 Briefs',
    subtext: '1 In Progress, 1 Quoting',
    iconType: 'briefcase',
    changePercent: '+1 this week',
    color: 'blue',
  },
  {
    label: 'Secured in Escrow',
    value: '₦480,000',
    subtext: '100% Protected Milestone Vault',
    iconType: 'wallet',
    changePercent: 'Locked safely',
    color: 'emerald',
  },
  {
    label: 'Verified Quotes',
    value: '4 Received',
    subtext: 'Itemized artisan proposals',
    iconType: 'shield',
    color: 'amber',
  },
  {
    label: 'Escrow Protection',
    value: '100%',
    subtext: 'NDIC-Insured Custody',
    iconType: 'shield',
    color: 'emerald',
  },
]

export const PROVIDER_METRICS: DashboardMetric[] = [
  {
    label: 'Active Contracts',
    value: '1 In-Flight',
    subtext: 'Booking #CN-782419 (Solar)',
    iconType: 'briefcase',
    color: 'blue',
  },
  {
    label: 'Escrow Vault Secured',
    value: '₦480,000',
    subtext: 'Ready on milestone delivery',
    iconType: 'wallet',
    changePercent: 'Guaranteed pay',
    color: 'emerald',
  },
  {
    label: 'Available Payout',
    value: '₦345,000',
    subtext: 'Withdrawable to Zenith Bank',
    iconType: 'wallet',
    color: 'amber',
  },
  {
    label: 'Lifetime Rating',
    value: '4.99 ★',
    subtext: '118 Completed Jobs',
    iconType: 'star',
    changePercent: 'Top 1% Pro',
    color: 'slate',
  },
]

export const DASHBOARD_BOOKINGS: DashboardBooking[] = [
  {
    id: 'b1010000-0000-0000-0000-000000000001',
    bookingNumber: 'CN-782419',
    title: '15kVA Hybrid Solar Inverter System & Battery Bank Installation',
    category: 'Solar & Electrical Power',
    clientName: 'Tunde Bakare',
    clientCompany: 'PayFlow Financial Technologies',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    providerName: 'Ibrahim Aliyu',
    providerTitle: 'Master Electrician & Certified Solar Installation Lead',
    providerAvatar: '/images/services/nigerian_electrician_ibrahim.jpg',
    location: 'Lekki Phase 1, Lagos',
    totalAmountMinor: 48000000,
    escrowStatus: 'locked',
    bookingStatus: 'in_progress',
    progressPercentage: 75,
    appointmentDate: '2 Days Ago',
    milestones: [
      { id: 'm1', title: 'Site Inspection, Sizing & Inverter Mounting', amountMinor: 15000000, status: 'completed' },
      { id: 'm2', title: '4x 5kWh Lithium Iron Phosphate Battery Commissioning', amountMinor: 25000000, status: 'completed' },
      { id: 'm3', title: 'Distribution Board Wiring & Phase Balancing', amountMinor: 3500000, status: 'current' },
      { id: 'm4', title: 'Safety Earthing Certificate & Final Handover', amountMinor: 4500000, status: 'pending' },
    ],
  },
  {
    id: 'b1010000-0000-0000-0000-000000000002',
    bookingNumber: 'CN-319084',
    title: 'Commercial Building Pressure Booster Pump & Pipe Overhaul',
    category: 'Plumbing & Water Systems',
    clientName: 'Amina Bello',
    clientCompany: 'Bello Heritage Properties',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
    providerName: 'Jonah Blessing',
    providerTitle: 'Certified Plumber & Domestic Water Systems Lead',
    providerAvatar: '/images/services/nigerian_plumber_jonah.jpg',
    location: 'Nassarawa GRA, Kano',
    totalAmountMinor: 18500000,
    escrowStatus: 'released',
    bookingStatus: 'completed',
    progressPercentage: 100,
    appointmentDate: '10 Days Ago',
    milestones: [
      { id: 'm1', title: 'Borehole Submersible Pump Extraction & Diagnostics', amountMinor: 6500000, status: 'completed' },
      { id: 'm2', title: 'Copper Manifold & Pressure Booster Valve Replacement', amountMinor: 8000000, status: 'completed' },
      { id: 'm3', title: 'High-Pressure Overhead Tank Flush & Water Testing', amountMinor: 4000000, status: 'completed' },
    ],
  },
]

export const DASHBOARD_MARKETPLACE_JOBS: DashboardMarketplaceJob[] = [
  {
    id: 'd1010000-0000-0000-0000-000000000001',
    title: '15kVA Solar Inverter & Lithium Battery Retrofit for Office',
    category: 'Solar & Electrical Power',
    categorySlug: 'electrical',
    clientName: 'Tunde Bakare',
    clientCompany: 'PayFlow Financial',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    city: 'Lagos',
    state: 'Lagos',
    urgency: 'today',
    budgetMinMinor: 35000000,
    budgetMaxMinor: 50000000,
    postedTimeAgo: '1h ago',
    description: 'We need a certified solar engineer to inspect our current diesel generator backup and replace it with a clean 15kVA hybrid solar system with 20kWh lithium batteries for our Lekki office.',
    requiredSkills: ['Solar Inverters', 'Lithium Batteries', 'Distribution Boards', 'Phase Balancing'],
    proposalsCount: 3,
  },
  {
    id: 'd1010000-0000-0000-0000-000000000002',
    title: 'Cross-Platform React & Node.js B2B Marketplace Portal',
    category: 'Computers & Software Labs',
    categorySlug: 'computer-repair',
    clientName: 'Amaka Okonkwo',
    clientCompany: 'TechPulse Africa Media',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    city: 'Abuja',
    state: 'FCT',
    urgency: 'scheduled',
    budgetMinMinor: 40000000,
    budgetMaxMinor: 75000000,
    postedTimeAgo: '3h ago',
    description: 'Looking for an experienced Full-Stack Engineer to collaborate with our design team. Must be proficient in Next.js, Postgres, and escrow milestone release mechanisms.',
    requiredSkills: ['React', 'Next.js', 'PostgreSQL', 'TypeScript', 'Escrow Systems'],
    proposalsCount: 6,
  },
  {
    id: 'd1010000-0000-0000-0000-000000000003',
    title: 'Emergency Borehole Pump Extraction & Overhead Tank Leak',
    category: 'Plumbing & Water Systems',
    categorySlug: 'plumbing',
    clientName: 'Amina Bello',
    clientCompany: 'Bello Heritage Properties',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
    city: 'Kano',
    state: 'Kano',
    urgency: 'emergency',
    budgetMinMinor: 15000000,
    budgetMaxMinor: 25000000,
    postedTimeAgo: '45m ago',
    description: 'Submersible borehole pump stopped pumping to the 5,000L overhead tanks. Pressure booster valve leaking in Nassarawa GRA residential compound. Need same day artisan.',
    requiredSkills: ['Borehole Pumps', 'Overhead Tanks', 'Pressure Valves', 'Copper Manifolds'],
    proposalsCount: 2,
  },
  {
    id: 'd1010000-0000-0000-0000-000000000004',
    title: 'Bespoke Solid Hardwood Boardroom Conference Table (14 Seater)',
    category: 'Carpentry & Architectural Woodwork',
    categorySlug: 'carpentry',
    clientName: 'Dr. Kabir Danbatta',
    clientCompany: 'Amana Investment Holdings',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    city: 'Kano',
    state: 'Kano',
    urgency: 'flexible',
    budgetMinMinor: 45000000,
    budgetMaxMinor: 65000000,
    postedTimeAgo: '5h ago',
    description: 'Custom handcrafted boardroom conference table in solid mahogany timber, integrated hidden cable runs, matte polyurethane seal, and matching acoustic wall panels.',
    requiredSkills: ['Solid Wood Joinery', 'Mahogany Furniture', 'Acoustic Cladding', 'Cable Troughs'],
    proposalsCount: 4,
  },
]

export const DASHBOARD_SQUADS: DashboardSquad[] = [
  {
    id: 'c2010000-0000-0000-0000-000000000001',
    name: 'Apex Smart Home & Solar Squad',
    slug: 'apex-smart-home-squad',
    headline: 'Integrated Solar Engineering, Fluidics & Smart IoT Automation',
    description: 'Combined trade powerhouse linking certified solar engineers with high-capacity plumbers and smart home wiring specialists.',
    leadProviderName: 'Ibrahim Aliyu',
    leadProviderAvatar: '/images/services/nigerian_electrician_ibrahim.jpg',
    rating: 4.98,
    completedJobsCount: 34,
    bannerGradient: 'from-[#0C513F] via-[#145241] to-[#0A2614]',
    roles: [
      { roleTitle: 'Solar & Inverter Lead', providerName: 'Ibrahim Aliyu', splitPercentage: 45, isLead: true },
      { roleTitle: 'Plumbing & Fluidics Lead', providerName: 'Jonah Blessing', splitPercentage: 35, isLead: false },
      { roleTitle: 'IoT Hardware & Diagnostic Tech', providerName: 'Salamah Othman', splitPercentage: 20, isLead: false },
    ],
  },
  {
    id: 'c2010000-0000-0000-0000-000000000002',
    name: 'Pulse Mobile & Cloud Studio',
    slug: 'pulse-mobile-cloud-studio',
    headline: 'High-Impact Product Design & Full-Stack Cloud Engineering',
    description: 'Cross-functional software squad combining award-winning Figma mobile designers with veteran Node/Postgres backend architects.',
    leadProviderName: 'David Okafor',
    leadProviderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.96,
    completedJobsCount: 28,
    bannerGradient: 'from-[#1A73E8] via-[#0A1020] to-[#1E1B4B]',
    roles: [
      { roleTitle: 'Cloud Backend Architect', providerName: 'David Okafor', splitPercentage: 55, isLead: true },
      { roleTitle: 'Lead Product & Mobile Designer', providerName: 'Elena Rodriguez', splitPercentage: 45, isLead: false },
    ],
  },
]

export const DASHBOARD_WALLET_LEDGER: DashboardWalletLedger[] = [
  {
    id: 'tx1',
    reference: 'TX-ESC-782419',
    type: 'escrow_hold',
    amountMinor: 48000000,
    currency: 'NGN',
    status: 'completed',
    description: 'Escrow Locked: 15kVA Solar Inverter System (Booking #CN-782419)',
    date: 'Oct 23, 2026 • 10:14 AM',
  },
  {
    id: 'tx2',
    reference: 'TX-REL-319084',
    type: 'escrow_release',
    amountMinor: 18500000,
    currency: 'NGN',
    status: 'completed',
    description: 'Milestone Released: Commercial Water Pump Overhaul (Booking #CN-319084)',
    date: 'Oct 15, 2026 • 04:30 PM',
  },
  {
    id: 'tx3',
    reference: 'TX-WTH-994812',
    type: 'withdrawal',
    amountMinor: 10000000,
    currency: 'NGN',
    status: 'completed',
    description: 'Bank Payout to Zenith Bank Account (****8821)',
    date: 'Oct 16, 2026 • 09:12 AM',
  },
]

export const DASHBOARD_FEED_ITEMS: DashboardFeedItem[] = [
  {
    id: 'f1',
    actorName: 'Ibrahim Aliyu',
    actorRole: 'Master Electrician',
    actorAvatar: '/images/services/nigerian_electrician_ibrahim.jpg',
    postType: 'milestone_released',
    title: '30kVA Solar Hybrid Commercial Milestone Approved!',
    body: 'Successfully energized a 30kVA dual-inverter system with 40kWh lithium batteries for an agricultural facility in Kano. Milestone escrow payment approved!',
    emoji: '⚡',
    likesCount: 24,
    timeAgo: '2h ago',
  },
  {
    id: 'f2',
    actorName: 'Tunde Bakare',
    actorRole: 'Founder at PayFlow',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    postType: 'job_completed',
    title: 'Outstanding Work by Connecta Tradespeople',
    body: 'Funded our 15kVA office solar brief via milestone escrow. Ibrahim was matched in under a minute and started the site audit next morning. 10/10 experience.',
    emoji: '🤝',
    likesCount: 18,
    timeAgo: '4h ago',
  },
  {
    id: 'f3',
    actorName: 'David Okafor',
    actorRole: 'Cloud Architect',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    postType: 'squad_formed',
    title: 'Pulse Mobile & Cloud Studio is Live on Connecta',
    body: 'Formed a new Collabo Squad with Elena Rodriguez to provide end-to-end design and high-scale engineering for African tech companies.',
    emoji: '🚀',
    likesCount: 31,
    timeAgo: '1d ago',
  },
]

export const DASHBOARD_FAQS: DashboardFaq[] = [
  {
    q: 'How does Connecta Milestone Escrow protect both clients and specialists?',
    tag: 'Escrow Security',
    a: 'Funds are securely deposited into a vault before work commences. Money is only released when you inspect and approve each milestone. Specialists get peace of mind knowing the budget is locked, while clients never pay upfront for incomplete work.',
  },
  {
    q: 'What are Collabo Squads and how do automated splits work?',
    tag: 'Collabo Squads',
    a: 'Collabo Squads unite multi-disciplinary trades and tech professionals (e.g. Solar Engineers, Certified Plumbers, and IoT specialists) under one collaborative proposal. When the client approves milestones, Connecta splits payments directly into each specialist’s wallet according to their agreed formula.',
  },
  {
    q: 'How does Connecta protect payments with Milestone Escrow?',
    tag: 'Escrow Security',
    a: 'Client funds are securely deposited into our licensed NDIC-insured banking vault. Payouts are only released to specialists after you inspect and approve the completed milestone.',
  },
  {
    q: 'What happens if there is a dispute on job quality or change in scope?',
    tag: 'Dispute Protocols',
    a: 'Connecta provides photographic before/after audit trails and on-site evidence logging. If a dispute arises, an independent trade inspector conducts a virtual arbitration within 24 hours, ensuring fair resolution before funds move.',
  },
  {
    q: 'How quickly can I withdraw my earnings to a Nigerian bank account?',
    tag: 'Payouts',
    a: 'Once a milestone is approved by your client, your earnings immediately reflect in your Available Balance. Withdrawals via NIBSS instant transfer to any Nigerian commercial bank (Zenith, GTBank, Access, Kuda) arrive in 2 to 15 minutes.',
  },
]

export function formatMinorToNaira(minor: number): string {
  const naira = minor / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(naira)
}
