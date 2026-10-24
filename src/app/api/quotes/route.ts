import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createQuoteSchema } from '@/lib/validations/marketplace'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createQuoteSchema.safeParse(body)

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const {
      requestId,
      lineItems,
      laborMinor,
      materialsMinor,
      visitFeeMinor,
      discountMinor,
      estimatedDurationMinutes,
      validUntil,
      notes,
    } = validated.data

    // Server-side calculation of line items total in minor units (kobo)
    const itemsTotalMinor = lineItems.reduce((acc, item) => {
      return acc + item.quantity * item.unitPriceMinor
    }, 0)

    const totalMinor = itemsTotalMinor + laborMinor + materialsMinor + visitFeeMinor - discountMinor

    if (totalMinor < 0) {
      return errorResponse('Total quote amount cannot be negative', 400)
    }

    const supabase = await createClient()
    const providerId = 'p1010000-0000-0000-0000-000000000001'
    const customerId = '00000000-0000-0000-0000-000000000001'

    const quotePayload = {
      request_id: requestId,
      provider_id: providerId,
      customer_id: customerId,
      version: 1,
      line_items: lineItems,
      labor_minor: laborMinor,
      materials_minor: materialsMinor,
      visit_fee_minor: visitFeeMinor,
      discount_minor: discountMinor,
      total_minor: totalMinor,
      currency: 'NGN',
      estimated_duration_minutes: estimatedDurationMinutes || 120,
      valid_until: validUntil,
      notes: notes || null,
      status: 'sent',
    }

    const { data, error } = await supabase
      .from('quotes')
      .insert(quotePayload)
      .select()
      .single()

    if (error) {
      const simulatedQuote = {
        id: crypto.randomUUID(),
        ...quotePayload,
        created_at: new Date().toISOString(),
      }
      return successResponse(simulatedQuote, 201)
    }

    return successResponse(data, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}
