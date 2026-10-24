export type UserRole = 'customer' | 'provider' | 'admin'
export type AccountStatus = 'active' | 'suspended' | 'deleted'
export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected' | 'expired'
export type OnboardingStatus = 'draft' | 'submitted' | 'approved' | 'active'
export type ProviderType = 'individual' | 'business'
export type PricingModel = 'fixed' | 'hourly' | 'inspection' | 'starting_from' | 'quote_required'
export type RequestUrgency = 'emergency' | 'today' | 'scheduled' | 'flexible'
export type RequestStatus = 'draft' | 'open' | 'matching' | 'quoted' | 'booked' | 'cancelled' | 'expired' | 'closed'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'withdrawn' | 'expired'
export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'provider_en_route'
  | 'in_progress'
  | 'completion_submitted'
  | 'completed'
  | 'cancelled'
  | 'disputed'
export type PaymentStatus = 'initiated' | 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'

export interface Profile {
  id: string
  full_name: string
  email?: string | null
  phone: string
  roles: UserRole[]
  account_status: AccountStatus
  preferred_language: string
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  parent_category_id?: string | null
  description?: string | null
  icon_key?: string | null
  required_verification_types: string[]
  is_active: boolean
  sort_order: number
}

export interface ProviderProfile {
  id: string
  user_id: string
  provider_type: ProviderType
  business_name?: string | null
  slug: string
  headline: string
  bio: string
  primary_category_id: string
  verification_status: VerificationStatus
  onboarding_status: OnboardingStatus
  experience_years: number
  profile_photo_url?: string | null
  average_rating: number
  review_count: number
  completed_jobs_count: number
  response_rate: number
  response_time_seconds: number
}

export interface ProviderService {
  id: string
  provider_id: string
  category_id: string
  title: string
  description: string
  pricing_model: PricingModel
  base_price_minor: number
  currency: string
  estimated_duration_minutes?: number
  service_mode: 'onsite' | 'remote' | 'dropoff'
  is_active: boolean
}

export interface ServiceRequest {
  id: string
  customer_id: string
  category_id: string
  service_id?: string | null
  title: string
  description: string
  urgency: RequestUrgency
  service_mode: 'onsite' | 'remote' | 'dropoff'
  address_id?: string | null
  preferred_date?: string | null
  budget_min_minor?: number | null
  budget_max_minor?: number | null
  currency: string
  status: RequestStatus
  created_at: string
  expires_at?: string | null
}

export interface QuoteLineItem {
  description: string
  quantity: number
  unit_price_minor: number
}

export interface Quote {
  id: string
  request_id: string
  provider_id: string
  customer_id: string
  version: number
  line_items: QuoteLineItem[]
  labor_minor: number
  materials_minor: number
  visit_fee_minor: number
  discount_minor: number
  total_minor: number
  currency: string
  notes?: string | null
  estimated_duration_minutes?: number
  valid_until: string
  status: QuoteStatus
  created_at: string
}

export interface Booking {
  id: string
  booking_number: string
  request_id?: string | null
  quote_id?: string | null
  customer_id: string
  provider_id: string
  service_id?: string | null
  service_snapshot: {
    title: string
    categoryName: string
  }
  price_snapshot: {
    subtotalMinor: number
    feesMinor: number
    totalMinor: number
    currency: string
  }
  appointment_starts_at: string
  appointment_ends_at?: string | null
  timezone: string
  location_snapshot?: {
    addressText: string
    city: string
    state: string
  } | null
  status: BookingStatus
  cancellation_reason?: string | null
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment?: string | null
  status: 'published' | 'hidden' | 'under_review'
  created_at: string
}
