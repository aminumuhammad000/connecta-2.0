/**
 * WhatsApp Conversational NLU & Intent Engine for Connecta Kano
 * Hyper-local Kano Hausa & Nigerian English trade comprehension.
 * Supports text input and multimodal raw voice note audio parsing.
 */

export interface KanoRepairIntent {
  category: 'cat_solar' | 'cat_generator' | 'cat_ac' | 'cat_electrical' | 'cat_plumbing' | null
  categoryTitleHa: string
  categoryTitleEn: string
  subTrade: string
  equipment: string | null
  neighborhood: string | null
  slot: 'slot_urgent' | 'slot_afternoon' | 'slot_tomorrow' | null
  slotDescHa: string | null
  slotDescEn: string | null
  description: string
  confidence: number
  summaryHa: string
  summaryEn: string
}

export const KANO_AREAS_MAP: Record<string, string> = {
  'nassarawa': 'Nassarawa (GRA / Bompai)',
  'gra': 'Nassarawa (GRA / Bompai)',
  'bompai': 'Nassarawa (GRA / Bompai)',
  'tarauni': 'Tarauni (Gyadi-Gyadi)',
  'gyadi': 'Tarauni (Gyadi-Gyadi)',
  'gyadi-gyadi': 'Tarauni (Gyadi-Gyadi)',
  'maiduguri': 'Tarauni (Gyadi-Gyadi)',
  'fagge': 'Fagge (Sabon Gari)',
  'sabon gari': 'Fagge (Sabon Gari)',
  'dala': 'Dala (Gwammaja)',
  'gwammaja': 'Dala (Gwammaja)',
  'dawanau': 'Dala (Gwammaja)',
  'gwale': 'Gwale (Kabuga / BUK Rd)',
  'kabuga': 'Gwale (Kabuga / BUK Rd)',
  'buk': 'Gwale (Kabuga / BUK Rd)',
  'municipal': 'Kano Municipal (Kofar Na\'isa)',
  'kofar naisa': 'Kano Municipal (Kofar Na\'isa)',
  'shahuchi': 'Kano Municipal (Kofar Na\'isa)',
  'kumbotso': 'Kumbotso (Panshekara)',
  'panshekara': 'Kumbotso (Panshekara)',
  'zawaciki': 'Kumbotso (Panshekara)',
  'ungogo': 'Ungogo (Rijiyar Zaki)',
  'rijiyar zaki': 'Ungogo (Rijiyar Zaki)',
}

/**
 * Extracts structured Kano repair intent using Gemini Flash if available,
 * or the built-in Kano trade heuristic engine.
 */
export async function extractKanoRepairIntent(params: {
  text?: string
  audioBase64?: string
  mimeType?: string
}): Promise<KanoRepairIntent> {
  const text = (params.text || '').trim()
  const apiKey = process.env.GEMINI_API_KEY

  // 1. If Gemini API key is available, attempt Gemini Flash multimodal extraction
  if (apiKey && (text || params.audioBase64)) {
    try {
      const result = await extractWithGemini(apiKey, text, params.audioBase64, params.mimeType)
      if (result && result.confidence >= 0.7) {
        return result
      }
    } catch (err: any) {
      console.warn('[WhatsApp NLU] Gemini extraction failed, falling back to heuristic:', err.message)
    }
  }

  // 2. High-precision Kano trade heuristic fallback engine
  return extractWithHeuristics(text)
}

/**
 * High-precision local Kano trade lexicon & entity extractor
 */
export function extractWithHeuristics(rawText: string): KanoRepairIntent {
  const t = rawText.toLowerCase()
  let category: KanoRepairIntent['category'] = null
  let categoryTitleHa = ''
  let categoryTitleEn = ''
  let subTrade = 'Gyara da Bincike'
  let equipment: string | null = null
  let neighborhood: string | null = null
  let slot: KanoRepairIntent['slot'] = null
  let slotDescHa: string | null = null
  let slotDescEn: string | null = null
  let confidence = 0.0

  // 1. Detect Category & Sub-Trade
  // Plumbing
  if (
    t.includes('famfo') || t.includes('ruwa') || t.includes('tanka') ||
    t.includes('borehole') || t.includes('plumber') || t.includes('plumbing') ||
    t.includes('yoyo') || t.includes('toshe') || t.includes('zubar ruwa') ||
    t.includes('pomp') || t.includes('pipe') || t.includes('bayi') || t.includes('bandaki')
  ) {
    category = 'cat_plumbing'
    categoryTitleHa = 'Famfo da Ruwa'
    categoryTitleEn = 'Plumbing & Water'
    confidence += 0.45

    if (t.includes('borehole') || t.includes('submersible')) subTrade = 'Submersible Borehole Pump'
    else if (t.includes('tanka') || t.includes('float')) subTrade = 'Overhead Tank & Float Switch'
    else if (t.includes('yoyo') || t.includes('zuba') || t.includes('leak')) subTrade = 'Pipe Leak & Pressure Isolation'
    else subTrade = 'Sanitary & General Plumbing'
  }
  // Generator
  else if (
    t.includes('generator') || t.includes('inji') || t.includes('injin') ||
    t.includes('fetur') || t.includes('dizal') || t.includes('diesel') ||
    t.includes('mikano') || t.includes('lister') || t.includes('tiger') ||
    t.includes('lutian') || t.includes('firman') || t.includes('sumec')
  ) {
    category = 'cat_generator'
    categoryTitleHa = 'Gyaran Generator'
    categoryTitleEn = 'Generator Repair'
    confidence += 0.45

    if (t.includes('mikano') || t.includes('perkins') || t.includes('dizal') || t.includes('diesel')) {
      subTrade = 'Heavy Industrial Diesel Generator'
      equipment = t.includes('mikano') ? 'Mikano' : 'Diesel Standby'
    } else if (t.includes('tiger') || t.includes('lutian') || t.includes('firman') || t.includes('fetur')) {
      subTrade = 'Domestic Petrol Generator'
      equipment = t.includes('tiger') ? 'Tiger Gen' : 'Petrol Generator'
    } else {
      subTrade = 'Generator Engine & Alternator'
    }
  }
  // Solar & Inverter
  else if (
    t.includes('solar') || t.includes('inverter') || t.includes('batir') ||
    t.includes('battery') || t.includes('panel') || t.includes('caji') ||
    t.includes('inbata') || t.includes('felicity') || t.includes('lithium') ||
    t.includes('lifepo4')
  ) {
    category = 'cat_solar'
    categoryTitleHa = 'Solar da Inverter'
    categoryTitleEn = 'Solar & Inverter'
    confidence += 0.45

    if (t.includes('felicity')) equipment = 'Felicity Solar'
    if (t.includes('lithium') || t.includes('lifepo4')) subTrade = 'LiFePO4 Lithium Battery & BMS'
    else if (t.includes('inverter') || t.includes('inbata')) subTrade = 'Hybrid Inverter Motherboard / Charging'
    else subTrade = 'Solar PV Panel & Battery Wiring'
  }
  // AC & Cooling
  else if (
    t.includes('ac') || t.includes('firiji') || t.includes('fridge') ||
    t.includes('sanyi') || t.includes('gas') || t.includes('compressor') ||
    t.includes('komfreso') || t.includes('chaja gas')
  ) {
    category = 'cat_ac'
    categoryTitleHa = 'AC da Firiji'
    categoryTitleEn = 'AC & Refrigeration'
    confidence += 0.45

    if (t.includes('gas') || t.includes('chaja')) subTrade = 'R32/R410 Refrigerant Gas Recharging'
    else if (t.includes('compressor') || t.includes('komfreso')) subTrade = 'AC Compressor Rebuilding'
    else subTrade = 'Inverter Split AC Cooling'
  }
  // Electrical
  else if (
    t.includes('waya') || t.includes('lantarki') || t.includes('wuta') ||
    t.includes('circuit') || t.includes('fanka') || t.includes('socket') ||
    t.includes('switch') || t.includes('db board') || t.includes('mita') ||
    t.includes('meter') || t.includes('kone') || t.includes('kif-kif')
  ) {
    category = 'cat_electrical'
    categoryTitleHa = 'Waya da Lantarki'
    categoryTitleEn = 'Electrical Wiring'
    confidence += 0.45

    if (t.includes('db board') || t.includes('breaker')) subTrade = 'Distribution Board & Three-Phase Balancing'
    else if (t.includes('mita') || t.includes('meter')) subTrade = 'Prepaid Meter Bypass & Fault Isolation'
    else subTrade = 'Domestic Conduit & Appliance Wiring'
  }

  // 2. Detect Kano Neighborhood
  for (const [key, standardName] of Object.entries(KANO_AREAS_MAP)) {
    if (t.includes(key)) {
      neighborhood = standardName
      confidence += 0.35
      break
    }
  }

  // 3. Detect Time Slot / Urgency
  if (t.includes('yanzu') || t.includes('gaggawa') || t.includes('minti') || t.includes('now') || t.includes('urgent')) {
    slot = 'slot_urgent'
    slotDescHa = 'Yanzu-Yanzu · Cikin Minti 45'
    slotDescEn = 'Immediate · Within 45 mins'
    confidence += 0.15
  } else if (t.includes('yamma') || t.includes('la\'asar') || t.includes('afternoon') || t.includes('today')) {
    slot = 'slot_afternoon'
    slotDescHa = 'Yau da Yamma · Bayan La\'asar (4:30 PM)'
    slotDescEn = 'Today Afternoon · 4:30 PM'
    confidence += 0.15
  } else if (t.includes('gobe') || t.includes('safe') || t.includes('tomorrow') || t.includes('morning')) {
    slot = 'slot_tomorrow'
    slotDescHa = 'Gobe da Safe · 10:00 AM'
    slotDescEn = 'Tomorrow Morning · 10:00 AM'
    confidence += 0.15
  }

  const cleanDescription = rawText.length > 5 ? rawText : (categoryTitleHa || 'Bincike da Gyara')

  return {
    category,
    categoryTitleHa: categoryTitleHa || 'Gyara',
    categoryTitleEn: categoryTitleEn || 'Repair',
    subTrade,
    equipment,
    neighborhood,
    slot,
    slotDescHa,
    slotDescEn,
    description: cleanDescription,
    confidence: Math.min(confidence, 1.0),
    summaryHa: `${categoryTitleHa || 'Gyara'}${neighborhood ? ' a ' + neighborhood : ''}${equipment ? ' (' + equipment + ')' : ''}`,
    summaryEn: `${categoryTitleEn || 'Repair'}${neighborhood ? ' in ' + neighborhood : ''}${equipment ? ' (' + equipment + ')' : ''}`,
  }
}

/**
 * Gemini Flash Multimodal NLU Caller
 */
async function extractWithGemini(
  apiKey: string,
  text?: string,
  audioBase64?: string,
  mimeType = 'audio/ogg'
): Promise<KanoRepairIntent | null> {
  const parts: any[] = []

  const systemInstructions = `
You are the hyper-local AI Intake Engine for Connecta Kano (myconnecta.ng), a home repair and artisan marketplace in Kano, Nigeria.
Extract structured service information from Kano Hausa, Nigerian Pidgin, or English text and voice notes.

Recognized Categories:
- "cat_solar" (Solar PV, Inverter, Felicity, Batteries, LiFePO4)
- "cat_generator" (Generator, Inji, Mikano, Lister, Tiger, Petrol, Diesel)
- "cat_ac" (AC, Cooling, Sanyi, Firiji, Gas refill, Compressor)
- "cat_electrical" (Electrical wiring, Lantarki, Wuta, DB board, Meter, Sockets)
- "cat_plumbing" (Plumbing, Famfo, Ruwa, Borehole, Tank, Pipe leak, Bandaki)

Recognized Kano Areas:
- "Nassarawa (GRA / Bompai)"
- "Tarauni (Gyadi-Gyadi)"
- "Fagge (Sabon Gari)"
- "Dala (Gwammaja)"
- "Gwale (Kabuga / BUK Rd)"
- "Kano Municipal (Kofar Na'isa)"
- "Kumbotso (Panshekara)"
- "Ungogo (Rijiyar Zaki)"

Output strict JSON only with this schema:
{
  "category": "cat_solar" | "cat_generator" | "cat_ac" | "cat_electrical" | "cat_plumbing" | null,
  "categoryTitleHa": "Solar da Inverter" | "Gyaran Generator" | "AC da Firiji" | "Waya da Lantarki" | "Famfo da Ruwa" | "",
  "categoryTitleEn": "Solar & Inverter" | "Generator Repair" | "AC & Refrigeration" | "Electrical Wiring" | "Plumbing & Water" | "",
  "subTrade": string,
  "equipment": string | null,
  "neighborhood": string | null,
  "slot": "slot_urgent" | "slot_afternoon" | "slot_tomorrow" | null,
  "slotDescHa": string | null,
  "slotDescEn": string | null,
  "description": string,
  "confidence": number,
  "summaryHa": string,
  "summaryEn": string
}
`.trim()

  parts.push({ text: systemInstructions })

  if (text) {
    parts.push({ text: `Customer text message: "${text}"` })
  }

  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    })
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    }
  )

  if (!res.ok) return null
  const data = await res.json()
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawJson) return null

  return JSON.parse(rawJson) as KanoRepairIntent
}
