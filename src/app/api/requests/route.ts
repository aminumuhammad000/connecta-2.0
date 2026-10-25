import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { createServiceRequestSchema } from '@/lib/validations/marketplace'
import { getActiveUser, addServiceRequest, getServiceRequests, ServerServiceRequest } from '@/lib/server/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createServiceRequestSchema.safeParse(body)

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const activeUser = await getActiveUser()
    const customerId = activeUser ? activeUser.id : '00000000-0000-0000-0000-000000000001'
    const customerName = activeUser ? activeUser.fullName : 'Verified Client'
    const customerCompany = activeUser?.companyName || `${customerName} Household`
    const city = activeUser?.city || 'Lagos'
    const newId = `JOB-${Math.floor(100 + Math.random() * 900)}`

    // Save to master server database
    const serverJob: ServerServiceRequest = {
      id: newId,
      customerId,
      customerName,
      customerCompany,
      customerAvatar: activeUser?.avatarUrl || undefined,
      title: validated.data.title,
      category: validated.data.categoryId || 'General Trade',
      categorySlug: validated.data.categoryId?.toLowerCase() || 'general',
      description: validated.data.description,
      urgency: validated.data.urgency,
      serviceMode: validated.data.serviceMode,
      city,
      state: city,
      budgetMinMinor: validated.data.budgetMinMinor || 5000000,
      budgetMaxMinor: validated.data.budgetMaxMinor || 15000000,
      currency: activeUser?.currency || 'NGN',
      status: 'open',
      requiredSkills: ['Trade Verification'],
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
    }

    addServiceRequest(serverJob)

    try {
      const supabase = await createClient()
      await supabase.from('service_requests').insert({
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
    } catch {
      // Supabase fallback handled gracefully by server database
    }

    return successResponse(serverJob, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

export async function GET() {
  try {
    const jobs = getServiceRequests()
    return successResponse(jobs)
  } catch {
    return successResponse([])
  }
}
