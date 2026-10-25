import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getUserBookings,
  addBooking,
  updateWalletBalance,
  addTransaction,
  ServerBookingContract,
} from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || 'all'

    let bookings = getUserBookings(user.id, user.activeRole)

    if (statusFilter !== 'all') {
      bookings = bookings.filter((b) => {
        if (statusFilter === 'active') return b.bookingStatus === 'in_progress' || b.bookingStatus === 'pending'
        if (statusFilter === 'completed') return b.bookingStatus === 'completed'
        if (statusFilter === 'disputed') return b.bookingStatus === 'disputed'
        return true
      })
    }

    return successResponse(bookings)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch projects', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const {
      title,
      category,
      providerId,
      providerName,
      providerTitle,
      totalAmountMinor,
      milestones,
      location,
      appointmentDate,
    } = body

    if (!title || !totalAmountMinor) {
      return errorResponse('Title and total amount are required', 422)
    }

    const bookingId = `CN-${Math.floor(100000 + Math.random() * 900000)}`

    const newBooking: ServerBookingContract = {
      id: bookingId,
      bookingNumber: `#${bookingId}`,
      customerId: user.id,
      clientName: user.fullName,
      clientCompany: user.companyName || `${user.fullName} Workspace`,
      clientAvatar: user.avatarUrl || undefined,
      providerId: providerId || 'unassigned',
      providerName: providerName || 'Assigned Specialist',
      providerTitle: providerTitle || 'Verified Specialist',
      title,
      category: category || 'General Trade',
      location: location || `${user.city}, Nigeria`,
      totalAmountMinor: Number(totalAmountMinor),
      currency: user.currency || 'NGN',
      escrowStatus: 'locked',
      bookingStatus: 'in_progress',
      progressPercentage: 0,
      appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
      milestones: milestones && milestones.length > 0 ? milestones : [
        {
          id: `M-${Date.now()}-1`,
          title: 'Initial On-site Survey & Materials Mobilization',
          amountMinor: Math.round(Number(totalAmountMinor) * 0.4),
          status: 'current',
        },
        {
          id: `M-${Date.now()}-2`,
          title: 'Full Installation & Technical Commissioning',
          amountMinor: Math.round(Number(totalAmountMinor) * 0.6),
          status: 'pending',
        },
      ],
      createdAt: new Date().toISOString(),
    }

    addBooking(newBooking)

    // Lock funds in escrow
    updateWalletBalance(user.id, 0, Number(totalAmountMinor))
    addTransaction({
      userId: user.id,
      title: `Escrow Locked: ${title}`,
      type: 'escrow_lock',
      amountMinor: Number(totalAmountMinor),
      currency: user.currency || 'NGN',
      status: 'completed',
      reference: `LOCK-${bookingId}`,
    })

    return successResponse(newBooking, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create project booking', 500)
  }
}
