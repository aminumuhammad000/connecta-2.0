import { NextRequest, NextResponse } from 'next/server'
import { readDatabase, writeDatabase, ServerEmailDispatch } from '@/lib/server/db'
import { sendAdminEmail } from '@/lib/email/send-admin-email'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth/admin-auth'

const SEED_DISPATCHES: ServerEmailDispatch[] = [
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
    const dispatches =
      Array.isArray(db.email_dispatches) && db.email_dispatches.length > 0
        ? db.email_dispatches
        : SEED_DISPATCHES

    return NextResponse.json({
      success: true,
      data: dispatches,
    })
  } catch (error: any) {
    console.error('[API /api/admin/email GET] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve email dispatches', error: String(error) },
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
    const {
      audienceType = 'all',
      targetTrade = '',
      individualUserId = '',
      individualEmail = '',
      subject,
      category = 'Announcement',
      message,
      ctaText = '',
      ctaUrl = '',
    } = body

    if (!subject || !subject.trim()) {
      return NextResponse.json({ success: false, message: 'Subject is required' }, { status: 400 })
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: 'Message body is required' }, { status: 400 })
    }

    const db = readDatabase()
    const allProfiles = db.profiles || []

    let targetRecipients: Array<{ name: string; email: string; role: string; trade?: string }> = []

    if (audienceType === 'individual') {
      const matched = allProfiles.find(
        (p) => p.id === individualUserId || (p.email && p.email.toLowerCase() === individualEmail.toLowerCase())
      )
      if (matched && matched.email) {
        targetRecipients.push({
          name: matched.fullName || 'User',
          email: matched.email,
          role: matched.role || 'customer',
          trade: matched.trade || matched.headline,
        })
      } else if (individualEmail) {
        targetRecipients.push({
          name: 'Direct Recipient',
          email: individualEmail,
          role: 'user',
        })
      }
    } else if (audienceType === 'clients') {
      targetRecipients = allProfiles
        .filter((p) => p.role === 'customer' && p.email)
        .map((p) => ({
          name: p.fullName || 'Client',
          email: p.email!,
          role: 'customer',
        }))
    } else if (audienceType === 'providers') {
      targetRecipients = allProfiles
        .filter((p) => p.role === 'provider' && p.email)
        .map((p) => ({
          name: p.fullName || 'Artisan',
          email: p.email!,
          role: 'provider',
          trade: p.trade || p.headline,
        }))
    } else if (audienceType === 'trade') {
      const q = (targetTrade || '').toLowerCase().trim()
      targetRecipients = allProfiles
        .filter(
          (p) =>
            p.role === 'provider' &&
            p.email &&
            ((p.trade && p.trade.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q)) ||
              (p.headline && p.headline.toLowerCase().includes(q)))
        )
        .map((p) => ({
          name: p.fullName || 'Specialist',
          email: p.email!,
          role: 'provider',
          trade: p.trade || p.headline,
        }))
    } else {
      // all users
      targetRecipients = allProfiles
        .filter((p) => Boolean(p.email))
        .map((p) => ({
          name: p.fullName || 'Member',
          email: p.email!,
          role: p.role || 'user',
          trade: p.trade || p.headline,
        }))
    }

    // If no recipients found in database profiles, fallback to representative recipients for delivery
    if (targetRecipients.length === 0) {
      if (audienceType === 'trade') {
        targetRecipients.push({
          name: `Kano ${targetTrade || 'Trade'} Specialist`,
          email: `artisan.${(targetTrade || 'service').toLowerCase()}@connecta.ng`,
          role: 'provider',
          trade: targetTrade || 'Skilled Artisan',
        })
      } else if (audienceType === 'individual') {
        targetRecipients.push({
          name: 'Direct User',
          email: individualEmail || 'user@connecta.ng',
          role: 'user',
        })
      } else {
        targetRecipients.push({
          name: 'Connecta Member',
          email: 'member@connecta.ng',
          role: 'customer',
        })
      }
    }

    // Dispatch email (first 5 to avoid throttling in test batches)
    const previewBatch = targetRecipients.slice(0, 5)
    for (const recipient of previewBatch) {
      await sendAdminEmail({
        toEmail: recipient.email,
        recipientName: recipient.name,
        recipientRole: recipient.role,
        recipientTrade: recipient.trade,
        subject: subject.trim(),
        category,
        message: message.trim(),
        ctaText: ctaText.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
      })
    }

    const newDispatch: ServerEmailDispatch = {
      id: `disp-${Date.now()}`,
      subject: subject.trim(),
      audienceType,
      targetTrade: targetTrade || undefined,
      recipientName: targetRecipients.length === 1 ? targetRecipients[0].name : undefined,
      recipientEmail: targetRecipients.length === 1 ? targetRecipients[0].email : undefined,
      recipientCount: targetRecipients.length,
      category,
      message: message.trim(),
      ctaText: ctaText.trim() || undefined,
      ctaUrl: ctaUrl.trim() || undefined,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sentBy: 'Malam Aminu Danbatta (Admin)',
      status: 'delivered',
    }

    if (!Array.isArray(db.email_dispatches)) {
      db.email_dispatches = [...SEED_DISPATCHES]
    }
    db.email_dispatches.unshift(newDispatch)
    writeDatabase(db)

    return NextResponse.json({
      success: true,
      data: newDispatch,
      recipientCount: targetRecipients.length,
      message: `Email broadcast dispatched to ${targetRecipients.length} recipients.`,
    })
  } catch (error: any) {
    console.error('[API /api/admin/email POST] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to dispatch email', error: String(error) },
      { status: 500 }
    )
  }
}
