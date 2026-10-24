import { NextResponse } from 'next/server'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function errorResponse(message: string, status = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        details: details || null,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}
