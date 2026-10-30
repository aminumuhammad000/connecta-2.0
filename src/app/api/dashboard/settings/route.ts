import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { getActiveUser, upsertUser, getPlatformSettings } from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    return successResponse({
      profile: {
        id: user.id,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        city: user.city || 'Lagos',
        country: user.country || 'Nigeria',
        headline: user.headline || '',
        trade: user.trade || user.category || 'General Services',
        bio: user.bio || '',
        ninNumber: user.ninNumber || '',
        bankName: user.bankName || 'Guaranty Trust Bank (GTBank)',
        accountNumber: user.accountNumber || '0123456789',
        accountName: user.accountName || user.fullName || 'Verified Connecta Account',
        verificationStatus: user.verificationStatus || (user.role === 'provider' ? 'verified' : 'unverified'),
      },
      platformSettings: getPlatformSettings(),
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch settings', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const updatedUser = {
      ...user,
      fullName: body.fullName || user.fullName,
      phone: body.phone ?? user.phone,
      whatsapp: body.whatsapp ?? user.whatsapp,
      city: body.city ?? user.city,
      headline: body.headline ?? user.headline,
      bio: body.bio ?? user.bio,
      trade: body.trade ?? user.trade,
      bankName: body.bankName ?? user.bankName,
      accountNumber: body.accountNumber ?? user.accountNumber,
      accountName: body.accountName ?? user.accountName,
    }

    upsertUser(updatedUser)

    return successResponse({
      profile: updatedUser,
      message: 'Settings updated successfully.',
    })
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to update settings', 500)
  }
}
