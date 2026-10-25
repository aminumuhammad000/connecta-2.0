import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getOrCreateWallet,
  getUserBookings,
  getServiceRequests,
  getSquads,
} from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getActiveUser()

    if (!user) {
      return errorResponse('No active user found. Please log in or complete onboarding.', 401)
    }

    const roleMode = user.activeRole === 'provider' ? 'provider' : 'client'
    const wallet = getOrCreateWallet(user.id, roleMode === 'provider' ? 10 : 25, user.currency)
    const bookings = getUserBookings(user.id, user.activeRole)
    const allRequests = getServiceRequests()
    const allSquads = getSquads()

    // Real in-flight bookings
    const inFlightBookings = bookings.filter((b) => b.bookingStatus === 'in_progress')
    const activeBooking = inFlightBookings[0] || bookings[0] || null

    // Compute metrics dynamically from server data
    const totalEscrowLockedMinor = bookings
      .filter((b) => b.escrowStatus === 'locked' || b.escrowStatus === 'partially_released')
      .reduce((acc, curr) => acc + curr.totalAmountMinor, 0)

    const activeMilestonesCount = bookings
      .flatMap((b) => b.milestones)
      .filter((m) => m.status === 'current').length

    const openJobsCount = allRequests.filter((r) => r.status === 'open').length

    const formatNaira = (minor: number) => {
      const val = minor / 100
      return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    const clientMetrics = [
      {
        label: 'Escrow Safeguarded',
        value: totalEscrowLockedMinor > 0 ? formatNaira(totalEscrowLockedMinor) : '₦0',
        subtext: totalEscrowLockedMinor > 0 ? 'Protected in Connecta Vault' : 'No active locked funds',
        iconType: 'shield',
        color: 'emerald',
      },
      {
        label: 'Active Milestones',
        value: activeMilestonesCount.toString(),
        subtext: activeMilestonesCount > 0 ? 'Under review or in progress' : 'Zero pending approvals',
        iconType: 'briefcase',
        color: 'blue',
      },
      {
        label: 'Available Balance',
        value: formatNaira(wallet.balanceMinor),
        subtext: 'Direct withdrawable vault',
        iconType: 'wallet',
        color: 'emerald',
      },
      {
        label: 'AI Sparks Balance',
        value: `${wallet.sparksBalance} Sparks`,
        subtext: 'Auto-matching & smart briefs',
        iconType: 'sparks',
        color: 'amber',
      },
    ]

    const providerMetrics = [
      {
        label: 'Escrow Locked',
        value: totalEscrowLockedMinor > 0 ? formatNaira(totalEscrowLockedMinor) : '₦0',
        subtext: totalEscrowLockedMinor > 0 ? 'Safe in Escrow Vault' : 'No pending release',
        iconType: 'shield',
        color: 'emerald',
      },
      {
        label: 'Active Contracts',
        value: inFlightBookings.length.toString(),
        subtext: inFlightBookings.length > 0 ? 'In-flight milestone execution' : 'Ready to accept jobs',
        iconType: 'briefcase',
        color: 'blue',
      },
      {
        label: 'Available Payouts',
        value: formatNaira(wallet.balanceMinor),
        subtext: 'Ready for instant bank transfer',
        iconType: 'wallet',
        color: 'emerald',
      },
      {
        label: 'AI Sparks Balance',
        value: `${wallet.sparksBalance} Sparks`,
        subtext: 'Lead bidding & boost tokens',
        iconType: 'sparks',
        color: 'amber',
      },
    ]

    // Recent marketplace jobs from server
    const recentJobs = allRequests.slice(0, 3)

    return successResponse({
      user: {
        id: user.id,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activeRole: user.activeRole,
        city: user.city,
        currency: user.currency,
        avatarUrl: user.avatarUrl,
        headline: user.headline,
        bio: user.bio,
        companyName: user.companyName,
        companySize: user.companySize,
      },
      wallet: {
        balanceMinor: wallet.balanceMinor,
        escrowBalanceMinor: wallet.escrowBalanceMinor,
        sparksBalance: wallet.sparksBalance,
        currency: wallet.currency,
      },
      metrics: roleMode === 'client' ? clientMetrics : providerMetrics,
      activeBooking,
      recentJobs,
      squads: allSquads,
      unreadNotifications: 0,
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch dashboard overview', 500)
  }
}
