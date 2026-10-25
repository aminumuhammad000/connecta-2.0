/**
 * Connecta Welcome Email HTML Template
 * Faithfully adapting Connecta Welcome Email Template.png
 * Features:
 * - Verified Connecta Dual-Tone Logo (Yellow + Green 'C' Mark)
 * - Tagline: "Local Services. Real People."
 * - Hero section with green checkmark envelope illustration
 * - Mint "You're all set!" card with Connecta 'C' watermark
 * - Deep green pill CTA button: "Start Exploring"
 * - Clean sign-off and footer with social badges
 */

export interface WelcomeEmailProps {
  name?: string
  role?: 'provider' | 'customer' | 'client'
  dashboardUrl?: string
}

export function generateWelcomeEmailHtml({
  name = '',
  role = 'customer',
  dashboardUrl = 'https://myconnecta.ng/dashboard',
}: WelcomeEmailProps = {}): string {
  const greeting = name && name.trim() ? `Hello ${name.trim()},` : 'Hello,'
  const isProvider = role === 'provider'

  const heroSubtext = isProvider
    ? 'We’re excited to have you with us. Connecta is here to connect you with verified clients, instant milestone escrows, and high-value projects.'
    : 'We’re excited to have you with us. Connecta is here to make it easier for you to find trusted local service providers whenever you need them.'

  const cardDescription = isProvider
    ? 'Now you can showcase your trade, receive direct project requests, and get paid with milestone-protected escrow — quickly and safely.'
    : 'Now you can explore services, connect with skilled professionals, and get things done — quickly and easily.'

  const buttonText = isProvider ? 'Go to Provider Dashboard' : 'Start Exploring'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Connecta</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1F2937;">

  <!-- Outer Canvas Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F6F9; padding: 36px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container (680px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 680px; background-color: #FFFFFF; border-radius: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; overflow: hidden;">
          
          <!-- Inner Padding Container -->
          <tr>
            <td style="padding: 44px 48px;">

              <!-- Header Bar: Logo & Tagline -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #ECEFF2; padding-bottom: 28px; margin-bottom: 38px;">
                <tr>
                  <td align="left" valign="middle">
                    <!-- Connecta Official Logo -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle">
                          <a href="https://myconnecta.ng" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://myconnecta.ng/brand/header/connecta-logo-200x52.png" alt="Connecta" width="148" height="38" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 148px; height: auto;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle" style="font-size: 13px; color: #64748B; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    Local Services. Real People.
                  </td>
                </tr>
              </table>

              <!-- Hero Section: Greeting & Envelope Illustration -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <!-- Left Text Column -->
                  <td valign="top" style="padding-right: 20px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #0A1020; margin: 0 0 16px 0; letter-spacing: -0.5px; line-height: 1.15;">
                      ${greeting}
                    </h1>
                    <p style="font-size: 15px; line-height: 1.65; color: #4B5563; margin: 0; font-weight: 400; max-width: 320px;">
                      ${heroSubtext}
                    </p>
                  </td>

                  <!-- Right Illustration Column -->
                  <td align="right" valign="top" width="190" style="width: 190px;">
                    <!-- Circular Soft Mint Backdrop with Envelope & Check -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="width: 175px; height: 175px; background-color: #EBF7F0; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <!-- Envelope SVG with Floating Sparkles -->
                          <svg width="135" height="120" viewBox="0 0 150 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                            <!-- Sparkle Lines (Golden Yellow) -->
                            <path d="M 24 38 L 16 32" stroke="#F5A623" stroke-width="3" stroke-linecap="round"/>
                            <path d="M 28 50 L 18 52" stroke="#F5A623" stroke-width="3" stroke-linecap="round"/>
                            <path d="M 126 38 L 134 32" stroke="#F5A623" stroke-width="3" stroke-linecap="round"/>
                            <path d="M 122 50 L 132 52" stroke="#F5A623" stroke-width="3" stroke-linecap="round"/>

                            <!-- Letter Card sticking out (White with Subtle Shadow) -->
                            <rect x="36" y="22" width="78" height="54" rx="8" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"/>
                            
                            <!-- Green Circular Badge with White Check -->
                            <circle cx="75" cy="48" r="14" fill="#0C513F"/>
                            <path d="M 70 48 L 74 52 L 81 44" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>

                            <!-- Dark Green Envelope Body -->
                            <path d="M 24 54 C 24 50 26 48 30 48 L 120 48 C 124 48 126 50 126 54 L 126 94 C 126 100 120 106 114 106 L 36 106 C 30 106 24 100 24 94 Z" fill="#0C513F"/>
                            <!-- Envelope Flap Triangle -->
                            <path d="M 24 52 L 75 80 L 126 52" fill="#073B2E"/>
                            <!-- Front V-fold pocket -->
                            <path d="M 24 104 L 62 72 L 75 81 L 88 72 L 126 104 Z" fill="#0C513F"/>
                          </svg>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- "You're all set!" Highlight Card with Watermark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EDF7F2; border-radius: 20px; margin-bottom: 38px; overflow: hidden; position: relative;">
                <tr>
                  <td style="padding: 34px 38px;" valign="middle">
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left Content -->
                        <td valign="middle" align="left" style="z-index: 2; position: relative;">
                          <h2 style="font-size: 24px; font-weight: 800; color: #0C513F; margin: 0 0 10px 0; letter-spacing: -0.3px;">
                            You’re all set!
                          </h2>
                          <p style="font-size: 15px; color: #1E3D30; margin: 0 0 14px 0; font-weight: 600;">
                            Your account has been created successfully.
                          </p>
                          <p style="font-size: 14px; line-height: 1.6; color: #3F6052; margin: 0; max-width: 380px;">
                            ${cardDescription}
                          </p>
                        </td>

                        <!-- Right Connecta 'C' Watermark -->
                        <td valign="middle" align="right" width="150" style="width: 150px; text-align: right;">
                          <svg width="145" height="145" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; opacity: 0.35;">
                            <!-- Elegant Large Connecta 'C' Watermark -->
                            <path d="M 96 28 C 80 12 52 14 34 32 C 18 48 18 72 34 88 C 50 104 78 106 96 92 L 86 78 C 74 88 56 86 46 76 C 36 66 36 54 46 44 C 56 34 74 32 86 42 Z" fill="#A8D5BE"/>
                          </svg>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Centered Call to Action Pill Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 42px;">
                <tr>
                  <td align="center">
                    <!-- Bulletproof Pill Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #0C513F; border-radius: 9999px; box-shadow: 0 4px 14px rgba(12, 81, 63, 0.25);">
                          <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 16px 48px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 800; color: #FFFFFF; text-decoration: none; border-radius: 9999px; letter-spacing: 0.2px;">
                            ${buttonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Assistance Note -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td style="font-size: 14px; line-height: 1.6; color: #4B5563;">
                    If you have any questions or need assistance, feel free to reach out. We’re here to help.
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 34px;">
                <tr>
                  <td>
                    <div style="font-size: 14px; color: #4B5563; margin-bottom: 6px;">Best regards,</div>
                    <div style="font-size: 16px; font-weight: 800; color: #0C513F;">The Connecta Team</div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #ECEFF2; margin-bottom: 24px;">
                <tr>
                  <td></td>
                </tr>
              </table>

              <!-- Social Media Badges -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Facebook -->
                        <td style="padding: 0 6px;">
                          <a href="https://facebook.com/connectang" target="_blank" style="text-decoration: none; display: inline-block; width: 34px; height: 34px; line-height: 34px; text-align: center; background-color: #F1F4F7; border-radius: 50%; color: #475569; font-size: 13px; font-weight: bold;">
                            f
                          </a>
                        </td>
                        <!-- X / Twitter -->
                        <td style="padding: 0 6px;">
                          <a href="https://x.com/connectang" target="_blank" style="text-decoration: none; display: inline-block; width: 34px; height: 34px; line-height: 34px; text-align: center; background-color: #F1F4F7; border-radius: 50%; color: #475569; font-size: 13px; font-weight: bold;">
                            𝕏
                          </a>
                        </td>
                        <!-- Instagram -->
                        <td style="padding: 0 6px;">
                          <a href="https://instagram.com/connectang" target="_blank" style="text-decoration: none; display: inline-block; width: 34px; height: 34px; line-height: 34px; text-align: center; background-color: #F1F4F7; border-radius: 50%; color: #475569; font-size: 13px; font-weight: bold;">
                            ig
                          </a>
                        </td>
                        <!-- YouTube -->
                        <td style="padding: 0 6px;">
                          <a href="https://youtube.com/@connectang" target="_blank" style="text-decoration: none; display: inline-block; width: 34px; height: 34px; line-height: 34px; text-align: center; background-color: #F1F4F7; border-radius: 50%; color: #475569; font-size: 12px; font-weight: bold;">
                            ▶
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Sub-footer Tagline -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 12px; color: #94A3B8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    Connecta &mdash; Local Services. Real People.
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- End Main Card -->

        <!-- Bottom Copyright -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 680px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #94A3B8;">
              &copy; ${new Date().getFullYear()} Connecta Technologies Ltd. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}
