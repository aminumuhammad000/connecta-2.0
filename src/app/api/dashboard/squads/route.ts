import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import {
  getActiveUser,
  getSquads,
  addSquad,
  joinSquad,
  ServerSquad,
} from '@/lib/server/db'

export async function GET() {
  try {
    const squads = getSquads()
    return successResponse(squads)
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch squads', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return errorResponse('User not authenticated', 401)
    }

    const body = await request.json()
    const { action, squadId, name, tradeSpecialty, hubCity, description } = body

    if (action === 'join') {
      if (!squadId) return errorResponse('Squad ID required', 422)
      const joined = joinSquad(squadId, user.id)
      if (!joined) return errorResponse('Squad not found', 404)
      return successResponse({ message: 'Successfully joined squad guild!' })
    }

    if (!name || !tradeSpecialty) {
      return errorResponse('Name and trade specialty are required', 422)
    }

    const newSquad: ServerSquad = {
      id: `SQ-${Date.now().toString().slice(-4)}`,
      name,
      tradeSpecialty,
      hubCity: hubCity || user.city,
      description: description || `Certified cross-trade squad in ${user.city}.`,
      memberCount: 1,
      rating: 5.0,
      completedProjects: 0,
      revenueMinor: 0,
      openSlots: 4,
      tags: [tradeSpecialty, user.city, 'Verified'],
      members: [user.id],
      createdAt: new Date().toISOString(),
    }

    addSquad(newSquad)

    return successResponse(newSquad, 201)
  } catch (err: any) {
    return errorResponse(err.message || 'Squad operation failed', 500)
  }
}
