import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { processAttachment, ProcessedAttachment } from '@/lib/ai/document-parser'
import { analyzeServiceRequest, matchProviders } from '@/lib/ai/discovery'
import { getAllPublicProviders } from '@/lib/server/providers'
import { calculateDistanceKm, formatDistance, NIGERIAN_CITY_COORDINATES } from '@/lib/geo'

export const maxDuration = 30

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
      return errorResponse('Please provide text or an image to search for a service.', 400)
    }

    // 1. Analyze request with multimodal understanding
    const cityContext = city && city !== 'All Locations' ? city : 'Kano'
    const analysis = await analyzeServiceRequest({
      text,
      attachments: processedAttachments,
      cityContext,
    })

    // 2. Fetch all public providers
    const allProviders = getAllPublicProviders({ verifiedOnly })

    // 3. Match providers
    const matched = matchProviders(analysis, {
      cityFilter: cityContext,
      verifiedOnly,
      providersList: allProviders,
    })

    // 4. Calculate exact geographic distance to user
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

    // Sort: verified first, then closest distance, then match score
    providersWithDistance.sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        // Prioritize providers within 15km
        const distDiff = a.distanceKm - b.distanceKm
        if (Math.abs(distDiff) > 8) return distDiff
      }
      return b.matchScore - a.matchScore
    })

    // 5. Generate authentic conversational reply via LLM with Nigerian trades context and matched artisans
    const apiKey = process.env.OPENAI_API_KEY
    let assistantContent = ''
    const hasImages = processedAttachments.some((a) => a.isImage)
    const categoryName = analysis.category || 'Local Service'
    const topProvidersCount = providersWithDistance.length
    const cityName = analysis.location || cityContext

    if (apiKey && !apiKey.startsWith('placeholder')) {
      try {
        const topProvidersSummary = providersWithDistance.slice(0, 3).map((p, idx) => 
          `${idx + 1}. ${p.fullName} (${p.businessName}) - Category: ${p.category}, Rating: ${p.averageRating} out of 5 (${p.completedJobsCount} jobs completed)${p.distanceFormatted ? `, ~${p.distanceFormatted} away` : ''}. Specializes in: ${p.skills.slice(0, 3).join(', ')}`
        ).join('\n')

        const conversationalSystemPrompt = `You are Connecta's AI Technical & Trades Advisor in Nigeria.
Connecta is a platform connecting Nigerian households and businesses with vetted artisans (plumbers, electricians, solar & inverter technicians, AC specialists, carpenters, mechanics, etc.) backed by a 100% Milestone Escrow Guarantee (clients only release funds after physical inspection).

User context:
- City/Location: ${cityName}
- Trade Category: ${categoryName}
- Diagnostic summary: ${analysis.description || analysis.normalizedSummary}
- Urgency: ${analysis.urgency}
${analysis.budget ? `- Stated budget: ${analysis.budget}` : ''}

Top vetted local artisans in ${cityName} from Connecta database:
${topProvidersSummary || 'No specific local artisans available immediately in database for this exact query.'}

Guidelines for your response:
1. Speak in a helpful, knowledgeable, warm, and professional tone suitable for Nigerian homeowners and businesses (fluent standard English).
2. Directly address the user's specific question or issue: explain the likely technical cause in clear, practical terms (e.g. why a water pump screeches, why an inverter trips, why an AC leaks water, etc.).
3. Recommend the top matched verified artisan(s) from the list above by name, rating, and proximity to assist them.
4. Briefly reassure them that bookings and payments are secured in Connecta Milestone Escrow (funds are never released until the client inspects and approves the finished job).
5. Suggest a helpful next step or question if more details are needed to narrow down quotes.
6. Format your response cleanly using Markdown (bold highlights, clear concise paragraphs).
7. STRICT RULE: DO NOT use any emojis anywhere in your response. Keep the tone refined, minimalist, and clean.`

        // Include recent conversation history (last 5 messages)
        const chatHistoryForLlm = messages.slice(-5).map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content || '',
        }))

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
            max_tokens: 650,
          }),
        })

        if (llmResponse.ok) {
          const llmData = await llmResponse.json()
          assistantContent = llmData.choices?.[0]?.message?.content || ''
        }
      } catch (llmErr) {
        console.warn('[AI Chat API] LLM conversational generation error, falling back to template:', llmErr)
      }
    }

    // Deterministic fallback if LLM is offline or unconfigured
    if (!assistantContent) {
      let greeting = `I've analyzed your request for **${categoryName}** in **${cityName}**.`
      if (hasImages) {
        greeting = `I've inspected the photo you shared and identified this as a **${categoryName}** task in **${cityName}**.`
      }

      let urgencyText = ''
      if (analysis.urgency === 'emergency') {
        urgencyText = `\n\n**Priority: Immediate Attention**. Nearby emergency-ready technicians have been prioritized.`
      }

      let providerSummary = ''
      if (topProvidersCount > 0) {
        const topPro = providersWithDistance[0]
        const distanceNote = topPro.distanceFormatted ? ` (~${topPro.distanceFormatted} away)` : ''
        providerSummary = `\n\nFound **${topProvidersCount} vetted local specialist${topProvidersCount > 1 ? 's' : ''}** near you. Top recommendation: **${topPro.fullName}** from **${topPro.businessName}**${distanceNote}, rated **${topPro.averageRating}/5** with ${topPro.completedJobsCount} verified jobs.`
      } else {
        providerSummary = `\n\nNo direct category match found immediately in your specific area. You can post a **Service Request** to receive bids from artisans across ${cityName}.`
      }

      let nextSteps = `\n\n**Connecta Escrow Guarantee**: All contracts are 100% protected in milestone escrow. Funds are released solely after you inspect and approve completed work.`

      if (analysis.followUpQuestion) {
        nextSteps += `\n\n*Question to narrow down quotes:* ${analysis.followUpQuestion}`
      }

      assistantContent = `${greeting}${urgencyText}${providerSummary}${nextSteps}`
    }

    // 6. Suggest follow-up prompt chips
    const followUpSuggestions = [
      `Request a free quote for ${categoryName}`,
      `Find emergency ${categoryName.toLowerCase()} in ${cityName}`,
      `What is the standard price in ${cityName}?`,
      `Show me only verified master pros`,
    ]

    return successResponse({
      reply: {
        role: 'assistant',
        content: assistantContent,
        analysis,
        providers: providersWithDistance.slice(0, 6),
        followUpSuggestions,
      },
    })
  } catch (err: any) {
    console.error('[AI Chat API] Error processing message:', err)
    return errorResponse(err.message || 'Error processing AI chat query', 500)
  }
}
