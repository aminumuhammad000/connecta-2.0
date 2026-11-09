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
import {
  extractKanoRepairIntent,
} from '@/lib/ai/whatsapp-nlu'

const DIVIDER = '────────────────────────'

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
  { id: 'cat_solar', title: 'Solar da Inverter', desc: 'Batir, Panel, Inverter & Caji', en: 'Solar & Inverter' },
  { id: 'cat_generator', title: 'Gyaran Generator', desc: 'Mikano, Lister, Injin Fetur & Dizal', en: 'Generator Repair' },
  { id: 'cat_ac', title: 'AC da Firiji', desc: 'Chaja Gas, Komfreso, Gyaran Sanyi', en: 'AC & Refrigeration' },
  { id: 'cat_electrical', title: 'Waya da Lantarki', desc: 'DB Board, Short Circuit, Waya Sabuwa', en: 'Electrical Wiring' },
  { id: 'cat_plumbing', title: 'Famfo da Ruwa', desc: 'Borehole, Tanka, Zubar Ruwa & Toshewa', en: 'Plumbing & Water' },
]

export const ARRIVAL_SLOTS = [
  { id: 'slot_urgent', titleHa: '⚡ Yanzu-Yanzu', titleEn: '⚡ Immediate', descHa: 'Yanzu-Yanzu · Cikin Minti 45', descEn: 'Immediate · Within 45 mins' },
  { id: 'slot_afternoon', titleHa: '⛅ Yau da Yamma', titleEn: '⛅ Today 4:30 PM', descHa: 'Yau da Yamma · Bayan La\'asar (4:30 PM)', descEn: 'Today Afternoon · 4:30 PM' },
  { id: 'slot_tomorrow', titleHa: '☀️ Gobe da Safe', titleEn: '☀️ Tomorrow 10 AM', descHa: 'Gobe da Safe · 10:00 AM', descEn: 'Tomorrow Morning · 10:00 AM' },
]

function detectCategoryFromKeywords(text: string) {
  const t = (text || '').toLowerCase()
  if (t.includes('famfo') || t.includes('ruwa') || t.includes('tanka') || t.includes('borehole') || t.includes('plumber') || t.includes('plumbing') || t.includes('tsaya') || t.includes('zuba') || t.includes('toshe')) {
    return SERVICE_CATEGORIES.find((c) => c.id === 'cat_plumbing')
  }
  if (t.includes('generator') || t.includes('inji') || t.includes('injin') || t.includes('fetur') || t.includes('dizal') || t.includes('mikano') || t.includes('lister') || t.includes('tiger')) {
    return SERVICE_CATEGORIES.find((c) => c.id === 'cat_generator')
  }
  if (t.includes('solar') || t.includes('inverter') || t.includes('batir') || t.includes('panel') || t.includes('caji') || t.includes('inbata')) {
    return SERVICE_CATEGORIES.find((c) => c.id === 'cat_solar')
  }
  if (t.includes('ac') || t.includes('firiji') || t.includes('fridge') || t.includes('sanyi') || t.includes('gas') || t.includes('compressor')) {
    return SERVICE_CATEGORIES.find((c) => c.id === 'cat_ac')
  }
  if (t.includes('waya') || t.includes('lantarki') || t.includes('wuta') || t.includes('circuit') || t.includes('fanka') || t.includes('socket') || t.includes('switch') || t.includes('db board')) {
    return SERVICE_CATEGORIES.find((c) => c.id === 'cat_electrical')
  }
  return null
}

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

  // Determine incoming message text / selection / audio
  let incomingText = ''
  let buttonId = ''
  let audioBase64: string | undefined
  let audioMime: string | undefined

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
  } else if (message.type === 'audio' || message.type === 'voice') {
    const audioId = message.audio?.id || message.voice?.id
    audioMime = message.audio?.mime_type || message.voice?.mime_type || 'audio/ogg'
    const token = process.env.WHATSAPP_ACCESS_TOKEN
    if (audioId && token) {
      try {
        const mRes = await fetch(`https://graph.facebook.com/v22.0/${audioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const mData = await mRes.json()
        if (mData.url) {
          const bRes = await fetch(mData.url, { headers: { Authorization: `Bearer ${token}` } })
          const buf = Buffer.from(await bRes.arrayBuffer())
          audioBase64 = buf.toString('base64')
        }
      } catch (e: any) {
        console.warn('[Audio Fetch Note]:', e.message)
      }
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
      `*CONNECTA KANO*\n` +
      `Mun Gode da Bamu Maki\n` +
      `${DIVIDER}\n` +
      `Mun karɓi makinku (${stars} Stars) akan aikin mai lamba #${bookingNumber}.\n\n` +
      `Muna fatan sake yi muku hidima a Connecta Kano.`
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
      language: undefined as any,
      step: 'CHOOSE_LANGUAGE',
      lastActive: new Date().toISOString(),
    }
    saveWhatsAppSession(session)
  }

  const lower = incomingText.toLowerCase()

  // Language switch commands
  if (lower === 'harshe' || lower === 'language' || lower === 'lang' || buttonId === 'btn_change_lang') {
    session.language = undefined as any
    session.step = 'CHOOSE_LANGUAGE'
    saveWhatsAppSession(session)
  }

  if (buttonId === 'lang_ha') {
    session.language = 'ha'
    session.step = 'CATEGORY'
    saveWhatsAppSession(session)
  } else if (buttonId === 'lang_en') {
    session.language = 'en'
    session.step = 'CATEGORY'
    saveWhatsAppSession(session)
  }

  // Observation #1: First-time user language selection
  if (!session.language) {
    const langPrompt =
      `🌐 *HARSHE / LANGUAGE*\n` +
      `Zaɓi Yarenku / Select Language\n` +
      `${DIVIDER}\n` +
      `○ 1 · 🇳🇬 Hausa (Kano)\n` +
      `○ 2 · 🇬🇧 English\n\n` +
      `Barka da zuwa Connecta Kano. Zaɓi yaren da kuke son amfani da shi:`

    return sendInteractiveButtons(
      rawFrom,
      langPrompt,
      [
        { id: 'lang_ha', title: '🇳🇬 Hausa' },
        { id: 'lang_en', title: '🇬🇧 English' },
      ],
      'CONNECTA KANO',
      'Connecta Kano • Amana da Ƙwarewa'
    )
  }

  const isHausa = session.language !== 'en'

  // Intelligent Kano Vernacular & Voice NLU Engine
  let intent: any = null
  if (incomingText || audioBase64) {
    try {
      intent = await extractKanoRepairIntent({
        text: incomingText,
        audioBase64,
        mimeType: audioMime,
      })
    } catch (e: any) {
      console.warn('[NLU Error]:', e.message)
    }
  }

  if (
    intent &&
    intent.category &&
    intent.confidence >= 0.4 &&
    (session.step === 'GREETING' || session.step === 'CATEGORY' || session.step === 'NEIGHBORHOOD' || session.step === 'CHOOSE_LANGUAGE' || session.step === 'SLOT')
  ) {
    session.selectedCategory = isHausa ? intent.categoryTitleHa : intent.categoryTitleEn
    session.subTrade = intent.subTrade
    session.equipment = intent.equipment || undefined
    session.description = incomingText || intent.description || 'Bincike da Gyara'
    if (intent.neighborhood) session.neighborhood = intent.neighborhood
    if (intent.slot) session.slot = isHausa ? intent.slotDescHa : intent.slotDescEn
    session.lastActive = new Date().toISOString()
    saveWhatsAppSession(session)

    // CASE 1: Category + Neighborhood + Slot all resolved -> Instant Order & Escrow!
    if (session.neighborhood && session.slot) {
      const { serviceRequest, booking, artisan } = createWhatsAppOrder({
        phone: cleanFrom,
        name: userName,
        category: session.selectedCategory || 'Gyara',
        neighborhood: session.neighborhood,
        description: session.description || 'Bincike da Gyara',
        slot: session.slot,
        subTrade: session.subTrade,
        equipment: session.equipment,
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
        ? `✔ *An Shirya Aiki · #${bookingRef}*\n\n` +
          `🛡️ *CONNECTA ESCROW*\n` +
          `Tabbatar da Ma'aikaci\n` +
          `${DIVIDER}\n` +
          `• Sabis: ${session.selectedCategory} (${session.subTrade})\n` +
          `• Wuri: ${session.neighborhood}, Kano\n` +
          `• Lokaci: ${session.slot}\n` +
          `• Ma'aikaci: ${artisan.fullName} (${artisan.rating || '4.9'}★)\n` +
          `• Kuɗin Dubawa: ₦5,000\n` +
          `${DIVIDER}\n` +
          `Kariyar Escrow: Kuɗin ku na nan a kulle a banki. Ma'aikaci ba zai karɓi ko sisi ba sai ya gama aiki kuma kun gamsu 100%.\n\n` +
          `Domin tura ma'aikaci yanzu, danna domin ajiye kuɗi a tsare ta Paystack / OPay:\n` +
          `👉 ${escrowUrl}`
        : `✔ *Booking Created · #${bookingRef}*\n\n` +
          `🛡️ *CONNECTA ESCROW*\n` +
          `Technician Confirmation\n` +
          `${DIVIDER}\n` +
          `• Service: ${session.selectedCategory} (${session.subTrade})\n` +
          `• Location: ${session.neighborhood}, Kano\n` +
          `• Slot: ${session.slot}\n` +
          `• Technician: ${artisan.fullName} (${artisan.rating || '4.9'}★)\n` +
          `• Diagnostic Fee: ₦5,000\n` +
          `${DIVIDER}\n` +
          `Escrow Protection: Your deposit remains locked in the vault. The technician is only paid after service is completed and you are 100% satisfied.\n\n` +
          `Approve deposit to dispatch technician immediately:\n` +
          `👉 ${escrowUrl}`

      await sendTextMessage(rawFrom, summary)

      try {
        await dispatchJobToArtisan({
          booking,
          artisan,
          customerPhone: cleanFrom,
        })
      } catch (dispErr: any) {
        console.error('[Error dispatching job to artisan]:', dispErr.message)
      }

      session.step = 'WAITING_DISPATCH'
      saveWhatsAppSession(session)
      return
    }

    // CASE 2: Category + Neighborhood resolved -> Prompt Slot
    if (session.neighborhood) {
      await sendTextMessage(rawFrom, isHausa ? `✔ *An Gane · ${session.selectedCategory} (${session.neighborhood})*` : `✔ *Identified · ${session.selectedCategory} (${session.neighborhood})*`)
      session.step = 'SLOT'
      saveWhatsAppSession(session)

      const slotPrompt = isHausa
        ? `Yaushe kuke son ma'aikaci ya iso wurin?\n\n` +
          `📅 *Lokacin Zuwa (Available Slots)*\n` +
          `${session.neighborhood}, Kano · Yau da Gobe\n` +
          `${DIVIDER}\n` +
          ARRIVAL_SLOTS.map((s, i) => `○ ${i + 1} · ${s.descHa}`).join('\n')
        : `When would you like the technician to arrive?\n\n` +
          `📅 *Available Slots*\n` +
          `${session.neighborhood}, Kano · Today & Tomorrow\n` +
          `${DIVIDER}\n` +
          ARRIVAL_SLOTS.map((s, i) => `○ ${i + 1} · ${s.descEn}`).join('\n')

      return sendInteractiveButtons(
        rawFrom,
        slotPrompt,
        ARRIVAL_SLOTS.map((s) => ({
          id: s.id,
          title: isHausa ? s.titleHa : s.titleEn,
        })),
        isHausa ? 'LOKACIN ZUWA' : 'ARRIVAL TIME',
        'Connecta Kano Proximity'
      )
    }

    // CASE 3: Only Category resolved -> Prompt Neighborhood
    await sendTextMessage(rawFrom, isHausa ? `✔ *An Zaɓa · ${session.selectedCategory}*` : `✔ *Selected · ${session.selectedCategory}*`)
    session.step = 'NEIGHBORHOOD'
    saveWhatsAppSession(session)

    const neighborhoodPrompt = isHausa
      ? `A wane yanki kuke a Kano?\n\n` +
        `📍 *Wurin Aiki a Kano*\n` +
        `Birnin Kano da Kewaye\n` +
        `${DIVIDER}\n` +
        KANO_NEIGHBORHOODS.map((a, i) => `○ ${i + 1} · ${a}`).join('\n')
      : `Which Kano neighborhood are you in?\n\n` +
        `📍 *Location in Kano*\n` +
        `Kano Metropolitan Areas\n` +
        `${DIVIDER}\n` +
        KANO_NEIGHBORHOODS.map((a, i) => `○ ${i + 1} · ${a}`).join('\n')

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
      isHausa ? 'WURIN DA KUKE A KANO' : 'LOCATION IN KANO'
    )
  }

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
      ? `Madalla — zaɓi irin aikin da kuke buƙata:\n\n` +
        `🛠️ *Sabis ɗin Gyara*\n` +
        `Kano Certified Artisans\n` +
        `${DIVIDER}\n` +
        SERVICE_CATEGORIES.map((c, i) => `○ ${i + 1} · ${c.title}`).join('\n')
      : `Sure — please pick the service you need:\n\n` +
        `🛠️ *Repair Services*\n` +
        `Kano Certified Artisans\n` +
        `${DIVIDER}\n` +
        SERVICE_CATEGORIES.map((c, i) => `○ ${i + 1} · ${c.en}`).join('\n')

    return sendInteractiveList(
      rawFrom,
      greetingBody,
      isHausa ? 'Zaɓi Sabis' : 'Select Service',
      [
        {
          title: isHausa ? 'Shahararrun Sabis a Kano' : 'Popular Services in Kano',
          rows: SERVICE_CATEGORIES.map((c) => ({
            id: c.id,
            title: isHausa ? c.title : c.en,
            description: c.desc,
          })),
        },
      ],
      isHausa ? 'SABIS NA GYARA' : 'REPAIR SERVICES'
    )
  }

  // STEP: CATEGORY SELECTION
  if (session.step === 'CATEGORY' || buttonId.startsWith('cat_')) {
    const matchedCategory = SERVICE_CATEGORIES.find((c) => c.id === buttonId) || {
      id: 'cat_custom',
      title: incomingText || session.selectedCategory || 'Gyara',
      en: 'Repair',
    }

    session.selectedCategory = isHausa ? matchedCategory.title : matchedCategory.en
    session.step = 'NEIGHBORHOOD'
    saveWhatsAppSession(session)

    // Echo instant confirmation receipt
    await sendTextMessage(rawFrom, isHausa ? `✔ *An Zaɓa · ${session.selectedCategory}*` : `✔ *Selected · ${session.selectedCategory}*`)

    const neighborhoodPrompt = isHausa
      ? `A wane yanki kuke a Kano?\n\n` +
        `📍 *Wurin Aiki a Kano*\n` +
        `Birnin Kano da Kewaye\n` +
        `${DIVIDER}\n` +
        KANO_NEIGHBORHOODS.map((a, i) => `○ ${i + 1} · ${a}`).join('\n')
      : `Which Kano neighborhood are you in?\n\n` +
        `📍 *Location in Kano*\n` +
        `Kano Metropolitan Areas\n` +
        `${DIVIDER}\n` +
        KANO_NEIGHBORHOODS.map((a, i) => `○ ${i + 1} · ${a}`).join('\n')

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
      isHausa ? 'WURIN DA KUKE A KANO' : 'LOCATION IN KANO'
    )
  }

  // STEP: NEIGHBORHOOD SELECTION -> SHOW ARRIVAL SLOTS
  if (session.step === 'NEIGHBORHOOD' || buttonId.startsWith('area_')) {
    session.neighborhood = incomingText
    session.step = 'SLOT'
    saveWhatsAppSession(session)

    // Echo instant confirmation receipt
    await sendTextMessage(rawFrom, isHausa ? `✔ *An Tabbatar · ${session.neighborhood}*` : `✔ *Confirmed · ${session.neighborhood}*`)

    const slotPrompt = isHausa
      ? `Yaushe kuke son ma'aikaci ya iso wurin?\n\n` +
        `📅 *Lokacin Zuwa (Available Slots)*\n` +
        `${session.neighborhood}, Kano · Yau da Gobe\n` +
        `${DIVIDER}\n` +
        ARRIVAL_SLOTS.map((s, i) => `○ ${i + 1} · ${s.descHa}`).join('\n')
      : `When would you like the technician to arrive?\n\n` +
        `📅 *Available Slots*\n` +
        `${session.neighborhood}, Kano · Today & Tomorrow\n` +
        `${DIVIDER}\n` +
        ARRIVAL_SLOTS.map((s, i) => `○ ${i + 1} · ${s.descEn}`).join('\n')

    return sendInteractiveButtons(
      rawFrom,
      slotPrompt,
      ARRIVAL_SLOTS.map((s) => ({
        id: s.id,
        title: isHausa ? s.titleHa : s.titleEn,
      })),
      isHausa ? 'LOKACIN ZUWA' : 'ARRIVAL TIME',
      'Connecta Kano Proximity'
    )
  }

  // STEP: ARRIVAL SLOT SELECTION -> PROMPT DESCRIPTION
  if (session.step === 'SLOT' || buttonId.startsWith('slot_')) {
    const matchedSlot = ARRIVAL_SLOTS.find((s) => s.id === buttonId) || ARRIVAL_SLOTS[0]
    session.slot = isHausa ? matchedSlot.descHa : matchedSlot.descEn
    session.step = 'DESCRIPTION'
    saveWhatsAppSession(session)

    // Echo instant confirmation receipt
    await sendTextMessage(rawFrom, isHausa ? `✔ *Lokacin Zuwa · ${matchedSlot.titleHa}*` : `✔ *Slot Confirmed · ${matchedSlot.titleEn}*`)

    if (session.description && session.description !== 'Gyara') {
      // Already has description from keyword routing, proceed straight to creation!
    } else {
      const descPrompt = isHausa
        ? `📝 *Bayanin Matsala*\n` +
          `Voice Note ko Rubutu\n` +
          `${DIVIDER}\n` +
          `Aiko da saƙon murya (Voice Note) ko rubuta takaitaccen abin da ya sami ${session.selectedCategory} a ${session.neighborhood}:`
        : `📝 *Issue Description*\n` +
          `Voice Note or Text\n` +
          `${DIVIDER}\n` +
          `Please reply with a brief voice note or text describing the fault with your ${session.selectedCategory} in ${session.neighborhood}:`

      return sendTextMessage(rawFrom, descPrompt)
    }
  }

  // STEP: ISSUE DESCRIPTION -> ORDER CREATION, ESCROW & ARTISAN DISPATCH
  if (session.step === 'DESCRIPTION') {
    const finalDescription = incomingText || session.description || 'Bincike da Gyara'
    session.description = finalDescription

    const { serviceRequest, booking, artisan } = createWhatsAppOrder({
      phone: cleanFrom,
      name: userName,
      category: session.selectedCategory || 'Famfo da Ruwa',
      neighborhood: session.neighborhood || 'Tarauni',
      description: finalDescription,
      slot: session.slot || 'Yanzu-Yanzu (Minti 45)',
      subTrade: session.subTrade,
      equipment: session.equipment,
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
      ? `✔ *An Shirya Aiki · #${bookingRef}*\n\n` +
        `🛡️ *CONNECTA ESCROW*\n` +
        `Tabbatar da Ma'aikaci\n` +
        `${DIVIDER}\n` +
        `• Sabis: ${session.selectedCategory}${session.subTrade ? ' (' + session.subTrade + ')' : ''}\n` +
        `• Wuri: ${session.neighborhood}, Kano\n` +
        `• Lokaci: ${session.slot || 'Yanzu-Yanzu (Minti 45)'}\n` +
        `• Ma'aikaci: ${artisan.fullName} (${artisan.rating || '4.9'}★)\n` +
        `• Kuɗin Dubawa: ₦5,000\n` +
        `${DIVIDER}\n` +
        `Kariyar Escrow: Kuɗin ku na nan a kulle a banki. Ma'aikaci ba zai karɓi ko sisi ba sai ya gama aiki kuma kun gamsu 100%.\n\n` +
        `Domin tura ma'aikaci yanzu, danna domin ajiye kuɗi a tsare ta Paystack / OPay:\n` +
        `👉 ${escrowUrl}`
      : `✔ *Booking Created · #${bookingRef}*\n\n` +
        `🛡️ *CONNECTA ESCROW*\n` +
        `Technician Confirmation\n` +
        `${DIVIDER}\n` +
        `• Service: ${session.selectedCategory}${session.subTrade ? ' (' + session.subTrade + ')' : ''}\n` +
        `• Location: ${session.neighborhood}, Kano\n` +
        `• Slot: ${session.slot || 'Immediate (45 mins)'}\n` +
        `• Technician: ${artisan.fullName} (${artisan.rating || '4.9'}★)\n` +
        `• Diagnostic Fee: ₦5,000\n` +
        `${DIVIDER}\n` +
        `Escrow Protection: Your deposit remains locked in the vault. The technician is only paid after service is completed and you are 100% satisfied.\n\n` +
        `Approve deposit to dispatch technician immediately:\n` +
        `👉 ${escrowUrl}`

    await sendTextMessage(rawFrom, summary)

    // Simultaneously dispatch job alert to artisan
    try {
      await dispatchJobToArtisan({
        booking,
        artisan,
        customerPhone: cleanFrom,
      })
    } catch (dispErr: any) {
      console.error('[Error dispatching job to artisan]:', dispErr.message)
    }

    session.step = 'WAITING_DISPATCH'
    saveWhatsAppSession(session)
    return
  }

  // DEFAULT FALLBACK
  const fallbackMsg = isHausa
    ? `Mun gode da tuntuɓar Connecta Kano. Rubuta *menu* kowane lokaci domin fara sabon neman gyara.`
    : `Thank you for messaging Connecta. Type *menu* anytime to start a new request or view services.`
  return sendTextMessage(rawFrom, fallbackMsg)
}
