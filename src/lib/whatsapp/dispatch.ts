/**
 * Connecta 2.0 Two-Way WhatsApp Artisan Dispatch Engine
 * Plain, authentic Kano Hausa vernacular designed for maximum clarity for local artisans.
 */

import {
  getBookingByNumber,
  updateBooking,
  findMatchingArtisans,
  ServerBookingContract,
  ServerUserProfile,
} from '@/lib/server/db'
import {
  sendTextMessage,
  sendInteractiveButtons,
} from './client'

const WHITELIST_NUMBERS = ['2349020222290', '2348100015498', '2349138826727']

export function resolveArtisanRecipient(customerPhone: string, defaultArtisanPhone?: string): string {
  const cleanCustomer = (customerPhone || '').replace(/[^0-9]/g, '')
  const cleanDefault = (defaultArtisanPhone || '').replace(/[^0-9]/g, '')

  if (WHITELIST_NUMBERS.includes(cleanDefault) && cleanDefault !== cleanCustomer) {
    return cleanDefault
  }

  // Dual-device test routing so both customer and artisan receive live WhatsApp messages
  if (cleanCustomer === '2348100015498') return '2349138826727'
  if (cleanCustomer === '2349138826727') return '2348100015498'
  if (cleanCustomer === '2349020222290') return '2348100015498'

  return '2348100015498'
}

/**
 * Dispatches an ultra-clear, simple job alert to the Kano artisan
 */
export async function dispatchJobToArtisan({
  booking,
  artisan,
  customerPhone,
}: {
  booking: ServerBookingContract
  artisan: ServerUserProfile
  customerPhone: string
}) {
  const targetRecipient = resolveArtisanRecipient(customerPhone, artisan?.phone)
  console.log(`[Dispatch Engine]: Dispatching #${booking.bookingNumber} to Artisan (${artisan.fullName}) at ${targetRecipient}`)

  updateBooking(booking.bookingNumber, {
    dispatchedArtisanPhone: targetRecipient,
    dispatchedAt: new Date().toISOString(),
  } as any)

  const alertBody =
    `🚨 *SABON AIKI A KANO! / NEW JOB ALERT*\n` +
    `Lamba: *#${booking.bookingNumber}*\n\n` +
    `📍 *Wurin Aiki:* ${booking.location}\n` +
    `🔧 *Gyaran:* ${booking.category}\n` +
    `📝 *Matsalar:* "${(booking as any).description || 'Bincike da Gyara'}"\n\n` +
    `💰 *Kuɗin Dubawa:* *₦5,000* (Yana Tsare a Connecta)\n\n` +
    `Shin zaka iya zuwa yanzu? Danna maɓallin ƙasa:`;

  return sendInteractiveButtons(
    targetRecipient,
    alertBody,
    [
      { id: `art_acc_${booking.bookingNumber}`, title: '✅ Na Karɓa / Accept' },
      { id: `art_dec_${booking.bookingNumber}`, title: '❌ Ba Zan Samu Ba' },
    ],
    '🛠️ Connecta Kano — Neman Ma\'aikaci',
    'Connecta Kano • An Tabbatar da Kuɗinka'
  )
}

/**
 * Handles two-way artisan responses from WhatsApp interactive buttons
 */
export async function handleArtisanAction({
  from,
  buttonId,
}: {
  from: string
  buttonId: string
}) {
  const cleanFrom = (from || '').replace(/[^0-9]/g, '')

  // 1. ARTISAN ACCEPTS JOB
  if (buttonId.startsWith('art_acc_')) {
    const bookingNumber = buttonId.replace('art_acc_', '')
    const booking = getBookingByNumber(bookingNumber)
    if (!booking) {
      return sendTextMessage(from, `❌ Ba a sami aikin mai lamba #${bookingNumber} ba.`)
    }

    updateBooking(bookingNumber, {
      bookingStatus: 'confirmed',
      assignedArtisanAcceptedAt: new Date().toISOString(),
      artisanPhone: cleanFrom,
    } as any)

    console.log(`[Artisan Accepted]: ${bookingNumber} accepted by ${cleanFrom}`)

    // Confirm to Artisan
    const artisanNotice =
      `✅ *MADALLA! AIKI YA TABBATA*\n` +
      `Lamba: *#${booking.bookingNumber}*\n\n` +
      `👤 *Mai Aiki:* ${booking.clientName}\n` +
      `📞 *Waya:* +${(booking as any).customerPhone || ''}\n` +
      `📍 *Wuri:* ${booking.location}\n` +
      `📝 *Matsala:* "${(booking as any).description || 'Gyara'}"\n\n` +
      `💰 *Kuɗin Dubawa (₦5,000):* Yana nan a tsare a Connecta Escrow.\n\n` +
      `Kira mai aiki ko danna maɓallin ƙasa da zarar ka kama hanya:`;

    await sendInteractiveButtons(
      from,
      artisanNotice,
      [
        { id: `art_route_${bookingNumber}`, title: '🚗 Na Kama Hanya' },
        { id: `art_arr_${bookingNumber}`, title: '📍 Na Isa Wurin' },
      ],
      '📍 Bayanin Mai Aiki / Customer Info',
      'Connecta Kano Dispatch'
    )

    // Notify Customer in real-time
    const customerPhone = (booking as any).customerPhone
    if (customerPhone) {
      const customerNotice =
        `🎉 *Ma'aikaci Ya Karɓi Aikinku!*\n` +
        `Lamba: *#${booking.bookingNumber}*\n\n` +
        `👤 *Sunan Ma'aikaci:* ${booking.providerName}\n` +
        `📞 *Waya:* +${cleanFrom}\n` +
        `⭐ *Maki:* ${booking.providerTitle}\n\n` +
        `Ma'aikacin zai kira ku ko ya kama hanya zuwa yankin ku (*${booking.location}*). Zamu sanar da ku idan ya tashi.`;

      await sendTextMessage(customerPhone, customerNotice)
    }

    return
  }

  // 2. ARTISAN EN ROUTE
  if (buttonId.startsWith('art_route_')) {
    const bookingNumber = buttonId.replace('art_route_', '')
    const booking = getBookingByNumber(bookingNumber)
    if (!booking) return

    updateBooking(bookingNumber, {
      bookingStatus: 'provider_en_route',
      enRouteAt: new Date().toISOString(),
    } as any)

    await sendInteractiveButtons(
      from,
      `🚗 *Mun Gane!*\nMun sanar da mai aiki cewa kana kan hanya.\n\nDanna ƙasa da zarar ka isa:`,
      [{ id: `art_arr_${bookingNumber}`, title: '📍 Na Isa Wurin' }],
      undefined,
      'Connecta Kano Dispatch'
    )

    const customerPhone = (booking as any).customerPhone
    if (customerPhone) {
      const customerNotice =
        `🚗 *Ma'aikaci Yana Kan Hanyar Zuwa!*\n\n` +
        `*${booking.providerName}* yana kan hanya zuwa wurin ku a *${booking.location}*.\n\n` +
        `Lambar wayar sa: +${cleanFrom}.`;

      await sendTextMessage(customerPhone, customerNotice)
    }

    return
  }

  // 3. ARTISAN ARRIVED ONSITE
  if (buttonId.startsWith('art_arr_')) {
    const bookingNumber = buttonId.replace('art_arr_', '')
    const booking = getBookingByNumber(bookingNumber)
    if (!booking) return

    updateBooking(bookingNumber, {
      bookingStatus: 'in_progress',
      arrivedAt: new Date().toISOString(),
    } as any)

    await sendInteractiveButtons(
      from,
      `📍 *Barka da Isowa!*\n\nFara duba kayan aikin. Da zarar ka duba ka gama ko an yi gyara, danna maɓallin ƙasa domin karɓar kuɗin ka:`,
      [{ id: `art_done_${bookingNumber}`, title: '🏁 Na Gama Aiki' }],
      undefined,
      'Connecta Kano Dispatch'
    )

    const customerPhone = (booking as any).customerPhone
    if (customerPhone) {
      const customerNotice =
        `📍 *Ma'aikaci Ya Isa Wurin Ku!*\n\n` +
        `*${booking.providerName}* ya iso a *${booking.location}* domin duba matsalar kayan ku.\n\n` +
        `_Da fatan za a nuna masa kayan aikin domin fara dubawa._`;

      await sendTextMessage(customerPhone, customerNotice)
    }

    return
  }

  // 4. ARTISAN WORK COMPLETED
  if (buttonId.startsWith('art_done_')) {
    const bookingNumber = buttonId.replace('art_done_', '')
    const booking = getBookingByNumber(bookingNumber)
    if (!booking) return

    updateBooking(bookingNumber, {
      bookingStatus: 'completed',
      completedAt: new Date().toISOString(),
    } as any)

    await sendTextMessage(
      from,
      `🏁 *An Aika Bukatar Biyan Kuɗi!*\n\nMun sanar da mai aiki cewa an gama aiki. Da zarar ya duba ya amince, za a tura maka kuɗin ka (₦5,000) kai tsaye.`
    )

    const customerPhone = (booking as any).customerPhone
    if (customerPhone) {
      const customerNotice =
        `🏁 *Ma'aikaci Ya Gama Dubawa / Aiki!*\n` +
        `Lamba: *#${bookingNumber}*\n\n` +
        `*${booking.providerName}* ya kammala aikin ku.\n\n` +
        `Da fatan za a duba aikin a gwada. Idan an gamsu, danna maɓallin da ke ƙasa domin sakin kuɗin ga ma'aikaci:`;

      await sendInteractiveButtons(
        customerPhone,
        customerNotice,
        [
          { id: `btn_release_escrow_${bookingNumber}`, title: '💰 Na Gamsu / Saki' }
        ],
        '✅ Tabbatar da Aiki / Escrow',
        'Connecta Kano Escrow'
      )
    }

    return
  }

  // 5. ARTISAN DECLINE JOB
  if (buttonId.startsWith('art_dec_')) {
    const bookingNumber = buttonId.replace('art_dec_', '')
    const booking = getBookingByNumber(bookingNumber)
    if (!booking) return

    console.log(`[Artisan Declined]: ${bookingNumber} declined by ${cleanFrom}`)

    await sendTextMessage(from, `Mun gane. Mun gode da ba da amsa akan lokaci. Za a tura aikin zuwa ga wani ma'aikaci.`)

    const nextCandidates = findMatchingArtisans(booking.category, booking.location)
    const nextArtisan = nextCandidates.find((a) => a.id !== booking.providerId)
    if (nextArtisan) {
      updateBooking(bookingNumber, {
        providerId: nextArtisan.id,
        providerName: nextArtisan.fullName,
        providerTitle: nextArtisan.headline,
      } as any)

      await dispatchJobToArtisan({
        booking: { ...booking, providerId: nextArtisan.id, providerName: nextArtisan.fullName },
        artisan: nextArtisan,
        customerPhone: (booking as any).customerPhone,
      })

      const customerPhone = (booking as any).customerPhone
      if (customerPhone) {
        await sendTextMessage(
          customerPhone,
          `🔄 *Ana Tura wa Wani Ma'aikaci...*\n\nMuna kan tura buƙatarku ta *#${bookingNumber}* zuwa ga wani ƙwararren ma'aikaci a yankin ku.`
        )
      }
    }
  }
}
