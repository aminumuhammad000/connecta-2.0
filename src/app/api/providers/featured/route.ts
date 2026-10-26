import { NextResponse } from 'next/server'
import { getFeaturedSpecialists } from '@/lib/server/providers'

export async function GET() {
  try {
    const specialists = getFeaturedSpecialists()
    return NextResponse.json({
      success: true,
      data: specialists,
    })
  } catch (error: any) {
    console.error('Error fetching featured specialists:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured specialists', error: String(error) },
      { status: 500 }
    )
  }
}
