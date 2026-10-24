import { Resend } from 'resend'
import { env } from './env'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

export interface EmailRecipient {
  email: string
  name?: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    console.warn(`[Resend Email] API key unconfigured. Suppressed delivery to ${to}: "${subject}"`)
    return { success: true, simulated: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Connecta <${env.RESEND_SENDER_EMAIL}>`,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[Resend Error]', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('[Resend Exception]', err)
    return { success: false, error: err }
  }
}

export async function sendWelcomeEmail(recipient: EmailRecipient) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #1A73E8;">Welcome to Connecta, ${recipient.name || 'there'}!</h2>
      <p>Connecta connects you with verified local artisans, repair technicians, and craft professionals across Kano and Nigeria.</p>
      <p>Whether you need plumbing, electrical wiring, phone repairs, or auto servicing, you can now request transparent quotes and book with confidence.</p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">Connecta 2.0 — Trusted Local Services Marketplace</p>
    </div>
  `
  return await sendEmail({ to: recipient.email, subject: 'Welcome to Connecta!', html })
}

export async function sendBookingConfirmationEmail({
  recipient,
  bookingNumber,
  serviceTitle,
  appointmentDate,
  totalNgn,
}: {
  recipient: EmailRecipient
  bookingNumber: string
  serviceTitle: string
  appointmentDate: string
  totalNgn: string
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #10B981;">Booking Confirmed #${bookingNumber}</h2>
      <p>Hello ${recipient.name || 'there'}, your service appointment has been confirmed!</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px 0; color: #6B7280;">Service:</td><td><strong>${serviceTitle}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">Appointment:</td><td><strong>${appointmentDate}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">Agreed Price:</td><td><strong>₦${totalNgn}</strong></td></tr>
      </table>
      <p>You can track technician arrival and exchange messages directly inside your Connecta dashboard.</p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">Connecta 2.0</p>
    </div>
  `
  return await sendEmail({
    to: recipient.email,
    subject: `Booking Confirmed: #${bookingNumber} — ${serviceTitle}`,
    html,
  })
}
