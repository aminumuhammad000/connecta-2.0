/**
 * Connecta 2.0 WhatsApp Escrow Milestone Manager
 * Handles escrow checkout links, payment confirmations, and milestone releases
 * with authentic Kano Hausa vernacular.
 */

import {
  getBookingByNumber,
  updateBooking,
  addTransaction,
} from '@/lib/server/db'
import { sendTextMessage, sendInteractiveButtons } from './client'

const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://middle-father-equipped-ecology.trycloudflare.com'

export function generateEscrowPaymentLink({
  bookingNumber,
  amount = 5000,
  customerPhone,
  category,
  neighborhood,
}: {
  bookingNumber: string
  amount?: number
  customerPhone?: string
  category?: string
  neighborhood?: string
}) {
  const cleanPhone = (customerPhone || '').replace(/[^0-9]/g, '')
  return `${PUBLIC_BASE_URL}/bookings/new?ref=${bookingNumber}&amount=${amount}&cat=${encodeURIComponent(
    category || 'Gyara'
  )}&area=${encodeURIComponent(neighborhood || 'Kano')}&phone=${cleanPhone}`
}

export async function handleEscrowPaymentSuccess({
  bookingNumber,
  transactionId,
  amount = 5000,
}: {
  bookingNumber: string
  transactionId?: string
  amount?: number
}) {
  const booking = getBookingByNumber(bookingNumber)
  if (!booking) return null

  const updatedBooking = updateBooking(bookingNumber, {
    escrowStatus: 'locked',
    escrowPaidAt: new Date().toISOString(),
    totalAmountMinor: amount * 100,
  } as any)

  addTransaction({
    userId: booking.customerId,
    title: `Escrow Locked: #${bookingNumber}`,
    type: 'escrow_lock',
    amountMinor: amount * 100,
    currency: 'NGN',
    status: 'completed',
    reference: `FLW-${transactionId || Date.now()}`,
  })

  // 1. Send receipt to Customer
  const customerPhone = (booking as any).customerPhone
  if (customerPhone) {
    const customerReceipt =
      `🛡️ *Biya Ya Tabbata! (₦${amount.toLocaleString()})*\n` +
      `Lamba: *#${bookingNumber}*\n\n` +
      `✅ An ajiye kuɗin ku a tsare a Connecta Escrow.\n\n` +
      `📌 *Amana da Tsaro:* Kuɗin ku na nan a kulle. Ma'aikaci ba zai samu ko sisi ba har sai kun duba aikin kuma kun gamsu.\n\n` +
      `Ma'aikacin ku *${booking.providerName}* yana nan tafe.`

    await sendTextMessage(customerPhone, customerReceipt).catch(console.error)
  }

  // 2. Alert Artisan that escrow is funded
  const artisanPhone = (booking as any).artisanPhone || (booking as any).dispatchedArtisanPhone
  if (artisanPhone) {
    const artisanAlert =
      `💰 *Kuɗin Aiki Yana Tsare!*\n` +
      `Lamba: *#${bookingNumber}*\n\n` +
      `Mai aiki ya ajiye *₦${amount.toLocaleString()}* a Connecta Escrow.\n\n` +
      `An baka cikakken tabbacin biya da zarar ka duba ka gama aiki.`

    await sendTextMessage(artisanPhone, artisanAlert).catch(console.error)
  }

  return updatedBooking
}

export async function releaseEscrowPayout({
  bookingNumber,
}: {
  bookingNumber: string
}) {
  const booking = getBookingByNumber(bookingNumber)
  if (!booking) return null

  const amount = (booking.totalAmountMinor || 500000) / 100

  const updatedBooking = updateBooking(bookingNumber, {
    escrowStatus: 'released',
    bookingStatus: 'completed',
  } as any)

  // 1. Send payout alert to Artisan
  const artisanPhone = (booking as any).artisanPhone || (booking as any).dispatchedArtisanPhone
  if (artisanPhone) {
    const payoutAlert =
      `🎉 *An Tura Maka Kuɗin Aiki!*\n` +
      `Lamba: *#${bookingNumber}*\n\n` +
      `Mai aiki ya amince da aikin ka!\n\n` +
      `💵 *Adadi:* ₦${amount.toLocaleString()}\n` +
      `An tura kuɗin zuwa asusun ka na Connecta. Mun gode da aiki mai kyau!`

    await sendTextMessage(artisanPhone, payoutAlert).catch(console.error)
  }

  // 2. Send rating prompt to Customer
  const customerPhone = (booking as any).customerPhone
  if (customerPhone) {
    const customerPrompt =
      `⭐ *Mun Gode da Yin Aiki da Connecta!*\n` +
      `Lamba: *#${bookingNumber}*\n\n` +
      `An gama aikin ku tare da *${booking.providerName}* cikin nasara, kuma an saki kuɗin aikin.\n\n` +
      `Yaya kuka ga aikin sa? Don Allah a bashi maki:`

    await sendInteractiveButtons(
      customerPhone,
      customerPrompt,
      [
        { id: `rate_5_${bookingNumber}`, title: '⭐⭐⭐⭐⭐ 5 Stars' },
        { id: `rate_4_${bookingNumber}`, title: '⭐⭐⭐⭐ 4 Stars' },
        { id: `rate_3_${bookingNumber}`, title: '⭐⭐⭐ 3 Stars' },
      ],
      undefined,
      'Connecta Kano Rating'
    ).catch(console.error)
  }

  return updatedBooking
}
