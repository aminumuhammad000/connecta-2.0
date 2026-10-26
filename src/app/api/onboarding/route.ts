import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/api/response'
import { onboardingSchema } from '@/lib/validations/auth'
import { saveUser, findUserByEmail } from '@/lib/auth/user-store'
import { sendWelcomeEmail } from '@/lib/email/send-welcome'
import { upsertUser, getOrCreateWallet, findUserById } from '@/lib/server/db'

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
    const fullName = `${input.firstName} ${input.lastName}`.trim()
    const cityClean = input.city ? input.city.split(',')[0].trim() : 'Lagos'
    const currency = input.currency || 'NGN'
    const country = input.country || 'Nigeria'

    // Hourly rate in minor units (kobo, e.g. 5,000 NGN = 500,000 kobo)
    const numericRate = typeof input.hourlyRate === 'string'
      ? parseFloat(input.hourlyRate.replace(/[^0-9.]/g, '')) || 0
      : (input.hourlyRate || 0)
    const hourlyRateMinor = Math.round(numericRate * 100)

    // Check if account already exists (by email or active session)
    const sessionCookieUserId = request.cookies.get('connecta_session')?.value
    const existingStoredUser = findUserByEmail(input.email) || (sessionCookieUserId ? findUserById(sessionCookieUserId) : null)

    // If client registration and user already exists, prevent duplicate registration
    if (!isProvider && existingStoredUser) {
      return errorResponse('This email is already registered. Please log in.', 409)
    }

    // Determine target user ID (use existing ID if upgrading to provider, or generate new ID)
    const isUpgrade = isProvider && Boolean(existingStoredUser)
    const userId = existingStoredUser ? existingStoredUser.id : randomUUID()
    const dbRole = isProvider ? 'provider' : 'customer'

    // Save to local persistence backup
    try {
      saveUser({
        id: userId,
        fullName: existingStoredUser ? existingStoredUser.fullName : fullName,
        firstName: existingStoredUser ? existingStoredUser.firstName : input.firstName,
        lastName: existingStoredUser ? existingStoredUser.lastName : input.lastName,
        email: (existingStoredUser ? existingStoredUser.email : input.email).toLowerCase(),
        phone: input.phone || existingStoredUser?.phone || '',
        whatsapp: input.whatsapp || input.phone || existingStoredUser?.whatsapp || '',
        password: input.password || existingStoredUser?.password || 'Connecta@2026Secure',
        role: dbRole,
        country: country,
        city: cityClean,
        currency: currency,
        avatarUrl: input.avatarUrl || (existingStoredUser?.avatarUrl ? existingStoredUser.avatarUrl : undefined),
        businessName: input.businessName || existingStoredUser?.businessName,
        headline: input.headline || existingStoredUser?.headline,
        bio: input.bio || existingStoredUser?.bio,
        primaryCategory: input.primaryCategory || existingStoredUser?.primaryCategory,
        skills: input.skills && input.skills.length ? input.skills : existingStoredUser?.skills,
        hourlyRateMinor: hourlyRateMinor > 0 ? hourlyRateMinor : existingStoredUser?.hourlyRateMinor,
        ninNumber: input.ninNumber || existingStoredUser?.ninNumber,
        workshopAddress: input.workshopAddress || existingStoredUser?.workshopAddress,
        companyName: input.companyName || existingStoredUser?.companyName || `${fullName} Workspace`,
        companyBio: input.companyBio || existingStoredUser?.companyBio,
        companySize: input.companySize || existingStoredUser?.companySize,
        companyWebsite: input.companyWebsite || existingStoredUser?.companyWebsite,
        clientIndustry: input.clientIndustry || existingStoredUser?.clientIndustry,
        clientGoal: input.clientGoal || existingStoredUser?.clientGoal,
        createdAt: existingStoredUser ? existingStoredUser.createdAt : new Date().toISOString(),
        welcomeSparks: existingStoredUser?.welcomeSparks ?? (isProvider ? 10 : 25),
      })
    } catch (saveErr) {
      console.warn('[onboarding] Secondary local user save skipped:', saveErr)
    }

    // Save/Update in master server database
    upsertUser({
      id: userId,
      fullName: existingStoredUser ? existingStoredUser.fullName : fullName,
      firstName: existingStoredUser ? existingStoredUser.firstName : input.firstName,
      lastName: existingStoredUser ? existingStoredUser.lastName : input.lastName,
      email: (existingStoredUser ? existingStoredUser.email : input.email).toLowerCase(),
      phone: input.phone || existingStoredUser?.phone || '',
      whatsapp: input.whatsapp || input.phone || existingStoredUser?.whatsapp || '',
      password: input.password || existingStoredUser?.password,
      role: isProvider ? 'provider' : 'customer',
      activeRole: isProvider ? 'provider' : 'customer',
      accountStatus: 'active',
      country: country,
      city: cityClean,
      currency: currency,
      avatarUrl: input.avatarUrl || existingStoredUser?.avatarUrl || null,
      headline: input.headline || (isProvider ? `${input.primaryCategory || 'Skilled'} Specialist` : 'Hiring Client'),
      bio: input.bio || existingStoredUser?.bio || '',
      skills: input.skills || existingStoredUser?.skills || [],
      hourlyRateMinor: hourlyRateMinor > 0 ? hourlyRateMinor : (existingStoredUser?.hourlyRateMinor || 0),
      workshopAddress: input.workshopAddress || existingStoredUser?.workshopAddress,
      companyName: input.companyName || existingStoredUser?.companyName || `${fullName} Workspace`,
      companyBio: input.companyBio || existingStoredUser?.companyBio || '',
      companySize: input.companySize || existingStoredUser?.companySize,
      companyWebsite: input.companyWebsite || existingStoredUser?.companyWebsite,
      clientIndustry: input.clientIndustry || existingStoredUser?.clientIndustry,
      clientGoal: input.clientGoal || existingStoredUser?.clientGoal,
      createdAt: existingStoredUser ? existingStoredUser.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Initialize wallet if not existing (idempotent)
    getOrCreateWallet(userId, isProvider ? 10 : 25, currency)

    let supabaseInserted = false
    let dbErrorDetail: string | null = null

    try {
      const supabase = await createClient()

      if (isUpgrade) {
        // Upgrade existing user in Supabase
        await supabase
          .from('profiles')
          .update({
            roles: ['customer', 'provider'],
            avatar_url: input.avatarUrl || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)

        supabaseInserted = true
      } else {
        // 1. Create Base Profile for new user
        const { error: profileError } = await supabase.from('profiles').insert({
          id: userId,
          full_name: fullName,
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email.toLowerCase(),
          phone: input.phone || '',
          whatsapp: input.whatsapp || input.phone || '',
          roles: isProvider ? ['customer', 'provider'] : ['customer'],
          account_status: 'active',
          onboarding_status: 'active',
          country: country,
          country_code: 'NG',
          currency: currency,
          city: cityClean,
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
        }
      }

      // 2. Manage Provider or Customer Specific Sub-profiles
      if (supabaseInserted) {
        if (isProvider) {
          // 2a. Provider Profile
          const businessName = input.businessName || `${fullName} Services`
          const slug = `${slugify(businessName)}-${userId.slice(0, 6)}`

          const { data: existingProviderProfile } = await supabase
            .from('provider_profiles')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle()

          let providerProfileId = existingProviderProfile?.id

          if (existingProviderProfile) {
            await supabase
              .from('provider_profiles')
              .update({
                business_name: businessName,
                headline: input.headline || `${input.primaryCategory || 'Skilled'} Specialist in ${cityClean}`,
                bio: input.bio || `Certified and vetted specialist serving clients across ${cityClean}.`,
                skills: input.skills && input.skills.length ? input.skills : ['Professional Service'],
                hourly_rate_minor: hourlyRateMinor > 0 ? hourlyRateMinor : 2500000,
                nin_number: input.ninNumber || null,
                workshop_address: input.workshopAddress || `${cityClean}, Nigeria`,
                city: cityClean,
                state: cityClean,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingProviderProfile.id)
          } else {
            providerProfileId = randomUUID()
            await supabase.from('provider_profiles').insert({
              id: providerProfileId,
              user_id: userId,
              business_name: businessName,
              slug,
              headline: input.headline || `${input.primaryCategory || 'Skilled'} Specialist in ${cityClean}`,
              bio: input.bio || `Certified and vetted specialist serving clients across ${cityClean}.`,
              skills: input.skills && input.skills.length ? input.skills : ['Professional Service'],
              verification_status: 'verified',
              onboarding_status: 'approved',
              experience_years: 5,
              hourly_rate_minor: hourlyRateMinor > 0 ? hourlyRateMinor : 2500000,
              nin_number: input.ninNumber || null,
              workshop_address: input.workshopAddress || `${cityClean}, Nigeria`,
              city: cityClean,
              state: cityClean,
              average_rating: 5.0,
              review_count: 0,
              completed_jobs_count: 0,
            })
          }

          // 3a. Provider Service Area
          if (providerProfileId) {
            const { data: existingArea } = await supabase
              .from('provider_service_areas')
              .select('id')
              .eq('provider_id', providerProfileId)
              .maybeSingle()

            if (!existingArea) {
              await supabase.from('provider_service_areas').insert({
                provider_id: providerProfileId,
                city: cityClean,
                state: cityClean,
                radius_km: 35.0,
                supported_neighborhoods: [`${cityClean} Central`],
              })
            }
          }
        }

        // Always ensure customer profile exists (all users have client capability)
        const { data: existingCustomerProfile } = await supabase
          .from('customer_profiles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()

        if (!existingCustomerProfile) {
          await supabase.from('customer_profiles').insert({
            user_id: userId,
            company_name: input.companyName || `${fullName} Workspace`,
            company_bio: input.companyBio || 'Connecta client workspace ready for instant milestone escrow contracts.',
            company_size: input.companySize || 'Solo / Household',
            company_website: input.companyWebsite || null,
            industry: input.clientIndustry || 'Personal & Facilities',
            client_goal: input.clientGoal || 'one_off_project',
          })
        }

        // 4. Initial Wallet (Idempotent check in Supabase)
        const { data: existingSupabaseWallet } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()

        if (!existingSupabaseWallet) {
          await supabase.from('wallets').insert({
            id: randomUUID(),
            user_id: userId,
            balance_minor: 0,
            escrow_balance_minor: 0,
            currency: currency,
            sparks_balance: isProvider ? 10 : 25,
          })
        }
      }
    } catch (err: any) {
      dbErrorDetail = err.message || 'Database connection error'
    }

    const payloadResult = {
      id: userId,
      fullName: existingStoredUser ? existingStoredUser.fullName : fullName,
      email: (existingStoredUser ? existingStoredUser.email : input.email).toLowerCase(),
      phone: input.phone || existingStoredUser?.phone || '',
      role: dbRole,
      city: cityClean,
      currency: currency,
      onboardingStatus: 'active',
      isLiveInDatabase: supabaseInserted,
      dbNotice: dbErrorDetail,
      welcomeSparks: existingStoredUser?.welcomeSparks ?? (isProvider ? 10 : 25),
      message: isProvider
        ? (isUpgrade ? 'Service Provider capability activated successfully! Welcome to your specialist workspace.' : 'Service Provider account created successfully! Welcome to Connecta.')
        : 'Client workspace account created successfully! Welcome to Connecta.',
    }

    // Dispatch Welcome Email asynchronously if new registration
    if (!isUpgrade) {
      sendWelcomeEmail({
        toEmail: input.email,
        name: input.firstName,
        role: isProvider ? 'provider' : 'customer',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://myconnecta.ng'}/dashboard`,
      }).catch((err) => console.error('[Welcome Email Background Error]', err))
    }

    const response = successResponse(payloadResult, isUpgrade ? 200 : 201)
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
