import { z } from 'zod'

export const onboardingSchema = z.object({
  role: z.enum(['client', 'provider', 'customer']),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email address is required').max(150),
  phone: z.string().min(5, 'Valid phone number is required').max(30),
  whatsapp: z.string().max(30).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  country: z.string().default('Nigeria'),
  currency: z.string().default('NGN'),
  city: z.string().default('Lagos'),
  avatarUrl: z.string().url().optional().or(z.literal('')),

  // Provider specific attributes
  businessName: z.string().max(150).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  primaryCategory: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.union([z.number(), z.string()]).optional(),
  ninNumber: z.string().max(50).optional(),
  workshopAddress: z.string().max(300).optional(),

  // Client specific attributes
  companyName: z.string().max(150).optional(),
  companyBio: z.string().max(2000).optional(),
  companySize: z.string().max(50).optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')).or(z.string().max(150)),
  clientIndustry: z.string().max(100).optional(),
  clientGoal: z.string().max(100).optional(),
  officeAddress: z.string().max(300).optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
