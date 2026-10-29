import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { processAttachment, ProcessedAttachment } from '@/lib/ai/document-parser'
import { analyzeServiceRequest, matchProviders } from '@/lib/ai/discovery'
import { getAllPublicProviders } from '@/lib/server/providers'
import { calculateDistanceKm, formatDistance, NIGERIAN_CITY_COORDINATES } from '@/lib/geo'

export const maxDuration = 30

/**
 * Intelligent intent discriminator:
 * Differentiates casual greetings / chit-chat from concrete service & diagnosis requests.
 */
function detectIsServiceRequest(text: string, hasAttachments: boolean): boolean {
  if (hasAttachments) return true

  const clean = text.trim().toLowerCase()
  if (!clean) return false

  // Pure conversational / greeting phrases
  const greetingsOnly = [
    'hi', 'hey', 'hello', 'yo', 'sup', 'howdy',
    'good morning', 'good afternoon', 'good evening', 'good day',
    'how are you', 'how far', 'how are you doing', 'what\'s up', 'whats up',
    'sannu', 'salama', 'salam alaikum', 'assalamu alaikum', 'ina kwana',
    'who are you', 'what are you', 'what can you do', 'what do you do',
    'help', 'help me', 'thanks', 'thank you', 'ok', 'okay', 'great', 'cool',
    'bye', 'goodbye', 'see you', 'test', 'testing'
  ]

  // If text is a greeting without technical trade terms
  if (greetingsOnly.includes(clean)) {
    return false
  }

  // Explicit trade terms
  const tradeTerms = [
    'electric', 'solar', 'inverter', 'battery', 'charge controller', 'earthing',
    'plumb', 'pipe', 'leak', 'drain', 'borehole', 'pump', 'tank', 'tap', 'water heater',
    'ac', 'cooling', 'air conditioner', 'chiller', 'gas refill', 'compressor',
    'mechanic', 'car', 'engine', 'brake', 'transmission', 'diagnostic', 'auto',
    'generator', 'diesel', 'petrol', 'mikano', 'perkins', 'ats', 'changeover',
    'carpenter', 'wood', 'furniture', 'roof', 'door', 'cabinet', 'cupboard',
    'paint', 'screed', 'pop', 'wall',
    'mason', 'tiler', 'tiling', 'bricklayer', 'concrete',
    'phone', 'screen', 'laptop', 'tablet', 'soldering'
  ]

  const hasTradeTerm = tradeTerms.some((term) => clean.includes(term))
  if (hasTradeTerm) return true

  // Explicit problem/request verbs
  const requestSignals = [
    'need a', 'need an', 'looking for a', 'looking for an', 'find a', 'find an',
    'hire a', 'hire an', 'recommend a', 'recommend an',
    'fix my', 'repair my', 'install my', 'replace my',
    'broken', 'spoilt', 'damaged', 'faulty', 'leaking',
    'smoking', 'sparking', 'not working', 'won\'t turn on', 'tripping',
    'how much to fix', 'how much to install', 'cost of', 'price of', 'estimate for'
  ]

  return requestSignals.some((sig) => clean.includes(sig))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages = [],
      city = 'Kano',
      userLocation = null,
      verifiedOnly = false,
    } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse('Messages array is required', 400)
    }

    // Get the latest user message
    const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    if (!latestUserMessage) {
      return errorResponse('No user message provided', 400)
    }

    const text = latestUserMessage.content || ''
    const rawAttachments = latestUserMessage.attachments || []

    // Process attachments if any
    const processedAttachments: ProcessedAttachment[] = []
    if (Array.isArray(rawAttachments)) {
      for (const att of rawAttachments) {
        if (att.base64 && att.name) {
          try {
            const buffer = Buffer.from(
              att.base64.replace(/^data:[^;]+;base64,/, ''),
              'base64'
            )
            const processed = await processAttachment(
              att.name,
              att.mimeType || 'image/jpeg',
              buffer
            )
            processedAttachments.push(processed)
          } catch (attErr) {
            console.warn('[AI Chat] Failed to parse attachment:', att.name, attErr)
          }
        }
      }
    }

    if (!text.trim() && processedAttachments.length === 0) {
      return errorResponse('Please provide text or an image to start a conversation.', 400)
    }

    const cityContext = city && city !== 'All Locations' ? city : 'Kano'
    const isServiceRequest = detectIsServiceRequest(text, processedAttachments.length > 0)
    const apiKey = process.env.OPENAI_API_KEY
    const isLlmAvailable = !!(apiKey && !apiKey.startsWith('placeholder'))

    // Prepare recent conversation history for LLM (last 6 messages)
    const chatHistoryForLlm = messages.slice(-6).map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || '',
    }))

    // =========================================================================
    // BRANCH A: CASUAL / CONVERSATIONAL INQUIRY (No worker cards dumped)
    // =========================================================================
    if (!isServiceRequest) {
      let assistantContent = ''

      if (isLlmAvailable) {
        try {
          const conversationalSystemPrompt = `You are Connecta's AI Technical Assistant in Nigeria.
Connecta connects Nigerian clients and businesses with vetted artisans and engineers (electricians, plumbers, solar & inverter technicians, AC specialists, auto mechanics, carpenters, painters, etc.) protected by Connecta Vault Payment Protection.

Context:
- The user is speaking with you conversationally (e.g. greeting, asking who you are, or general conversation).
- User location: ${cityContext}, Nigeria.

Guidelines:
1. Greet the user warmly, naturally, and concisely in standard Nigerian English.
2. Answer what they said directly. If they greeted you, greet them back and ask how you can help with technical fault diagnosis, cost estimates, or matching vetted artisans in ${cityContext}.
3. DO NOT pretend they asked for a specific trade or diagnosis.
4. DO NOT dump or invent artisan worker lists.
5. STRICT RULE: DO NOT use any emojis anywhere in your response. Keep the tone minimalist, refined, professional, and clean.`

          const llmResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: conversationalSystemPrompt },
                ...chatHistoryForLlm,
              ],
              temperature: 0.7,
              max_tokens: 350,
            }),
          })

          if (llmResponse.ok) {
            const llmData = await llmResponse.json()
            assistantContent = llmData.choices?.[0]?.message?.content || ''
          }
        } catch (llmErr) {
          console.warn('[AI Chat API] LLM conversational generation error:', llmErr)
        }
      }

      if (!assistantContent) {
        assistantContent = `Hello! I am your Connecta Assistant. How can I help you today in ${cityContext}? You can describe a repair or installation issue (such as electrical, plumbing, solar inverter, or AC faults), request cost estimates, or find vetted local specialists.`
      }

      const followUpSuggestions = [
        `Find certified electricians in ${cityContext}`,
        `Find emergency plumbers in ${cityContext}`,
        `Diagnose a solar inverter fault`,
        `How does Connecta Vault work?`,
      ]

      return successResponse({
        reply: {
          role: 'assistant',
          content: assistantContent,
          providers: [], // No worker cards on a conversational greeting
          followUpSuggestions,
        },
      })
    }

    // =========================================================================
    // BRANCH B: GENUINE SERVICE / TECHNICAL REQUEST (Diagnostic & Targeted Matching)
    // =========================================================================

    // 1. Analyze request with multimodal understanding
    const analysis = await analyzeServiceRequest({
      text,
      attachments: processedAttachments,
      cityContext,
    })

    // 2. Fetch public providers and match
    const allProviders = getAllPublicProviders({ verifiedOnly })
    const matched = matchProviders(analysis, {
      cityFilter: cityContext,
      verifiedOnly,
      providersList: allProviders,
    })

    // 3. Calculate exact geographic distance to user
    const refCoords =
      userLocation?.lat && userLocation?.lng
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : NIGERIAN_CITY_COORDINATES[cityContext] || NIGERIAN_CITY_COORDINATES['Kano']

    const providersWithDistance = matched.map((provider) => {
      let distanceKm: number | undefined = undefined
      let distanceFormatted: string | undefined = undefined

      if (provider.latitude && provider.longitude && refCoords) {
        distanceKm = calculateDistanceKm(
          refCoords.lat,
          refCoords.lng,
          provider.latitude,
          provider.longitude
        )
        distanceFormatted = formatDistance(distanceKm)
      }

      return {
        ...provider,
        distanceKm,
        distanceFormatted,
      }
    })

    // Filter to relevant matches with genuine score
    const relevantProviders = providersWithDistance.filter((p) => p.matchScore >= 30)

    // Sort: verified first, then closest distance, then match score
    relevantProviders.sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        const distDiff = a.distanceKm - b.distanceKm
        if (Math.abs(distDiff) > 8) return distDiff
      }
      return b.matchScore - a.matchScore
    })

    // Limit to top 2 or 3 curated specialists to keep the UI clean and minimalist
    const topProviders = relevantProviders.slice(0, 3)

    // 4. Generate authentic conversational reply via LLM
    let assistantContent = ''
    const hasImages = processedAttachments.some((a) => a.isImage)
    const categoryName = analysis.category || 'Local Service'
    const cityName = analysis.location || cityContext

    if (isLlmAvailable) {
      try {
        const topProvidersSummary = topProviders.length > 0
          ? topProviders
              .map(
                (p, idx) =>
                  `${idx + 1}. ${p.fullName} (${p.businessName}) - Category: ${p.category}, Rating: ${p.averageRating} out of 5 (${p.completedJobsCount} jobs completed)${p.distanceFormatted ? `, ~${p.distanceFormatted} away` : ''}. Specializes in: ${p.skills.slice(0, 3).join(', ')}`
              )
              .join('\n')
          : 'No direct artisan profiles matched immediately in database.'

        const technicalSystemPrompt = `You are Connecta's AI Technical & Trades Advisor in Nigeria.
Connecta connects Nigerian households and businesses with vetted artisans (plumbers, electricians, solar & inverter technicians, AC specialists, carpenters, mechanics, etc.) backed by Connecta Vault Payment Protection (clients only release funds after physical inspection).

User context:
- City/Location: ${cityName}
- Trade Category: ${categoryName}
- Diagnostic summary: ${analysis.description || analysis.normalizedSummary}
- Urgency: ${analysis.urgency}
${analysis.budget ? `- Stated budget: ${analysis.budget}` : ''}

Top vetted local artisans in ${cityName} from Connecta database:
${topProvidersSummary}

Guidelines for your response:
1. Speak in a helpful, knowledgeable, warm, and professional tone in standard Nigerian English.
2. Directly address the user's specific problem: explain the likely technical cause in practical, clear terms.
3. If matched artisans are available above, recommend the top specialist by name, rating, and proximity.
4. Mention that client payments are protected in Connecta Vault (funds are released only after personal inspection).
5. Suggest a helpful next step or clarifying question to help narrow down quotes.
6. Format cleanly using Markdown with bold highlights and clear paragraphs.
7. STRICT RULE: DO NOT use any emojis anywhere in your response. Keep the tone minimalist, refined, and clean.`

        const llmResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: technicalSystemPrompt },
              ...chatHistoryForLlm,
            ],
            temperature: 0.6,
            max_tokens: 600,
          }),
        })

        if (llmResponse.ok) {
          const llmData = await llmResponse.json()
          assistantContent = llmData.choices?.[0]?.message?.content || ''
        }
      } catch (llmErr) {
        console.warn('[AI Chat API] LLM technical generation error:', llmErr)
      }
    }

    // Deterministic fallback if LLM is offline
    if (!assistantContent) {
      let greeting = `I've analyzed your request for **${categoryName}** in **${cityName}**.`
      if (hasImages) {
        greeting = `I've inspected the photo you shared and identified this as a **${categoryName}** issue in **${cityName}**.`
      }

      let providerSummary = ''
      if (topProviders.length > 0) {
        const topPro = topProviders[0]
        const distanceNote = topPro.distanceFormatted ? ` (~${topPro.distanceFormatted} away)` : ''
        providerSummary = `\n\nFound **${topProviders.length} vetted local specialist${topProviders.length > 1 ? 's' : ''}** near you. Top recommendation: **${topPro.fullName}** from **${topPro.businessName}**${distanceNote}, rated **${topPro.averageRating}/5**.`
      } else {
        providerSummary = `\n\nNo direct category match found immediately in your specific area. You can post a service request or browse the directory.`
      }

      const vaultAssurance = `\n\n**Connecta Vault Protection**: Funds are locked safely and released solely after you inspect and approve the completed job.`

      assistantContent = `${greeting}${providerSummary}${vaultAssurance}`
    }

    const followUpSuggestions = [
      `Request a free quote for ${categoryName}`,
      `Find emergency ${categoryName.toLowerCase()} in ${cityName}`,
      `What is the standard price in ${cityName}?`,
    ]

    return successResponse({
      reply: {
        role: 'assistant',
        content: assistantContent,
        analysis,
        providers: topProviders,
        followUpSuggestions,
      },
    })
  } catch (err: any) {
    console.error('[AI Chat API] Error processing message:', err)
    return errorResponse(err.message || 'Error processing AI chat query', 500)
  }
}
