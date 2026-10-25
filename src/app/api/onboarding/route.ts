import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { onboardingSchema } from '@/lib/validations/auth'
import { saveUser, findUserByEmail } from '@/lib/auth/user-store'
import { sendWelcomeEmail } from '@/lib/email/send-welcome'
import { upsertUser, getOrCreateWallet } from '@/lib/server/db'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = onboardingSchema.safeParse(body)

    if (!validated.success) {
      return errorResponse('Validation failed', 422, validated.error.flatten())
    }

    const input = validated.data
    const isProvider = input.role === 'provider'
    const dbRole = isProvider ? 'provider' : 'customer'
    const fullName = `${input.firstName} ${input.lastName}`.trim()
    const userId = randomUUID()

    // Check if account already exists
    const existingStoredUser = findUserByEmail(input.email)
    if (existingStoredUser) {
      return errorResponse('An account with this email address already exists. Please log in instead.', 409)
    }

    // Hourly rate in minor units (kobo, e.g. 5,000 NGN = 500,000 kobo)
    const numericRate = typeof input.hourlyRate === 'string'
      ? parseFloat(input.hourlyRate.replace(/[^0-9.]/g, '')) || 0
      : (input.hourlyRate || 0)
    const hourlyRateMinor = Math.round(numericRate * 100)

    // Save to local persistence backup
    saveUser({
      id: userId,
      fullName,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      password: input.password,
      role: isProvider ? 'provider' : 'customer',
      country: input.country,
      city: input.city,
      currency: input.currency,
      avatarUrl: input.avatarUrl,
      businessName: input.businessName,
      headline: input.headline,
      bio: input.bio,
      primaryCategory: input.primaryCategory,
      skills: input.skills,
      hourlyRateMinor,
      ninNumber: input.ninNumber,
      companyName: input.companyName,
      clientIndustry: input.clientIndustry,
      createdAt: new Date().toISOString(),
      welcomeSparks: isProvider ? 10 : 25,
    })

    // Save to master server database
    upsertUser({
      id: userId,
      fullName,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      password: input.password,
      role: dbRole,
      activeRole: dbRole,
      accountStatus: 'active',
      country: input.country,
      city: input.city,
      currency: input.currency,
      avatarUrl: input.avatarUrl || null,
      headline: input.headline || (isProvider ? `${input.primaryCategory || 'Skilled'} Specialist` : 'Hiring Client'),
      bio: input.bio || '',
      skills: input.skills || [],
      hourlyRateMinor,
      workshopAddress: input.workshopAddress,
      companyName: input.companyName,
      companyBio: input.companyBio,
      companySize: input.companySize,
      companyWebsite: input.companyWebsite,
      clientIndustry: input.clientIndustry,
      clientGoal: input.clientGoal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Initialize wallet with AI Sparks
    getOrCreateWallet(userId, isProvider ? 10 : 25, input.currency)

    let supabaseInserted = false
    let dbErrorDetail: string | null = null

    try {
      const supabase = await createClient()

      // 1. Create Base Profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        whatsapp: input.whatsapp || input.phone,
        roles: [dbRole],
        account_status: 'active',
        onboarding_status: 'active',
        country: input.country,
        country_code: 'NG',
        currency: input.currency,
        city: input.city,
        avatar_url: input.avatarUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        if (profileError.code === '23505' || profileError.message?.includes('duplicate key')) {
          return errorResponse('An account with this email address already exists. Please log in instead.', 409)
        }
        dbErrorDetail = profileError.message
      } else {
        supabaseInserted = true

        if (isProvider) {
          // 2a. Provider Profile
          const providerProfileId = randomUUID()
          const businessName = input.businessName || `${fullName} Services`
          const slug = `${slugify(businessName)}-${userId.slice(0, 6)}`

          await supabase.from('provider_profiles').insert({
            id: providerProfileId,
            user_id: userId,
            business_name: businessName,
            slug,
            headline: input.headline || `${input.primaryCategory || 'Skilled'} Specialist in ${input.city}`,
            bio: input.bio || `Certified and vetted specialist serving clients across ${input.city}.`,
            skills: input.skills && input.skills.length ? input.skills : ['Professional Service'],
            verification_status: 'verified',
            onboarding_status: 'approved',
            experience_years: 5,
            hourly_rate_minor: hourlyRateMinor > 0 ? hourlyRateMinor : 2500000,
            nin_number: input.ninNumber || null,
            workshop_address: input.workshopAddress || `${input.city}, Nigeria`,
            city: input.city,
            state: input.city,
            average_rating: 5.0,
            review_count: 0,
            completed_jobs_count: 0,
          })

          // 3a. Provider Service Area
          await supabase.from('provider_service_areas').insert({
            provider_id: providerProfileId,
            city: input.city,
            state: input.city,
            radius_km: 35.0,
            supported_neighborhoods: [`${input.city} Central`],
          })
        } else {
          // 2b. Customer Profile
          await supabase.from('customer_profiles').insert({
            user_id: userId,
            company_name: input.companyName || `${fullName} Household`,
            company_bio: input.companyBio || 'Connecta hiring client verified for instant milestone escrow contracts.',
            company_size: input.companySize || 'Solo / Household',
            company_website: input.companyWebsite || null,
            industry: input.clientIndustry || 'Personal & Facilities',
            client_goal: input.clientGoal || 'one_off_project',
          })

          // 3b. Customer Address
          if (input.officeAddress) {
            await supabase.from('customer_addresses').insert({
              user_id: userId,
              label: 'Office',
              address_text: input.officeAddress,
              city: input.city,
              state: input.city,
              country_code: 'NG',
              is_default: true,
            })
          }
        }

        // 4. Initial Wallet & Welcome AI Sparks
        await supabase.from('wallets').insert({
          id: randomUUID(),
          user_id: userId,
          balance_minor: 0,
          escrow_balance_minor: 0,
          currency: input.currency,
          sparks_balance: isProvider ? 10 : 25,
        })
      }
    } catch (err: any) {
      dbErrorDetail = err.message || 'Database connection error'
    }

    const payloadResult = {
      id: userId,
      fullName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      role: dbRole,
      city: input.city,
      currency: input.currency,
      onboardingStatus: 'active',
      isLiveInDatabase: supabaseInserted,
      dbNotice: dbErrorDetail,
      welcomeSparks: isProvider ? 10 : 25,
      message: isProvider
        ? 'Service Provider account created successfully! Welcome to Connecta.'
        : 'Client workspace account created successfully! Welcome to Connecta.',
    }

    // Dispatch Welcome Email asynchronously (non-blocking)
    sendWelcomeEmail({
      toEmail: input.email,
      name: input.firstName,
      role: isProvider ? 'provider' : 'customer',
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://myconnecta.ng'}/dashboard`,
    }).catch((err) => console.error('[Welcome Email Background Error]', err))

    const response = successResponse(payloadResult, 201)
    response.cookies.set('connecta_session', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    })
    response.cookies.set('connecta_role', dbRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    })
    return response
  } catch (err: any) {
    return errorResponse(err.message || 'Onboarding registration failed', 500)
  }
}
