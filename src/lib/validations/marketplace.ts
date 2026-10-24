import { z } from 'zod'

// Service Request
export const createServiceRequestSchema = z.object({
  categoryId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(20, 'Please provide more details on the issue').max(2000),
  urgency: z.enum(['emergency', 'today', 'scheduled', 'flexible']).default('flexible'),
  serviceMode: z.enum(['onsite', 'remote', 'dropoff']).default('onsite'),
  preferredDate: z.string().datetime().optional(),
  budgetMinMinor: z.number().int().nonnegative().optional(),
  budgetMaxMinor: z.number().int().nonnegative().optional(),
  addressId: z.string().uuid().optional(),
  attachments: z.array(z.string().url()).optional(),
})

// Provider Quote Submission
export const quoteLineItemSchema = z.object({
  description: z.string().min(2).max(100),
  quantity: z.number().int().positive().default(1),
  unitPriceMinor: z.number().int().nonnegative(),
})

export const createQuoteSchema = z.object({
  requestId: z.string().uuid(),
  lineItems: z.array(quoteLineItemSchema).min(1, 'Quote must include at least one item'),
  laborMinor: z.number().int().nonnegative().default(0),
  materialsMinor: z.number().int().nonnegative().default(0),
  visitFeeMinor: z.number().int().nonnegative().default(0),
  discountMinor: z.number().int().nonnegative().default(0),
  estimatedDurationMinutes: z.number().int().positive().optional(),
  validUntil: z.string().datetime(),
  notes: z.string().max(1000).optional(),
})

// Booking State Transition
export const bookingStatusUpdateSchema = z.object({
  bookingId: z.string().uuid(),
  newStatus: z.enum([
    'confirmed',
    'provider_en_route',
    'in_progress',
    'completion_submitted',
    'completed',
    'cancelled',
    'disputed',
  ]),
  reason: z.string().max(500).optional(),
  evidenceKeys: z.array(z.string()).optional(),
})

// Provider Onboarding
export const providerOnboardingSchema = z.object({
  providerType: z.enum(['individual', 'business']).default('individual'),
  businessName: z.string().min(2).max(100).optional(),
  headline: z.string().min(5).max(150),
  bio: z.string().min(30).max(1500),
  primaryCategoryId: z.string().uuid(),
  experienceYears: z.number().int().min(0).max(60).default(1),
  serviceCity: z.string().default('Kano'),
  serviceRadiusKm: z.number().positive().default(25),
  services: z.array(
    z.object({
      categoryId: z.string().uuid(),
      title: z.string().min(3).max(100),
      description: z.string().min(10).max(500),
      pricingModel: z.enum(['fixed', 'hourly', 'inspection', 'starting_from', 'quote_required']),
      basePriceMinor: z.number().int().nonnegative().default(0),
    })
  ).min(1, 'Register at least one service offering'),
})

// Customer Review
export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000).optional(),
})
