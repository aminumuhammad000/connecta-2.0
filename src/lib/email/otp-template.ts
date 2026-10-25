/**
 * Connecta OTP Verification Email HTML Template
 * Matches Connecta Welcome Email Template style
 */

export function generateOtpEmailHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Connecta Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1F2937;">

  <!-- Outer Canvas Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F6F9; padding: 36px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container (640px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #FFFFFF; border-radius: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; overflow: hidden;">
          <tr>
            <td style="padding: 40px 44px;">

              <!-- Header Bar: Dual-Tone Logo & Tagline -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #ECEFF2; padding-bottom: 24px; margin-bottom: 32px;">
                <tr>
                  <td align="left" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle">
                          <a href="https://myconnectaai.netlify.app" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://myconnectaai.netlify.app/brand/header/connecta-logo-200x52.png" alt="Connecta" width="140" height="36" style="display: block; border: 0; outline: none; text-decoration: none; max-width: 140px; height: auto;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle" style="font-size: 13px; color: #64748B; font-weight: 500;">
                    Local Services. Real People.
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="font-size: 26px; font-weight: 900; color: #0A1020; margin: 0 0 12px 0; letter-spacing: -0.4px;">
                Verify Your Email Address
              </h1>
              <p style="font-size: 15px; line-height: 1.6; color: #4B5563; margin: 0 0 28px 0;">
                Please enter the 6-digit verification code below to verify your email and activate your Connecta workspace.
              </p>

              <!-- Mint Box with Large Code Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EDF7F2; border-radius: 20px; margin-bottom: 28px; text-align: center;">
                <tr>
                  <td align="center" style="padding: 32px 24px;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #0C513F; display: block; margin-bottom: 12px;">One-Time Security Code</span>
                    <div style="display: inline-block; background-color: #FFFFFF; border: 2px solid #0C513F; border-radius: 14px; padding: 14px 32px; box-shadow: 0 2px 8px rgba(12, 81, 63, 0.08);">
                      <span style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #0C513F; margin-left: 10px;">${code}</span>
                    </div>
                    <p style="font-size: 13px; color: #3F6052; margin: 16px 0 0 0; font-weight: 500;">
                      Expires in <strong>10 minutes</strong>. Never share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0 0 28px 0;">
                If you did not request this verification code, you can safely ignore this email.
              </p>

              <!-- Sign-off -->
              <div style="font-size: 14px; color: #4B5563; margin-bottom: 4px;">Best regards,</div>
              <div style="font-size: 15px; font-weight: 800; color: #0C513F; margin-bottom: 28px;">The Connecta Team</div>

              <!-- Divider -->
              <div style="border-top: 1px solid #ECEFF2; margin-bottom: 20px;"></div>

              <!-- Sub-footer -->
              <div style="text-align: center; font-size: 12px; color: #94A3B8;">
                Connecta &mdash; Local Services. Real People.
              </div>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}
