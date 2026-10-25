import { Resend } from 'resend'
import { generateWelcomeEmailHtml, WelcomeEmailProps } from './welcome-template'

interface SendWelcomeEmailParams extends WelcomeEmailProps {
  toEmail: string
}

export async function sendWelcomeEmail({
  toEmail,
  name,
  role = 'customer',
  dashboardUrl = 'https://myconnecta.ng/dashboard',
}: SendWelcomeEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const cleanEmail = toEmail.trim().toLowerCase()
  const resendApiKey = process.env.RESEND_API_KEY
  const senderEmail = process.env.RESEND_SENDER_EMAIL || 'security@myconnecta.ng'
  const fromAddress = senderEmail.includes('<') ? senderEmail : `Connecta <${senderEmail}>`

  if (!resendApiKey || !resendApiKey.startsWith('re_') || resendApiKey === 're_placeholder') {
    console.log(`[Connecta Email] Skipped sending welcome email to ${cleanEmail} (RESEND_API_KEY placeholder).`)
    return { success: false, error: 'Resend API key not configured' }
  }

  try {
    const resend = new Resend(resendApiKey)
    const html = generateWelcomeEmailHtml({
      name,
      role,
      dashboardUrl,
    })

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: cleanEmail,
      replyTo: 'support@myconnecta.ng',
      subject: 'Welcome to Connecta — Local Services. Real People.',
      html,
    })

    if (error) {
      console.warn('[Welcome Email Notice]', error.message)
      return { success: false, error: error.message }
    }

    console.log(`[Welcome Email Sent] ✉️ Delivered to ${cleanEmail} (Resend ID: ${data?.id})`)
    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Welcome Email Error]', err)
    return { success: false, error: err.message }
  }
}
