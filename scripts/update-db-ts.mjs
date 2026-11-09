import fs from 'fs';
import path from 'path';

const filePath = path.resolve('c:/Users/danku/Desktop/Anti Gravity/Connecta/connecta-2.0/src/lib/server/db.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

// 2. Add properties to ServerUserProfile
const targetUserProfile = `  hourlyRateMinor?: number\n  workshopAddress?: string`;
const replaceUserProfile = `  hourlyRateMinor?: number\n  workshopAddress?: string\n  neighborhood?: string\n  rating?: number\n  reviewCount?: number\n  completedJobs?: number\n  badges?: string[]`;
content = content.replace(targetUserProfile, replaceUserProfile);

// 3. Add ServerWhatsAppSession interface before ServerDatabaseSchema
const sessionInterface = `export interface ServerWhatsAppSession {
  phone: string
  name: string
  language?: 'ha' | 'en'
  step: 'GREETING' | 'CATEGORY' | 'NEIGHBORHOOD' | 'DESCRIPTION' | 'MATCHED'
  selectedCategory?: string
  neighborhood?: string
  description?: string
  lastActive: string
  requestId?: string
  bookingNumber?: string
  matchedArtisanId?: string
}

export interface ServerDatabaseSchema {`;
content = content.replace('export interface ServerDatabaseSchema {', sessionInterface);

// 4. Add whatsapp_sessions to ServerDatabaseSchema
const schemaTarget = `  disputes: ServerDispute[]\n  email_dispatches?: ServerEmailDispatch[]`;
const schemaReplace = `  disputes: ServerDispute[]\n  whatsapp_sessions?: ServerWhatsAppSession[]\n  email_dispatches?: ServerEmailDispatch[]`;
content = content.replace(schemaTarget, schemaReplace);

// 5. Update getInitialDatabase
const initTarget = `    disputes: [],\n  }`;
const initReplace = `    disputes: [],\n    whatsapp_sessions: [],\n  }`;
content = content.replace(initTarget, initReplace);

// 6. Update readDatabase
const readTarget = `      disputes: parsed.disputes || [],\n      email_dispatches: parsed.email_dispatches || [],`;
const readReplace = `      disputes: parsed.disputes || [],\n      whatsapp_sessions: parsed.whatsapp_sessions || [],\n      email_dispatches: parsed.email_dispatches || [],`;
content = content.replace(readTarget, readReplace);

// 7. Append helper methods at the end of db.ts
const helpers = `
// =============================================================================
// WHATSAPP PERSISTENCE & INTAKE ORDER ENGINE
// =============================================================================

export function getWhatsAppSession(phone: string): ServerWhatsAppSession | null {
  const db = readDatabase()
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return db.whatsapp_sessions?.find((s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone) || null
}

export function saveWhatsAppSession(session: ServerWhatsAppSession): ServerWhatsAppSession {
  const db = readDatabase()
  if (!db.whatsapp_sessions) db.whatsapp_sessions = []
  const cleanPhone = session.phone.replace(/[^0-9]/g, '')
  const idx = db.whatsapp_sessions.findIndex((s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone)
  const updated: ServerWhatsAppSession = {
    ...session,
    phone: cleanPhone,
    lastActive: new Date().toISOString(),
  }
  if (idx >= 0) {
    db.whatsapp_sessions[idx] = updated
  } else {
    db.whatsapp_sessions.push(updated)
  }
  writeDatabase(db)
  return updated
}

export function getOrCreateWhatsAppCustomer(phone: string, name = 'WhatsApp Customer'): ServerUserProfile {
  const db = readDatabase()
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  let user = db.profiles.find((p) => (p.whatsapp || p.phone || '').replace(/[^0-9]/g, '') === cleanPhone)
  if (!user) {
    user = {
      id: \`usr_wa_\${cleanPhone}\`,
      fullName: name,
      firstName: name.split(' ')[0] || 'Customer',
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: \`\${cleanPhone}@whatsapp.myconnecta.ng\`,
      phone: \`+\${cleanPhone}\`,
      whatsapp: \`+\${cleanPhone}\`,
      role: 'customer',
      activeRole: 'customer',
      accountStatus: 'active',
      country: 'Nigeria',
      city: 'Kano',
      currency: 'NGN',
      headline: 'WhatsApp Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.profiles.push(user)
    getOrCreateWallet(user.id, 25, 'NGN')
    writeDatabase(db)
  }
  return user
}

export function findMatchingArtisans(category: string, neighborhood?: string): ServerUserProfile[] {
  const db = readDatabase()
  const providers = db.profiles.filter((p) => p.role === 'provider' && (p.city || '').toLowerCase() === 'kano')

  const lowerCat = (category || '').toLowerCase()
  const matchedTrade = providers.filter((p) => {
    const trade = (p.trade || p.category || p.primaryCategory || '').toLowerCase()
    const headline = (p.headline || '').toLowerCase()
    const skills = (p.skills || []).join(' ').toLowerCase()
    return (
      (lowerCat.includes('solar') && (trade.includes('solar') || headline.includes('solar') || skills.includes('solar'))) ||
      ((lowerCat.includes('gen') || lowerCat.includes('generator')) && (trade.includes('gen') || headline.includes('gen') || skills.includes('gen'))) ||
      ((lowerCat.includes('ac') || lowerCat.includes('cooling')) && (trade.includes('ac') || headline.includes('cooling') || headline.includes('hvac') || skills.includes('ac'))) ||
      ((lowerCat.includes('elec') || lowerCat.includes('wiring')) && (trade.includes('elec') || headline.includes('electric') || skills.includes('wiring'))) ||
      ((lowerCat.includes('plumb') || lowerCat.includes('water')) && (trade.includes('plumb') || headline.includes('plumb') || headline.includes('water') || skills.includes('pump')))
    )
  })

  const candidates = matchedTrade.length > 0 ? matchedTrade : providers

  // If neighborhood given, rank matching neighborhood first
  if (neighborhood) {
    const lowerHood = neighborhood.toLowerCase()
    const inHood = candidates.filter((p) =>
      (p.neighborhood || p.workshopAddress || '').toLowerCase().includes(lowerHood)
    )
    if (inHood.length > 0) return inHood
  }

  return candidates
}

export function createWhatsAppOrder(params: {
  phone: string
  name: string
  category: string
  neighborhood: string
  description: string
}): { serviceRequest: ServerServiceRequest; booking: ServerBookingContract; artisan: ServerUserProfile } {
  const customer = getOrCreateWhatsAppCustomer(params.phone, params.name)
  const matchedArtisans = findMatchingArtisans(params.category, params.neighborhood)
  const artisan = matchedArtisans[0] || customer

  const trackingNum = Math.floor(1000 + Math.random() * 9000)
  const bookingNumber = \`CN-KN-\${trackingNum}\`
  const requestId = \`req_\${Date.now()}\`
  const bookingId = \`book_\${Date.now()}\`

  const serviceRequest: ServerServiceRequest = {
    id: requestId,
    customerId: customer.id,
    customerName: customer.fullName,
    title: \`\${params.category} Service in \${params.neighborhood}\`,
    category: params.category,
    categorySlug: params.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    description: params.description,
    urgency: 'today',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 500000, // ₦5,000 diagnostic
    budgetMaxMinor: 2500000,
    currency: 'NGN',
    status: 'matching',
    requiredSkills: artisan.skills || [],
    proposalsCount: 1,
    createdAt: new Date().toISOString(),
  }

  const booking: ServerBookingContract = {
    id: bookingId,
    bookingNumber,
    requestId,
    customerId: customer.id,
    clientName: customer.fullName,
    providerId: artisan.id,
    providerName: artisan.fullName,
    providerTitle: artisan.headline || 'Certified Specialist',
    providerAvatar: artisan.avatarUrl || undefined,
    title: \`\${params.category} Diagnostic & Repair\`,
    category: params.category,
    location: \`\${params.neighborhood}, Kano\`,
    totalAmountMinor: 500000, // ₦5,000 diagnostic callout fee in escrow
    currency: 'NGN',
    escrowStatus: 'locked',
    bookingStatus: 'pending',
    progressPercentage: 0,
    appointmentDate: new Date().toISOString(),
    milestones: [
      { id: 'm1', title: 'Onsite Diagnostics & Fault Isolation', amountMinor: 500000, status: 'current' },
      { id: 'm2', title: 'Repair Completion & Verification', amountMinor: 0, status: 'pending' },
    ],
    createdAt: new Date().toISOString(),
  }

  addServiceRequest(serviceRequest)
  addBooking(booking)

  saveWhatsAppSession({
    phone: params.phone,
    name: params.name,
    step: 'MATCHED',
    selectedCategory: params.category,
    neighborhood: params.neighborhood,
    description: params.description,
    lastActive: new Date().toISOString(),
    requestId,
    bookingNumber,
    matchedArtisanId: artisan.id,
  })

  return { serviceRequest, booking, artisan }
}
`;

content += helpers;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/lib/server/db.ts with WhatsApp persistence and order engine');
