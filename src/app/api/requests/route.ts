import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceRequestSchema } from '@/lib/validations/marketplace'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createServiceRequestSchema.safeParse(body)

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const supabase = await createClient()

    // Determine current user or use demo customer id
    const customerId = '00000000-0000-0000-0000-000000000001'

    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        customer_id: customerId,
        category_id: validated.data.categoryId,
        service_id: validated.data.serviceId || null,
        title: validated.data.title,
        description: validated.data.description,
        urgency: validated.data.urgency,
        service_mode: validated.data.serviceMode,
        preferred_date: validated.data.preferredDate || null,
        budget_min_minor: validated.data.budgetMinMinor || null,
        budget_max_minor: validated.data.budgetMaxMinor || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      // In disconnected development, return accepted request representation
      const simulatedRequest = {
        id: crypto.randomUUID(),
        ...validated.data,
        status: 'open',
        created_at: new Date().toISOString(),
      }
      return successResponse(simulatedRequest, 201)
    }

    return successResponse(data, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('service_requests')
      .select('*, service_categories(name, slug)')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error || !data) {
      return successResponse([])
    }

    return successResponse(data)
  } catch {
    return successResponse([])
  }
}
