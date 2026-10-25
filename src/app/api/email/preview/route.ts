import { NextRequest, NextResponse } from 'next/server'
import { generateWelcomeEmailHtml } from '@/lib/email/welcome-template'
import { generateOtpEmailHtml } from '@/lib/email/otp-template'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const template = searchParams.get('template') || 'welcome'
  const name = searchParams.get('name') || 'Ibrahim Aliyu'
  const role = (searchParams.get('role') as any) || 'provider'
  const code = searchParams.get('code') || '849201'

  let html: string
  if (template === 'otp') {
    html = generateOtpEmailHtml(code)
  } else {
    html = generateWelcomeEmailHtml({
      name,
      role,
      dashboardUrl: 'http://localhost:3000/dashboard',
    })
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
