-- Connecta 2.0 Complete Schema & Development Seed Script
-- Idempotent generation: tables, types, constraints, and realistic marketplace seed data

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE onboarding_status AS ENUM ('draft', 'submitted', 'approved', 'active');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE provider_type AS ENUM ('individual', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pricing_model AS ENUM ('fixed', 'hourly', 'inspection', 'starting_from', 'quote_required');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_urgency AS ENUM ('emergency', 'today', 'scheduled', 'flexible');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('draft', 'open', 'matching', 'quoted', 'booked', 'cancelled', 'expired', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'withdrawn', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    roles user_role[] DEFAULT ARRAY['customer'::user_role],
    account_status account_status DEFAULT 'active',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    description TEXT,
    icon_key TEXT,
    image_url TEXT,
    required_verification_types TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    provider_type provider_type DEFAULT 'individual',
    business_name TEXT,
    slug TEXT UNIQUE,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    primary_category_id UUID REFERENCES public.service_categories(id),
    verification_status verification_status DEFAULT 'verified',
    onboarding_status onboarding_status DEFAULT 'approved',
    experience_years INT DEFAULT 3,
    profile_photo_url TEXT,
    average_rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    response_rate INT DEFAULT 100,
    response_time_seconds INT DEFAULT 1800,
    city TEXT DEFAULT 'Kano',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.provider_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    pricing_model pricing_model DEFAULT 'quote_required',
    base_price_minor BIGINT DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    estimated_duration_minutes INT DEFAULT 60,
    service_mode TEXT DEFAULT 'onsite',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.provider_service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    city TEXT NOT NULL DEFAULT 'Kano',
    state TEXT NOT NULL DEFAULT 'Kano',
    country_code TEXT NOT NULL DEFAULT 'NG',
    radius_km NUMERIC(5, 2) DEFAULT 25.0,
    supported_neighborhoods TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency request_urgency DEFAULT 'today',
    service_mode TEXT DEFAULT 'onsite',
    preferred_date TIMESTAMPTZ,
    budget_min_minor BIGINT,
    budget_max_minor BIGINT,
    currency TEXT DEFAULT 'NGN',
    status request_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT NOT NULL UNIQUE,
    request_id UUID REFERENCES public.service_requests(id),
    quote_id UUID REFERENCES public.quotes(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id),
    service_snapshot JSONB NOT NULL,
    price_snapshot JSONB NOT NULL,
    appointment_starts_at TIMESTAMPTZ NOT NULL,
    appointment_ends_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Africa/Lagos',
    location_snapshot JSONB,
    status booking_status DEFAULT 'confirmed',
    cancellation_reason TEXT,
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

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_id, reviewee_id)
);

-- 4. SEED SERVICE CATEGORIES
INSERT INTO public.service_categories (id, name, slug, description, icon_key, image_url, sort_order) VALUES
('c1010000-0000-0000-0000-000000000001', 'Plumbing & Pipefitting', 'plumbing', 'Water leaks, pipe laying, borehole, bathroom and kitchen fittings', 'Wrench', '/images/services/cleaning_or_maintenance_technician.jpg', 1),
('c1010000-0000-0000-0000-000000000002', 'Electrical & Wiring', 'electrical', 'Fault finding, wiring, inverter/solar installation, breaker repairs', 'Zap', '/images/services/electrician_working_on_electrical_panel.jpg', 2),
('c1010000-0000-0000-0000-000000000003', 'Phone & Tablet Repair', 'phone-repair', 'Screen replacements, battery changes, charging ports, motherboard fixes', 'Smartphone', '/images/services/phone_repair_technician.jpg', 3),
('c1010000-0000-0000-0000-000000000004', 'Computer & Laptop Repair', 'computer-repair', 'Hardware upgrades, OS reinstallation, keyboard, screen & thermal fixes', 'Laptop', '/images/services/computer_repair_technician.jpg', 4),
('c1010000-0000-0000-0000-000000000005', 'Carpentry & Woodwork', 'carpentry', 'Custom furniture, door fittings, roof woodwork, lock fixing', 'Hammer', '/images/services/carpenter_working_in_nigeria.jpg', 5),
('c1010000-0000-0000-0000-000000000006', 'Auto Mechanics & Repair', 'auto-mechanic', 'Engine servicing, brake repair, suspensions, diagnostics & routine care', 'Car', '/images/services/car_mechanic_repairing_engine.jpg', 6),
('c1010000-0000-0000-0000-000000000007', 'Painting & Wall Finishing', 'painting', 'Interior & exterior painting, wallpaper, POP plastering, waterproofing', 'Paintbrush', '/images/services/house_painter_painting_wall.jpg', 7),
('c1010000-0000-0000-0000-000000000008', 'Air Conditioning & Cooling', 'ac-cooling', 'AC gas refill, compressor repair, cleaning, installation & freezer fixes', 'Wind', '/images/services/air_conditioner_repair_technician.jpg', 8)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description;

-- 5. SEED PROFILES (Kano Providers & Customer)
INSERT INTO public.profiles (id, full_name, email, phone, roles) VALUES
('u1010000-0000-0000-0000-000000000001', 'Ibrahim Aliyu', 'ibrahim.aliyu@connecta.ng', '+2348031234001', ARRAY['provider'::user_role]),
('u1010000-0000-0000-0000-000000000002', 'Garba Danbatta', 'garba.danbatta@connecta.ng', '+2348031234002', ARRAY['provider'::user_role]),
('u1010000-0000-0000-0000-000000000003', 'Musa Shehu', 'musa.shehu@connecta.ng', '+2348031234003', ARRAY['provider'::user_role]),
('u1010000-0000-0000-0000-000000000004', 'Kabiru Sani', 'kabiru.sani@connecta.ng', '+2348031234004', ARRAY['provider'::user_role]),
('u1010000-0000-0000-0000-000000000005', 'Amina Bello', 'amina.bello@example.com', '+2348031234005', ARRAY['customer'::user_role])
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PROVIDER PROFILES
INSERT INTO public.provider_profiles (id, user_id, business_name, slug, headline, bio, primary_category_id, verification_status, onboarding_status, experience_years, average_rating, review_count, completed_jobs_count, city) VALUES
('p1010000-0000-0000-0000-000000000001', 'u1010000-0000-0000-0000-000000000001', 'Arewa Solar & Inverter Engineering', 'arewa-solar-kano', 'Master Electrician, Solar/Inverter Sizing & Residential Wiring', 'Over 8 years solving electrical faults, sizing battery banks, and certified commercial/residential wiring across Kano State.', 'c1010000-0000-0000-0000-000000000002', 'verified', 'approved', 8, 4.95, 48, 72, 'Kano'),
('p1010000-0000-0000-0000-000000000002', 'u1010000-0000-0000-0000-000000000002', 'Danbatta Phone & Display Lab', 'danbatta-phone-lab', 'Precision Smartphone & Tablet Hardware Repair Technician', '10+ years specializing in iPhone, Samsung, Xiaomi screen restorations, charging IC replacements, and board micro-soldering.', 'c1010000-0000-0000-0000-000000000003', 'verified', 'approved', 10, 4.92, 64, 110, 'Kano'),
('p1010000-0000-0000-0000-000000000003', 'u1010000-0000-0000-0000-000000000003', 'Shehu Master Plumbing & Borehole', 'shehu-plumbing-kano', 'Borehole Systems, Pressure Booster Pumps & Leakage Fixes', 'Dedicated plumbing specialist with extensive experience in domestic water pipe laying, bathroom remodels, and emergency repairs.', 'c1010000-0000-0000-0000-000000000001', 'verified', 'approved', 7, 4.88, 39, 58, 'Kano'),
('p1010000-0000-0000-0000-000000000004', 'u1010000-0000-0000-0000-000000000004', 'Sani Modern Woodwork & Furniture', 'sani-woodwork-kano', 'Custom Furniture Maker, Door Installations & Roof Carpentry', 'Expert wood craftsman delivering durable modern cabinetry, door hanging, roof truss framing, and wardrobe construction.', 'c1010000-0000-0000-0000-000000000005', 'verified', 'approved', 12, 4.97, 52, 85, 'Kano')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED PROVIDER SERVICES
INSERT INTO public.provider_services (id, provider_id, category_id, title, description, pricing_model, base_price_minor, currency) VALUES
('s1010000-0000-0000-0000-000000000001', 'p1010000-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000002', 'Solar/Inverter System Health Check & Repair', 'Comprehensive testing of battery cells, charge controllers, inverter load capacity, and wiring integrity.', 'fixed', 1500000, 'NGN'),
('s1010000-0000-0000-0000-000000000002', 'p1010000-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000003', 'iPhone/Samsung Original Screen Replacement', 'High-grade OLED/LCD display replacement including TrueTone transfer and oleophobic coating.', 'starting_from', 2500000, 'NGN'),
('s1010000-0000-0000-0000-000000000003', 'p1010000-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000001', 'Borehole Submersible Pump Inspection & Replacement', 'Electrical and mechanical diagnostics of borehole pumps, check valves, and pipe lines.', 'inspection', 1000000, 'NGN'),
('s1010000-0000-0000-0000-000000000004', 'p1010000-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000005', 'Custom Solid Wood Door Construction & Hanging', 'Design, precision carpentry, lock fitting, and hung alignment for interior and exterior doors.', 'quote_required', 3500000, 'NGN')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED SERVICE AREAS
INSERT INTO public.provider_service_areas (provider_id, city, state, radius_km, supported_neighborhoods) VALUES
('p1010000-0000-0000-0000-000000000001', 'Kano', 'Kano', 30.0, ARRAY['Nassarawa GRA', 'Bompai', 'Fagge', 'Tarauni', 'Kano City']),
('p1010000-0000-0000-0000-000000000002', 'Kano', 'Kano', 20.0, ARRAY['Sabon Gari', 'Fagge', 'Kano City Center', 'Nassarawa']),
('p1010000-0000-0000-0000-000000000003', 'Kano', 'Kano', 25.0, ARRAY['Tarauni', 'Hotoro', 'Nassarawa', 'Gwale']),
('p1010000-0000-0000-0000-000000000004', 'Kano', 'Kano', 25.0, ARRAY['Bompai', 'Sabon Gari', 'Dala', 'Kano Municipal'])
ON CONFLICT DO NOTHING;

-- 9. SEED SAMPLE COMPLETED BOOKING & REVIEW
INSERT INTO public.bookings (
    id,
    booking_number,
    customer_id,
    provider_id,
    service_snapshot,
    price_snapshot,
    appointment_starts_at,
    status
) VALUES (
    'b1010000-0000-0000-0000-000000000001',
    'CN-782419',
    'u1010000-0000-0000-0000-000000000005',
    'p1010000-0000-0000-0000-000000000001',
    '{"title": "Solar Inverter Wiring & Health Check", "categoryName": "Electrical & Wiring"}'::jsonb,
    '{"subtotalMinor": 1500000, "feesMinor": 0, "totalMinor": 1500000, "currency": "NGN"}'::jsonb,
    NOW() - INTERVAL '3 days',
    'completed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reviews (
    booking_id,
    reviewer_id,
    reviewee_id,
    rating,
    comment,
    status
) VALUES (
    'b1010000-0000-0000-0000-000000000001',
    'u1010000-0000-0000-0000-000000000005',
    'u1010000-0000-0000-0000-000000000001',
    5,
    'Ibrahim arrived on time at our Nassarawa home, diagnosed the battery balancer fault immediately, and gave a clear explanation. Highly recommended for solar!',
    'published'
) ON CONFLICT DO NOTHING;
