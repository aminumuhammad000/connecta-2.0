-- Connecta 2.0 PostgreSQL Schema for Supabase
-- Version: 1.0.0

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    roles user_role[] DEFAULT ARRAY['customer'::user_role],
    account_status account_status DEFAULT 'active',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMER PROFILES & ADDRESSES
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_contact_method TEXT DEFAULT 'in_app' CHECK (preferred_contact_method IN ('in_app', 'phone')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Other')),
    address_text TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kano',
    state TEXT NOT NULL DEFAULT 'Kano',
    country_code TEXT NOT NULL DEFAULT 'NG',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    description TEXT,
    icon_key TEXT,
    required_verification_types TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROVIDER PROFILES & DETAILS
CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected', 'expired');
CREATE TYPE onboarding_status AS ENUM ('draft', 'submitted', 'approved', 'active');
CREATE TYPE provider_type AS ENUM ('individual', 'business');

CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    provider_type provider_type DEFAULT 'individual',
    business_name TEXT,
    slug TEXT UNIQUE,
    headline TEXT,
    bio TEXT,
    primary_category_id UUID REFERENCES public.service_categories(id),
    verification_status verification_status DEFAULT 'not_submitted',
    onboarding_status onboarding_status DEFAULT 'draft',
    experience_years INT DEFAULT 0,
    profile_photo_url TEXT,
    average_rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    response_rate INT DEFAULT 100,
    response_time_seconds INT DEFAULT 3600,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROVIDER SERVICES
CREATE TYPE pricing_model AS ENUM ('fixed', 'hourly', 'inspection', 'starting_from', 'quote_required');

CREATE TABLE IF NOT EXISTS public.provider_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    pricing_model pricing_model DEFAULT 'quote_required',
    base_price_minor BIGINT DEFAULT 0, -- Store money in kobo (e.g. 500000 = ₦5,000.00)
    currency TEXT DEFAULT 'NGN',
    estimated_duration_minutes INT,
    service_mode TEXT DEFAULT 'onsite' CHECK (service_mode IN ('onsite', 'remote', 'dropoff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROVIDER SERVICE AREAS & AVAILABILITY
CREATE TABLE IF NOT EXISTS public.provider_service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    city TEXT NOT NULL DEFAULT 'Kano',
    state TEXT NOT NULL DEFAULT 'Kano',
    country_code TEXT NOT NULL DEFAULT 'NG',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    radius_km NUMERIC(5, 2) DEFAULT 25.0,
    supported_neighborhoods TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE UNIQUE,
    timezone TEXT DEFAULT 'Africa/Lagos',
    weekly_schedule JSONB DEFAULT '[]'::jsonb,
    exceptions JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VERIFICATION CASES & DOCUMENTS
CREATE TABLE IF NOT EXISTS public.verification_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'expired')),
    checks JSONB DEFAULT '[]'::jsonb,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewer_id UUID REFERENCES public.profiles(id),
    rejection_reason TEXT,
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_case_id UUID NOT NULL REFERENCES public.verification_cases(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewer_id UUID REFERENCES public.profiles(id)
);

-- 8. SERVICE REQUESTS & QUOTES
CREATE TYPE request_urgency AS ENUM ('emergency', 'today', 'scheduled', 'flexible');
CREATE TYPE request_status AS ENUM ('draft', 'open', 'matching', 'quoted', 'booked', 'cancelled', 'expired', 'closed');

CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    service_id UUID REFERENCES public.provider_services(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency request_urgency DEFAULT 'flexible',
    service_mode TEXT DEFAULT 'onsite' CHECK (service_mode IN ('onsite', 'remote', 'dropoff')),
    address_id UUID REFERENCES public.customer_addresses(id),
    preferred_date TIMESTAMPTZ,
    budget_min_minor BIGINT,
    budget_max_minor BIGINT,
    currency TEXT DEFAULT 'NGN',
    status request_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.request_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    storage_key TEXT NOT NULL,
    mime_type TEXT,
    purpose TEXT DEFAULT 'problem' CHECK (purpose IN ('problem', 'inspection', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.request_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'interested', 'declined', 'expired')),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    viewed_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    UNIQUE(request_id, provider_id)
);

CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'withdrawn', 'expired');

CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    version INT DEFAULT 1,
    line_items JSONB DEFAULT '[]'::jsonb,
    labor_minor BIGINT DEFAULT 0,
    materials_minor BIGINT DEFAULT 0,
    visit_fee_minor BIGINT DEFAULT 0,
    discount_minor BIGINT DEFAULT 0,
    total_minor BIGINT NOT NULL,
    currency TEXT DEFAULT 'NGN',
    notes TEXT,
    estimated_duration_minutes INT,
    valid_until TIMESTAMPTZ NOT NULL,
    status quote_status DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BOOKINGS & EVENTS
CREATE TYPE booking_status AS ENUM (
    'pending_confirmation',
    'confirmed',
    'provider_en_route',
    'in_progress',
    'completion_submitted',
    'completed',
    'cancelled',
    'disputed'
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT NOT NULL UNIQUE,
    request_id UUID REFERENCES public.service_requests(id),
    quote_id UUID REFERENCES public.quotes(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id),
    service_id UUID REFERENCES public.provider_services(id),
    service_snapshot JSONB NOT NULL,
    price_snapshot JSONB NOT NULL,
    appointment_starts_at TIMESTAMPTZ NOT NULL,
    appointment_ends_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Africa/Lagos',
    location_snapshot JSONB,
    status booking_status DEFAULT 'pending_confirmation',
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.profiles(id),
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    event_type TEXT NOT NULL,
    previous_status booking_status,
    new_status booking_status,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    stage TEXT NOT NULL CHECK (stage IN ('before', 'during', 'after')),
    storage_key TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS & DISPUTES
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'under_review')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_id, reviewee_id)
);

CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    opened_by UUID NOT NULL REFERENCES public.profiles(id),
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_keys TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'awaiting_response', 'resolved', 'closed')),
    resolution TEXT,
    assigned_admin_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 11. PAYMENTS & PAYOUTS
CREATE TYPE payment_status AS ENUM ('initiated', 'pending', 'succeeded', 'failed', 'cancelled', 'refunded');

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id),
    amount_minor BIGINT NOT NULL,
    currency TEXT DEFAULT 'NGN',
    purpose TEXT DEFAULT 'full_payment' CHECK (purpose IN ('deposit', 'full_payment', 'balance')),
    payment_provider TEXT DEFAULT 'paystack',
    provider_reference TEXT UNIQUE,
    idempotency_key TEXT UNIQUE NOT NULL,
    status payment_status DEFAULT 'initiated',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SEED DEFAULT CATEGORIES
INSERT INTO public.service_categories (name, slug, description, icon_key, sort_order) VALUES
('Plumbing & Pipefitting', 'plumbing', 'Water leaks, pipe laying, borehole, bathroom and kitchen fittings', 'Wrench', 1),
('Electrical & Wiring', 'electrical', 'Fault finding, wiring, inverter/solar installation, breaker repairs', 'Zap', 2),
('Phone & Tablet Repair', 'phone-repair', 'Screen replacements, battery changes, charging ports, motherboard fixes', 'Smartphone', 3),
('Computer & Laptop Repair', 'computer-repair', 'Hardware upgrades, OS reinstallation, keyboard, screen & thermal fixes', 'Laptop', 4),
('Carpentry & Woodwork', 'carpentry', 'Custom furniture, door fittings, roof woodwork, lock fixing', 'Hammer', 5),
('Auto Mechanics & Repair', 'auto-mechanic', 'Engine servicing, brake repair, suspensions, diagnostics & routine care', 'Car', 6),
('Painting & Wall Finishing', 'painting', 'Interior & exterior painting, wallpaper, POP plastering, waterproofing', 'Paintbrush', 7),
('Air Conditioning & Cooling', 'ac-cooling', 'AC gas refill, compressor repair, cleaning, installation & freezer fixes', 'Wind', 8)
ON CONFLICT (slug) DO NOTHING;

-- 13. INDEXES
CREATE INDEX IF NOT EXISTS idx_provider_profiles_category ON public.provider_profiles(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider ON public.provider_services(provider_id, is_active);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status, category_id);
CREATE INDEX IF NOT EXISTS idx_quotes_request ON public.quotes(request_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id, status, appointment_starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id, status);
