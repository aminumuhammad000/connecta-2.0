/**
 * Connecta Admin Broadcast & Direct Email HTML Template
 * Official Connecta Brand Styling:
 * - Clean dual-tone branding
 * - Emerald green accents (#10B981 / #0C513F)
 * - Kano Operations & Escrow verification footer
 */

export interface AdminEmailTemplateProps {
  recipientName?: string
  recipientRole?: string
  recipientTrade?: string
  subject: string
  category: string
  message: string
  ctaText?: string
  ctaUrl?: string
}

export function generateAdminEmailHtml({
  recipientName = 'Valued Member',
  recipientRole = 'user',
  recipientTrade,
  subject,
  category,
  message,
  ctaText,
  ctaUrl,
}: AdminEmailTemplateProps): string {
  // Format message lines into clean HTML paragraphs
  const messageParagraphs = message
    .split('\n\n')
    .filter((p) => p.trim().length > 0)
    .map(
      (para) =>
        `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${para
          .replace(/\n/g, '<br/>')
          .replace(/\{\{name\}\}/gi, recipientName)
          .replace(/\{\{role\}\}/gi, recipientRole)
          .replace(/\{\{trade\}\}/gi, recipientTrade || 'Local Specialist')}</p>`
    )
    .join('')

  const categoryColor =
    category.toLowerCase().includes('security') || category.toLowerCase().includes('verification')
      ? '#D97706'
      : category.toLowerCase().includes('notice')
      ? '#2563EB'
      : category.toLowerCase().includes('billing')
      ? '#7C3AED'
      : '#059669'

  const ctaButtonHtml =
    ctaText && ctaUrl
      ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
          <tr>
            <td align="center" style="border-radius: 9999px; background-color: #0C513F;">
              <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 9999px; letter-spacing: 0.2px;">
                ${ctaText} &rarr;
              </a>
            </td>
          </tr>
        </table>`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px -4px rgba(0,0,0,0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 28px 36px; background-color: #0A1020; border-bottom: 3px solid #10B981;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      Connecta<span style="color: #10B981;">.</span>
                    </span>
                    <span style="display: block; font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">
                      Local Services Kano • Official Notice
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: ${categoryColor}20; border: 1px solid ${categoryColor}40; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                      ${category}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; line-height: 1.3; color: #0A1020; letter-spacing: -0.3px;">
                ${subject}
              </h1>

              <div style="font-size: 14px; font-weight: 600; color: #64748B; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
                Hello <strong style="color: #0A1020;">${recipientName}</strong>,
              </div>

              <!-- Message Text -->
              <div style="font-size: 15px; color: #334155;">
                ${messageParagraphs}
              </div>

              <!-- Call to Action -->
              ${ctaButtonHtml}

              <!-- Security Note -->
              <div style="margin-top: 28px; padding: 14px 18px; background-color: #F8FAFC; border-radius: 12px; border-left: 3px solid #10B981;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #475569;">
                  <strong>Notice from Connecta Kano Administration:</strong> This is an authenticated platform communication. Connecta administrators will never ask for your account password or payment PIN.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569;">
                Connecta Technologies Nigeria • Kano Operations Center
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                Connecting customers with verified plumbers, electricians, AC techs, and skilled artisans in Kano.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
