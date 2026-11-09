/**
 * WhatsApp Cloud API Client for Connecta
 * Handles outgoing WhatsApp messages, interactive buttons, list selectors, and read receipts.
 */

const WHATSAPP_API_VERSION = 'v22.0'
const DEFAULT_PHONE_NUMBER_ID = '1221266647745179' // Meta Test / Cloud API Line

export interface ButtonOption {
  id: string
  title: string
}

export interface ListRow {
  id: string
  title: string
  description?: string
}

export interface ListSection {
  title: string
  rows: ListRow[]
}

function getCredentials() {
  const token =
    process.env.WHATSAPP_ACCESS_TOKEN ||
    'EAAXbHt0xtNUBS29klyy8l3AZArrYWtHQqN300oov7fZCsOGAN16IUTAqhYu07RV69J8Ps5qBWM0Q5ib51d8fWC3vjPE43yZCvWgwrulY3pzSXSCAEPjixBdgc2m3NO644UKv8Ht7tU7bupZBym398cQ9EaMw57DowyeY2HjViWMaGEH5khZCXcCJHZA5L7z4TOQ0ZAm5PKkwiH6ZBiIZAY3ZAj1M16yEHemZAXJ7FZBK08UsxVXl8qNzyLVvMzPjRPgeAtQLZBsTEmCma5WcqFWsWrjDYyUYZD'
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || DEFAULT_PHONE_NUMBER_ID

  return { token, phoneNumberId }
}

/**
 * Sends a raw message payload to WhatsApp Cloud API
 */
export async function sendWhatsAppPayload(payload: Record<string, any>) {
  const { token, phoneNumberId } = getCredentials()
  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      ...payload,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[WhatsApp API Error]:', JSON.stringify(data, null, 2))
    throw new Error(data?.error?.message || 'Failed to send WhatsApp message')
  }

  return data
}

/**
 * Sends a plain text message to a user
 */
export async function sendTextMessage(to: string, text: string) {
  return sendWhatsAppPayload({
    to,
    type: 'text',
    text: { preview_url: true, body: text },
  })
}

/**
 * Sends an interactive quick-reply button message (up to 3 buttons)
 */
export async function sendInteractiveButtons(
  to: string,
  bodyText: string,
  buttons: ButtonOption[],
  headerText?: string,
  footerText: string = 'Connecta Kano • Verified Artisans'
) {
  return sendWhatsAppPayload({
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      ...(headerText ? { header: { type: 'text', text: headerText } } : {}),
      body: { text: bodyText },
      footer: { text: footerText },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({
          type: 'reply',
          reply: {
            id: b.id,
            title: b.title.slice(0, 20),
          },
        })),
      },
    },
  })
}

/**
 * Sends an interactive list picker message (up to 10 items)
 */
export async function sendInteractiveList(
  to: string,
  bodyText: string,
  buttonText: string,
  sections: ListSection[],
  headerText?: string,
  footerText: string = 'Connecta Kano • Safe Escrow'
) {
  return sendWhatsAppPayload({
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      ...(headerText ? { header: { type: 'text', text: headerText } } : {}),
      body: { text: bodyText },
      footer: { text: footerText },
      action: {
        button: buttonText.slice(0, 20),
        sections,
      },
    },
  })
}

/**
 * Marks a received message as read with blue ticks
 */
export async function markMessageAsRead(messageId: string) {
  try {
    const { token, phoneNumberId } = getCredentials()
    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    })
  } catch (err) {
    console.error('Error marking message read:', err)
  }
}
