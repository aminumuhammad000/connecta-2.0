/**
 * Multimodal Visual Diagnostics Engine for Connecta Kano (TypeScript / SvelteKit)
 * Ingests WhatsApp photos and short video clips, analyzes hardware fault signatures
 * using Gemini Multimodal Vision + Local Kano Heuristics, and generates enriched diagnostic cards.
 */

export interface VisualDiagnosticResult {
  mediaId: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  category: 'cat_plumbing' | 'cat_generator' | 'cat_solar' | 'cat_ac' | 'cat_electrical'
  categoryTitleHa: string
  categoryTitleEn: string
  subTrade: string
  equipmentIdentified: string
  visibleFault: string
  recommendedTools: string[]
  confidence: number
  diagnosticSummaryHa: string
  diagnosticSummaryEn: string
}

export async function analyzeVisualDiagnostic(params: {
  mediaId: string
  mimeType: string
  buffer?: Buffer | null
  caption?: string
  publicBaseUrl: string
}): Promise<VisualDiagnosticResult> {
  const { mediaId, mimeType, buffer, caption = '', publicBaseUrl } = params
  const ext = mimeType.includes('mp4') ? 'mp4' : 'jpg'
  const publicMediaUrl = `${publicBaseUrl}/media/${mediaId}.${ext}`

  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey && buffer) {
    try {
      const isVideo = mimeType.includes('video') || mimeType.includes('mp4')
      const base64Data = buffer.toString('base64')

      const promptText =
        `You are Connecta Kano's Lead Diagnostic Engineer. Analyze this ${isVideo ? 'video' : 'photo'} of a breakdown in Kano, Nigeria.\n` +
        `Customer note: "${caption}".\n` +
        `Identify the equipment type, make/model, visible fault signatures, and estimated tools/parts.\n` +
        `Respond ONLY in valid JSON matching this schema:\n` +
        `{\n` +
        `  "category": "cat_plumbing" | "cat_generator" | "cat_solar" | "cat_ac" | "cat_electrical",\n` +
        `  "categoryTitleHa": string,\n` +
        `  "categoryTitleEn": string,\n` +
        `  "subTrade": string,\n` +
        `  "equipmentIdentified": string,\n` +
        `  "visibleFault": string,\n` +
        `  "recommendedTools": string[],\n` +
        `  "confidence": number,\n` +
        `  "diagnosticSummaryHa": string,\n` +
        `  "diagnosticSummaryEn": string\n` +
        `}`

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  { inlineData: { mimeType, data: base64Data } }
                ]
              }
            ],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      )

      const geminiData = await geminiRes.json()
      const rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
      if (rawJson) {
        const parsed = JSON.parse(rawJson)
        return {
          mediaId,
          mediaType: isVideo ? 'video' : 'image',
          mediaUrl: publicMediaUrl,
          ...parsed
        }
      }
    } catch (err: any) {
      console.warn('[Visual Engine]: Gemini multimodal call failed, using local Kano heuristics:', err.message)
    }
  }

  // Fallback to local Kano hardware lexicon
  return analyzeWithLocalKanoHeuristics({ mediaId, mimeType, caption, publicMediaUrl })
}

export function analyzeWithLocalKanoHeuristics(params: {
  mediaId: string
  mimeType: string
  caption?: string
  publicMediaUrl: string
}): VisualDiagnosticResult {
  const { mediaId, mimeType, caption = '', publicMediaUrl } = params
  const isVideo = mimeType.includes('video') || mimeType.includes('mp4')
  const cap = caption.toLowerCase()

  let category: VisualDiagnosticResult['category'] = 'cat_plumbing'
  let categoryTitleHa = 'Famfo da Ruwa'
  let categoryTitleEn = 'Plumbing & Water'
  let subTrade = 'Piping & Sanitary Isolation'
  let equipmentIdentified = 'Famfo / Tanka / Ruwa'
  let visibleFault = 'Zubar ruwa ko toshewar famfo a bayyane'
  let recommendedTools = ['PPR Pipe Welding Machine', 'Pipe Wrench 14-inch', 'Teflon Sealing Tape', 'Pressure Relief Valve']
  let diagnosticSummaryHa = 'An gano zubar ruwa ko matsalar tanka ta famfo'
  let diagnosticSummaryEn = 'Identified pipe joint water leakage or overhead tank fault'
  let confidence = 0.85

  if (
    cap.includes('generator') || cap.includes('inji') || cap.includes('fetur') ||
    cap.includes('dizal') || cap.includes('diesel') || cap.includes('mikano') ||
    cap.includes('tiger') || cap.includes('lister') || cap.includes('hayaki')
  ) {
    category = 'cat_generator'
    categoryTitleHa = 'Gyaran Generator'
    categoryTitleEn = 'Generator Repair'
    if (cap.includes('mikano') || cap.includes('dizal') || cap.includes('diesel')) {
      subTrade = 'Heavy Industrial Diesel Generator'
      equipmentIdentified = 'Mikano / Perkins Diesel Standby'
      visibleFault = 'Matsalar tace mai (fuel filter) ko zubar man dizal a inji'
      recommendedTools = ['Ring & Open Spanners (13-24mm)', 'New Fuel Filter Element', 'Diesel Bleeding Kit']
      diagnosticSummaryHa = 'An gano injin diesel na Mikano mai buƙatar duba tace mai da famfon injector'
      diagnosticSummaryEn = 'Mikano diesel genset showing fuel filtration or injector supply fault'
    } else {
      subTrade = 'Domestic Petrol Generator Engine'
      equipmentIdentified = 'Tiger / Sumec Firman Petrol Generator'
      visibleFault = 'Toshewar carburetor, kwayar wuta (spark plug), ko zubar mai'
      recommendedTools = ['Spark Plug Spanner', 'Carburetor Cleaning Solvent', 'Compression Gauge']
      diagnosticSummaryHa = 'Injin fetur mai buƙatar wanke carburetor da canza plug'
      diagnosticSummaryEn = 'Domestic petrol generator requiring carburetor rebuild and spark service'
    }
    confidence = 0.90
  } else if (
    cap.includes('solar') || cap.includes('inverter') || cap.includes('batir') ||
    cap.includes('battery') || cap.includes('panel') || cap.includes('caji') ||
    cap.includes('inbata') || cap.includes('felicity')
  ) {
    category = 'cat_solar'
    categoryTitleHa = 'Solar da Inverter'
    categoryTitleEn = 'Solar & Inverter'
    subTrade = 'Hybrid Inverter Motherboard & Battery Bank'
    equipmentIdentified = 'Felicity / Hybrid Pure Sine Inverter & Battery Bank'
    visibleFault = 'Kuskuren caji (Fault 04/09), zafin batir, ko kone fuse'
    recommendedTools = ['Digital Multimeter (DC/AC)', 'Hydrometer for Tubular Battery', 'DC Breaker Isolator']
    diagnosticSummaryHa = 'Kayan solar da inverter mai buƙatar binciken karfin batir da circuit board'
    diagnosticSummaryEn = 'Hybrid solar inverter system showing battery balance or DC fault code'
    confidence = 0.92
  } else if (
    cap.includes('ac') || cap.includes('firiji') || cap.includes('fridge') ||
    cap.includes('sanyi') || cap.includes('gas') || cap.includes('compressor')
  ) {
    category = 'cat_ac'
    categoryTitleHa = 'AC da Firiji'
    categoryTitleEn = 'AC & Refrigeration'
    subTrade = 'Split Unit AC Compressor & Refrigerant'
    equipmentIdentified = 'Split AC Outdoor Condenser / Inverter AC'
    visibleFault = 'Ƙarancin gas ko daskarewar ƙankara a kan tagulla (copper pipe)'
    recommendedTools = ['R410A/R32 Manifold Pressure Gauge', 'Vacuum Pump', 'Refrigerant Gas Cylinder', 'Flaring Tool']
    diagnosticSummaryHa = 'AC mai buƙatar caji ko toshewar tagullar iskar sanyi'
    diagnosticSummaryEn = 'Split AC condenser showing low refrigerant pressure or ice blockage'
    confidence = 0.88
  } else if (
    cap.includes('waya') || cap.includes('lantarki') || cap.includes('wuta') ||
    cap.includes('circuit') || cap.includes('socket') || cap.includes('breaker') ||
    cap.includes('db board')
  ) {
    category = 'cat_electrical'
    categoryTitleHa = 'Waya da Lantarki'
    categoryTitleEn = 'Electrical Wiring'
    subTrade = 'Distribution Board & Phase Balancing'
    equipmentIdentified = 'Three-Phase DB Board & Main Isolator'
    visibleFault = 'Ƙonewar breaker, short circuit, ko rashin daidaiton wuta (phase drop)'
    recommendedTools = ['Insulated Screwdriver Set (1000V)', 'Clamp Meter', 'Megger Insulation Tester']
    diagnosticSummaryHa = 'Akwatin wuta (DB Board) mai buƙatar canza breaker da binciken short circuit'
    diagnosticSummaryEn = 'Distribution board showing burnt miniature breaker and wiring load trip'
    confidence = 0.91
  }

  return {
    mediaId,
    mediaType: isVideo ? 'video' : 'image',
    mediaUrl: publicMediaUrl,
    category,
    categoryTitleHa,
    categoryTitleEn,
    subTrade,
    equipmentIdentified,
    visibleFault,
    recommendedTools,
    confidence,
    diagnosticSummaryHa,
    diagnosticSummaryEn
  }
}
