import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getServiceRequests,
  addServiceRequest,
  ServerServiceRequest,
} from '@/lib/server/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('q')?.toLowerCase()

    let jobs = getServiceRequests()

    if (category && category !== 'all') {
      jobs = jobs.filter((j) => j.categorySlug === category || j.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (query) {
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.city.toLowerCase().includes(query)
      )
    }

    return successResponse(jobs)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch jobs', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const {
      title,
      category,
      categorySlug,
      description,
      urgency,
      serviceMode,
      city,
      budgetMinMinor,
      budgetMaxMinor,
      requiredSkills,
    } = body

    if (!title || !description) {
      return errorResponse('Title and description are required', 422)
    }

    const jobId = `JOB-${Math.floor(100 + Math.random() * 900)}`

    const newJob: ServerServiceRequest = {
      id: jobId,
      customerId: user.id,
      customerName: user.fullName,
      customerCompany: user.companyName || `${user.fullName} Household`,
      customerAvatar: user.avatarUrl || undefined,
      title,
      category: category || 'General Trade',
      categorySlug: categorySlug || 'general',
      description,
      urgency: urgency || 'scheduled',
      serviceMode: serviceMode || 'onsite',
      city: city || user.city,
      state: city || user.city,
      budgetMinMinor: Number(budgetMinMinor) || 5000000,
      budgetMaxMinor: Number(budgetMaxMinor) || 15000000,
      currency: user.currency || 'NGN',
      status: 'open',
      requiredSkills: requiredSkills && requiredSkills.length > 0 ? requiredSkills : ['Trade Verification'],
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
    }

    addServiceRequest(newJob)

    return successResponse(newJob, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create job', 500)
  }
}
