import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  readDatabase,
  getPlatformSettings,
  updatePlatformSettings,
  addInAppNotification,
  getInAppNotifications,
  adjustUserBalance,
  toggleFeaturedProvider,
  approveWithdrawal,
  rejectWithdrawal,
  settleDisputeWithSplit,
  moderateServiceRequest,
} from '../src/lib/server/db.ts'

describe('Admin Governance & Dashboard Control Suite', () => {
  const db = readDatabase()
  const testUserId = db.profiles[0]?.id || 'test-user-001'

  test('1. Platform Settings Live Synchronization', () => {
    const initial = getPlatformSettings()
    assert.ok(initial.supportPhone)
    assert.ok(initial.supportEmail)

    const updated = updatePlatformSettings({
      supportPhone: '+234 800 CONNECTA',
      systemAnnouncement: 'Test Announcement Broadcast',
      announcementActive: true,
    })

    assert.equal(updated.supportPhone, '+234 800 CONNECTA')
    assert.equal(updated.systemAnnouncement, 'Test Announcement Broadcast')
    assert.equal(updated.announcementActive, true)

    const reloaded = getPlatformSettings()
    assert.equal(reloaded.supportPhone, '+234 800 CONNECTA')
  })

  test('2. Manual Wallet and Sparks Adjustment with Audit Trail', () => {
    const userWallet = db.wallets.find((w) => w.userId === testUserId)
    const initialBalance = userWallet ? userWallet.balanceMinor : 0
    const initialSparks = userWallet ? userWallet.sparksBalance : 0

    const success = adjustUserBalance(testUserId, 5000000, 150, 'Test Goodwill Bonus')
    assert.equal(success, true)

    const updatedWallet = db.wallets.find((w) => w.userId === testUserId)
    assert.equal(updatedWallet.balanceMinor, initialBalance + 5000000)
    assert.equal(updatedWallet.sparksBalance, initialSparks + 150)

    const tx = db.wallet_transactions.find((t) => t.userId === testUserId && t.type === 'admin_adjustment')
    assert.ok(tx)
    assert.equal(tx.amountMinor, 5000000)
    assert.ok(tx.title.includes('Test Goodwill Bonus'))
  })

  test('3. Featured Provider Curation on User Dashboard', () => {
    const provider = db.profiles.find((p) => p.role === 'provider') || db.profiles[0]
    const pId = provider.id

    toggleFeaturedProvider(pId, true)
    const updatedProfile = db.profiles.find((p) => p.id === pId)
    assert.equal(updatedProfile.isFeatured, true)

    const featuredList = readDatabase().profiles.filter((p) => p.isFeatured)
    assert.ok(featuredList.length > 0)
  })

  test('4. Withdrawal Payout Lifecycle: Approval & Rejection Refund', () => {
    // Test transaction
    const withdrawalTxId = `TX-TEST-WIT-${Date.now()}`
    db.wallet_transactions.unshift({
      id: withdrawalTxId,
      userId: testUserId,
      title: 'Bank Transfer Payout (Zenith Bank - 4421)',
      type: 'withdrawal',
      amountMinor: 2000000, // ₦20,000
      currency: 'NGN',
      status: 'pending',
      reference: `WIT-TEST-${Date.now().toString().slice(-6)}`,
      bankName: 'Zenith Bank',
      accountNumber: '2081944210',
      date: new Date().toISOString(),
    })

    const approved = approveWithdrawal(withdrawalTxId, 'NIP-CBN-991204')
    assert.equal(approved, true)

    const completedTx = db.wallet_transactions.find((t) => t.id === withdrawalTxId)
    assert.equal(completedTx.status, 'completed')
    assert.equal(completedTx.payoutReference, 'NIP-CBN-991204')

    // Test rejection & refund
    const rejectTxId = `TX-TEST-REJ-${Date.now()}`
    db.wallet_transactions.unshift({
      id: rejectTxId,
      userId: testUserId,
      title: 'Bank Transfer Payout (GTBank - 1102)',
      type: 'withdrawal',
      amountMinor: 1000000,
      currency: 'NGN',
      status: 'pending',
      reference: `WIT-REJ-${Date.now().toString().slice(-6)}`,
      bankName: 'GTBank',
      accountNumber: '0129481102',
      date: new Date().toISOString(),
    })

    const rejected = rejectWithdrawal(rejectTxId, 'Account name mismatch')
    assert.equal(rejected, true)

    const failedTx = db.wallet_transactions.find((t) => t.id === rejectTxId)
    assert.equal(failedTx.status, 'failed')
  })

  test('5. In-App Notification Broadcast to User Dashboards', () => {
    const notif = addInAppNotification({
      userId: 'all',
      title: 'Platform Maintenance Notice',
      message: 'Scheduled backup tonight at 11:30 PM.',
      type: 'warning',
    })

    assert.ok(notif.id)
    assert.equal(notif.title, 'Platform Maintenance Notice')

    const userNotifs = getInAppNotifications(testUserId)
    const found = userNotifs.find((n) => n.id === notif.id)
    assert.ok(found)
  })

  test('6. Dispute Custom Split Settlement Payout', () => {
    const testDisputeId = `DISP-TEST-${Date.now()}`
    const testBookingId = `BK-TEST-${Date.now()}`

    db.bookings.unshift({
      id: testBookingId,
      bookingNumber: `CON-TEST-${Date.now().toString().slice(-4)}`,
      customerId: testUserId,
      clientName: 'Test Client',
      providerId: db.profiles[1]?.id || 'test-provider-002',
      providerName: 'Test Specialist',
      providerTitle: 'Master Electrician',
      title: 'Split Settlement Verification Job',
      category: 'Electrical & Solar',
      location: 'Kano',
      totalAmountMinor: 10000000, // ₦100,000
      currency: 'NGN',
      escrowStatus: 'locked',
      bookingStatus: 'in_progress',
      progressPercentage: 50,
      appointmentDate: '2026-10-28',
      milestones: [
        { id: 'm-split-1', title: 'Phase 1', amountMinor: 10000000, status: 'current' },
      ],
      createdAt: new Date().toISOString(),
    })

    db.disputes.unshift({
      id: testDisputeId,
      disputeNumber: `DISP-TEST-SPLIT`,
      bookingId: testBookingId,
      bookingNumber: `CON-TEST`,
      bookingTitle: 'Split Settlement Verification Job',
      amountMinor: 10000000,
      claimantName: 'Test Client',
      claimantRole: 'Customer',
      respondentName: 'Test Specialist',
      respondentRole: 'Provider',
      reason: 'Partial completion dispute',
      status: 'mediation',
      filedDate: '2026-10-26',
      lastUpdate: '2026-10-26 10:00',
      evidenceItems: 1,
      notes: 'Initial claim',
    })

    const settled = settleDisputeWithSplit(testDisputeId, 60, 40, 'Specialist finished wiring; client buys accessories')
    assert.equal(settled, true)

    const dispute = db.disputes.find((d) => d.id === testDisputeId)
    assert.equal(dispute.status, 'resolved')
    assert.ok(dispute.notes.includes('60% Specialist / 40% Client'))

    const booking = db.bookings.find((b) => b.id === testBookingId)
    assert.equal(booking.escrowStatus, 'released')
  })

  test('7. Job Request Moderation & Cancellation', () => {
    const testReqId = `REQ-TEST-${Date.now()}`
    db.service_requests.unshift({
      id: testReqId,
      customerId: testUserId,
      customerName: 'Test Requester',
      title: 'Spam Testing Request Title',
      category: 'General',
      categorySlug: 'general',
      description: 'Spam body text to be moderated',
      urgency: 'scheduled',
      serviceMode: 'onsite',
      city: 'Kano',
      state: 'Kano State',
      budgetMinMinor: 1000000,
      budgetMaxMinor: 2000000,
      currency: 'NGN',
      status: 'open',
      requiredSkills: [],
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
    })

    const moderated = moderateServiceRequest(testReqId, 'cancelled', {
      title: '[REMOVED] Inappropriate Request Content',
    })
    assert.equal(moderated, true)

    const req = db.service_requests.find((r) => r.id === testReqId)
    assert.equal(req.status, 'cancelled')
    assert.equal(req.title, '[REMOVED] Inappropriate Request Content')
  })
})
