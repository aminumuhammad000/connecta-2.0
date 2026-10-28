/**
 * WhatsApp Conversational Intake Engine for Connecta 2.0
 * Hyper-local Kano repair & artisanal services state machine.
 * Connected to persistent storage engine with authentic Kano Hausa vernacular,
 * Two-Way WhatsApp Artisan Dispatch loop, and Escrow Milestone management.
 */

import {
  sendTextMessage,
  sendInteractiveButtons,
  sendInteractiveList,
  markMessageAsRead,
} from './client'
import {
  getWhatsAppSession,
  saveWhatsAppSession,
  createWhatsAppOrder,
  getOrCreateWhatsAppCustomer,
  findMatchingArtisans,
  ServerWhatsAppSession,
} from '@/lib/server/db'
import {
  dispatchJobToArtisan,
  handleArtisanAction,
} from './dispatch'
import {
  generateEscrowPaymentLink,
  releaseEscrowPayout,
} from './escrow'

export const KANO_NEIGHBORHOODS = [
  'Nassarawa (GRA / Bompai)',
  'Tarauni (Gyadi-Gyadi)',
  'Fagge (Sabon Gari)',
  'Dala (Gwammaja)',
  'Gwale (Kabuga / BUK Rd)',
  'Kano Municipal (Kofar Na\'isa)',
  'Kumbotso (Panshekara)',
  'Ungogo (Rijiyar Zaki)',
]

export const SERVICE_CATEGORIES = [
  { id: 'cat_solar', title: '☀️ Solar & Inverter', desc: 'Batir, Panel, Inverter & Caji' },
  { id: 'cat_generator', title: '⚡ Gyaran Generator', desc: 'Mikano, Lister, injin Fetur & Dizal' },
  { id: 'cat_ac', title: '❄️ AC & Firiji', desc: 'Chaja Gas, Komfreso, Gyaran sanyi' },
  { id: 'cat_electrical', title: '🔌 Waya & Lantarki', desc: 'DB Board, Short circuit, Waya sabuwa' },
  { id: 'cat_plumbing', title: '💧 Famfo & Ruwa', desc: 'Borehole, Tanka, Toshewa & Ɗigogi' },
]

export async function handleIncomingWhatsAppMessage(message: any, contact: any) {
  const rawFrom = message.from // e.g. "2349020222290"
  const cleanFrom = rawFrom.replace(/[^0-9]/g, '')
  const messageId = message.id
  const userName = contact?.profile?.name || 'Customer'

  // Mark message as read (blue tick)
  if (messageId) {
    try {
      await markMessageAsRead(messageId)
    } catch {
      // Non-fatal
    }
  }

  // Determine incoming message text / selection
  let incomingText = ''
  let buttonId = ''

  if (message.type === 'text') {
    incomingText = message.text?.body?.trim() || ''
  } else if (message.type === 'interactive') {
    if (message.interactive?.type === 'button_reply') {
      buttonId = message.interactive.button_reply?.id || ''
      incomingText = message.interactive.button_reply?.title || ''
    } else if (message.interactive?.type === 'list_reply') {
      buttonId = message.interactive.list_reply?.id || ''
      incomingText = message.interactive.list_reply?.title || ''
    }
  }

  // 1. TWO-WAY ARTISAN DISPATCH ACTIONS (Accept, En Route, Arrived, Done, Decline)
  if (buttonId.startsWith('art_')) {
    return handleArtisanAction({ from: rawFrom, buttonId })
  }

  // 2. CUSTOMER ESCROW RELEASE ACTION
  if (buttonId.startsWith('btn_release_escrow_')) {
    const bookingNumber = buttonId.replace('btn_release_escrow_', '')
    return releaseEscrowPayout({ bookingNumber })
  }

  // 3. CUSTOMER RATING ACTION
  if (buttonId.startsWith('rate_')) {
    const parts = buttonId.split('_')
    const stars = parts[1]
    const bookingNumber = parts.slice(2).join('_')
    return sendTextMessage(
      rawFrom,
      `⭐ Mun gode ƙwarai da bamu maki (${stars} Stars) akan aikin mai lamba *#${bookingNumber}*!\n\nMuna fatan sake yi muku hidima a Connecta Kano 🇳🇬.`
    )
  }

  // Ensure customer profile is recorded in persistent database
  getOrCreateWhatsAppCustomer(cleanFrom, userName)

  // Retrieve persistent session from database
  let session = getWhatsAppSession(cleanFrom)
  if (!session) {
    session = {
      phone: cleanFrom,
      name: userName,
      language: 'ha',
      step: 'GREETING',
      lastActive: new Date().toISOString(),
    }
    saveWhatsAppSession(session)
  }

  const lower = incomingText.toLowerCase()

  // Language selection / detection
  if (buttonId === 'lang_en' || lower === 'english' || lower === 'en') {
    session.language = 'en'
  } else if (buttonId === 'lang_ha' || lower.includes('hausa') || lower.startsWith('sannu') || lower.includes('ina son')) {
    session.language = 'ha'
  }

  const isHausa = session.language !== 'en'

  // RESET / RESTART / MENU / GREETING
  if (
    lower === 'restart' ||
    lower === 'reset' ||
    lower === 'menu' ||
    lower === 'sannu' ||
    lower === 'hi' ||
    lower === 'hello' ||
    session.step === 'GREETING'
  ) {
    session.step = 'CATEGORY'
    session.name = userName
    session.lastActive = new Date().toISOString()
    saveWhatsAppSession(session)

    const greetingBody = isHausa
      ? `Sannu da zuwa *Connecta Kano* 🇳🇬\n\nMuna haɗa ku da ƙwararrun ma'aikatan gyara a Kano cikin amana da cikakken tsaro (*Escrow*).\n\n*Wane irin gyara kuke buƙata yau?*`
      : `Sannu da zuwa, *${userName}*! Welcome to *Connecta Kano* 🇳🇬\n\nWe connect you with vetted, background-checked repair specialists across Kano with guaranteed Escrow protection.\n\n*What service do you need help with today?*`

    return sendInteractiveList(
      rawFrom,
      greetingBody,
      isHausa ? 'Zaɓi Sabis' : 'Select Service',
      [
        {
          title: isHausa ? 'Shahararrun Sabis a Kano' : 'Popular Services in Kano',
          rows: SERVICE_CATEGORIES.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.desc,
          })),
        },
      ],
      '🛠️ Connecta Kano — Sabis na Gyara'
    )
  }

  // STEP: CATEGORY SELECTION
  if (session.step === 'CATEGORY' || buttonId.startsWith('cat_')) {
    const matchedCategory = SERVICE_CATEGORIES.find((c) => c.id === buttonId) || {
      id: 'cat_custom',
      title: incomingText || session.selectedCategory || 'Gyara',
    }

    session.selectedCategory = matchedCategory.title
    session.step = 'NEIGHBORHOOD'
    saveWhatsAppSession(session)

    const neighborhoodPrompt = isHausa
      ? `Madalla! Kun zaɓi *${session.selectedCategory}*.\n\nDomin turo muku da ƙwararren ma'aikaci mafi kusa, *a wane yanki kuke a Kano?*`
      : `Great! You selected *${session.selectedCategory}*.\n\nTo match you with the closest certified technician, *which Kano neighborhood are you located in?*`

    return sendInteractiveList(
      rawFrom,
      neighborhoodPrompt,
      isHausa ? 'Zaɓi Yanki' : 'Select Area',
      [
        {
          title: isHausa ? 'Yankunan Birnin Kano' : 'Kano Neighborhoods',
          rows: KANO_NEIGHBORHOODS.map((area, idx) => ({
            id: `area_${idx}`,
            title: area.split(' ')[0],
            description: area,
          })),
        },
      ],
      '📍 Wurin da Kuke a Kano'
    )
  }

  // STEP: NEIGHBORHOOD SELECTION
  if (session.step === 'NEIGHBORHOOD' || buttonId.startsWith('area_')) {
    session.neighborhood = incomingText
    session.step = 'DESCRIPTION'
    saveWhatsAppSession(session)

    const descPrompt = isHausa
      ? `Mun gane! Yankin da kuke: *${session.neighborhood}* 📍\n\nDon Allah rubuta gajeren bayani game da matsalar (misali: sunan kamfanin inverter/generator, ko abin da ya lalace):`
      : `Got it! Location set to *${session.neighborhood}* 📍\n\nPlease briefly describe the issue (e.g. brand, error code, symptoms, or what needs replacement):`

    return sendTextMessage(rawFrom, descPrompt)
  }

  // STEP: ISSUE DESCRIPTION -> ORDER CREATION, ESCROW & ARTISAN DISPATCH
  if (session.step === 'DESCRIPTION') {
    session.description = incomingText

    // Create persistent order & booking in database with matching artisan
    const { serviceRequest, booking, artisan } = createWhatsAppOrder({
      phone: cleanFrom,
      name: userName,
      category: session.selectedCategory || 'Gyara',
      neighborhood: session.neighborhood || 'Kano',
      description: incomingText,
    })

    const bookingRef = booking.bookingNumber
    const escrowUrl = generateEscrowPaymentLink({
      bookingNumber: bookingRef,
      amount: 5000,
      customerPhone: cleanFrom,
      category: session.selectedCategory,
      neighborhood: session.neighborhood,
    })

    const summary = isHausa
      ? `✅ *An Karɓi Buƙatarku!* (Lamba: *#${bookingRef}*)\n\n` +
        `🛠️ *Gyara:* ${session.selectedCategory}\n` +
        `📍 *Wuri:* ${session.neighborhood}, Kano\n` +
        `👤 *Ma'aikaci:* *${artisan.fullName}* (${artisan.rating || '4.95'}★)\n\n` +
        `🛡️ *Kuɗin Dubawa (Callout):* *₦5,000* (A Tsare a Connecta)\n\n` +
        `Domin tura ma'aikaci nan take, amince da ajiye kuɗin a tsare:\n👉 ${escrowUrl}\n\n` +
        `_Kuɗin ku na nan a kulle. Ba za a biya ma'aikaci ba har sai kun duba aikin kuma kun gamsu._`
      : `✅ *Request Received & Verified!* (Ref: *${bookingRef}*)\n\n` +
        `🛠️ *Service:* ${session.selectedCategory}\n` +
        `📍 *Location:* ${session.neighborhood}, Kano\n` +
        `👤 *Matched Specialist:* *${artisan.fullName}* (${artisan.rating || '4.95'}★)\n\n` +
        `🛡️ *Diagnostic & Callout Fee:* *₦5,000* (Guaranteed in Connecta Escrow)\n\n` +
        `To lock your appointment and dispatch the specialist right now, approve payment securely via Connecta Escrow:\n👉 ${escrowUrl}\n\n` +
        `_Your funds remain locked and are only released to the artisan after you test and confirm the job is done._`

    await sendTextMessage(rawFrom, summary)

    // REAL-TIME TWO-WAY ARTISAN DISPATCH LOOP
    try {
      await dispatchJobToArtisan({
        booking,
        artisan,
        customerPhone: cleanFrom,
      })
    } catch (dispErr: any) {
      console.error('[Error dispatching job to artisan]:', dispErr.message)
    }

    return sendInteractiveButtons(rawFrom, isHausa ? 'Kuna buƙatar wani abu kuma?' : 'Would you like anything else?', [
      { id: 'btn_call_support', title: isHausa ? '📞 Tuntubi Support' : '📞 Speak with Support' },
      { id: 'btn_new_request', title: isHausa ? '🔄 Sabon Nemi' : '🔄 New Request' },
    ])
  }

  // BUTTON CLICKS POST-MATCHING
  if (buttonId === 'btn_new_request') {
    session.step = 'GREETING'
    saveWhatsAppSession(session)
    return handleIncomingWhatsAppMessage({ type: 'text', text: { body: 'restart' }, from: rawFrom, id: messageId }, contact)
  }

  if (buttonId === 'btn_call_support') {
    const supportMsg = isHausa
      ? `Teburin tallafin Connecta a Kano yana buɗe Litinin - Asabar 8AM - 8PM.\nWaya ko WhatsApp: +234 806 237 2418\nEmail: support@myconnecta.ng`
      : `Our Kano support desk is available Mon - Sat 8AM - 8PM.\nCall or WhatsApp: +234 806 237 2418\nEmail: support@myconnecta.ng`
    return sendTextMessage(rawFrom, supportMsg)
  }

  // DEFAULT FALLBACK
  const fallbackMsg = isHausa
    ? `Mun gode da tuntuɓar Connecta Kano. Rubuta *menu* kowane lokaci domin fara sabon neman gyara.`
    : `Thank you for messaging Connecta. Type *menu* anytime to start a new request or view services.`
  return sendTextMessage(rawFrom, fallbackMsg)
}
