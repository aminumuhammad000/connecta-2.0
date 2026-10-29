-- =============================================================================
-- CONNECTA 2.0 & OLD CONNECTA UNIFIED SUPABASE MASTER SCHEMA & SEED SCRIPT
-- =============================================================================
-- Version: 2.1.0
-- Description: Complete schema definitions, enums, tables, and realistic seed data
--              covering the entire onboarding workflow, client & provider dashboards,
--              milestone escrow wallets, Collabo Squads, and community feeds.
-- Idempotent: Can be run multiple times safely via Supabase SQL Editor.
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE onboarding_status AS ENUM ('draft', 'contact_info', 'role_selected', 'submitted', 'approved', 'active');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE provider_type AS ENUM ('individual', 'business', 'squad');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE pricing_model AS ENUM ('fixed', 'hourly', 'inspection', 'starting_from', 'quote_required');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE request_urgency AS ENUM ('emergency', 'today', 'scheduled', 'flexible');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('draft', 'open', 'matching', 'quoted', 'booked', 'cancelled', 'expired', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'withdrawn', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

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
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('deposit', 'escrow_hold', 'escrow_release', 'withdrawal', 'fee', 'refund');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'reversed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================================================
-- 3. CORE TABLES (DDL)
-- =============================================================================

-- 3.1 Profiles (Universal user record for Clients, Providers & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    roles user_role[] DEFAULT ARRAY['customer'::user_role],
    account_status account_status DEFAULT 'active',
    onboarding_status onboarding_status DEFAULT 'active',
    country TEXT DEFAULT 'Nigeria',
    country_code TEXT DEFAULT 'NG',
    currency TEXT DEFAULT 'NGN',
    city TEXT DEFAULT 'Lagos',
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Client / Customer Profiles (Onboarding metadata & company info)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT,
    company_bio TEXT,
    company_size TEXT DEFAULT '2 - 10 Employees',
    company_website TEXT,
    industry TEXT DEFAULT 'tech_startup',
    client_goal TEXT DEFAULT 'one_off_project',
    preferred_contact_method TEXT DEFAULT 'in_app' CHECK (preferred_contact_method IN ('in_app', 'phone', 'whatsapp')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Customer Addresses
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Office', 'Other')),
    address_text TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Lagos',
    state TEXT NOT NULL DEFAULT 'Lagos',
    country_code TEXT NOT NULL DEFAULT 'NG',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Service Categories
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    description TEXT,
    icon_key TEXT,
    image_url TEXT,
    sector TEXT DEFAULT 'trades',
    popular_skills TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Provider Profiles (Artisans, Specialists & Freelancers)
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    provider_type provider_type DEFAULT 'individual',
    business_name TEXT,
    slug TEXT UNIQUE,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    primary_category_id UUID REFERENCES public.service_categories(id),
    skills TEXT[] DEFAULT '{}',
    verification_status verification_status DEFAULT 'verified',
    onboarding_status onboarding_status DEFAULT 'approved',
    work_type TEXT DEFAULT 'freelancing',
    experience_years INT DEFAULT 3,
    hourly_rate_minor BIGINT DEFAULT 1500000, -- e.g. ₦15,000 in kobo
    nin_number TEXT,
    workshop_address TEXT,
    profile_photo_url TEXT,
    average_rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    response_rate INT DEFAULT 100,
    response_time_seconds INT DEFAULT 1800,
    city TEXT DEFAULT 'Lagos',
    state TEXT DEFAULT 'Lagos',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Provider Services (Catalog offerings)
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
    service_mode TEXT DEFAULT 'onsite' CHECK (service_mode IN ('onsite', 'remote', 'dropoff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Provider Service Areas
CREATE TABLE IF NOT EXISTS public.provider_service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    city TEXT NOT NULL DEFAULT 'Lagos',
    state TEXT NOT NULL DEFAULT 'Lagos',
    country_code TEXT NOT NULL DEFAULT 'NG',
    radius_km NUMERIC(5, 2) DEFAULT 25.0,
    supported_neighborhoods TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- 3.8 Service Requests (Jobs & Projects from Clients)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency request_urgency DEFAULT 'today',
    service_mode TEXT DEFAULT 'onsite' CHECK (service_mode IN ('onsite', 'remote', 'dropoff')),
    preferred_date TIMESTAMPTZ,
    budget_min_minor BIGINT,
    budget_max_minor BIGINT,
    currency TEXT DEFAULT 'NGN',
    status request_status DEFAULT 'open',
    city TEXT DEFAULT 'Lagos',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Quotes (Artisan Proposals)
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

-- 3.10 Bookings (Contracts with Milestone Escrow)
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

-- 3.11 Booking Events (Audit Trail)
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

-- 3.12 Reviews & Testimonials
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'under_review')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.13 Wallets (Escrow & Available Balances + Connecta Sparks)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance_minor BIGINT DEFAULT 0, -- Available funds in kobo
    escrow_balance_minor BIGINT DEFAULT 0, -- Locked in active milestones
    currency TEXT DEFAULT 'NGN',
    sparks_balance INT DEFAULT 50, -- AI Sparks from old Connecta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.14 Wallet Transactions (Ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id),
    type transaction_type NOT NULL,
    amount_minor BIGINT NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status transaction_status DEFAULT 'completed',
    description TEXT NOT NULL,
    reference TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.15 Collabo Squads (Multi-specialist Teams with Automated Splits)
CREATE TABLE IF NOT EXISTS public.collabo_squads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    lead_provider_id UUID NOT NULL REFERENCES public.provider_profiles(id),
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    avatar_url TEXT,
    split_formula JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_jobs_count INT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'forming', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.squad_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    squad_id UUID NOT NULL REFERENCES public.collabo_squads(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    split_percentage NUMERIC(5, 2) NOT NULL,
    is_lead BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(squad_id, provider_id)
);

-- 3.16 Community Feed (Social Activity Feed from Old Connecta)
CREATE TABLE IF NOT EXISTS public.community_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    actor_name TEXT NOT NULL,
    actor_avatar TEXT,
    actor_role TEXT,
    post_type TEXT DEFAULT 'general' CHECK (post_type IN ('general', 'job_completed', 'new_member', 'squad_formed', 'milestone_released')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    emoji TEXT DEFAULT '🚀',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. MASTER SEED FIXTURES
-- =============================================================================

-- 4.1 Service Categories (Matching Connecta 2.0 & verified Nigerian trades)
INSERT INTO public.service_categories (id, name, slug, description, icon_key, image_url, sector, popular_skills, sort_order) VALUES
('c1010000-0000-0000-0000-000000000001', 'Plumbing & Water Systems', 'plumbing', 'Emergency leak repair, borehole pump servicing, piping, water tanks, sanitary fittings', 'Wrench', '/images/services/nigerian_plumber_jonah.jpg?v=2', 'trades', ARRAY['Borehole Pumps', 'Pipe Leak Repair', 'Overhead Tanks', 'Pressure Valves', 'Copper Piping'], 1),
('c1010000-0000-0000-0000-000000000002', 'Solar & Electrical Power', 'electrical', 'Inverter battery installations, wiring, breaker boards, solar sizing, prepaid meters', 'Zap', '/images/services/nigerian_electrician_ibrahim.jpg?v=2', 'trades', ARRAY['Solar Inverters', 'Lithium Batteries', 'Distribution Boards', 'Earthing', 'Panel Rewiring'], 2),
('c1010000-0000-0000-0000-000000000003', 'Smart Devices & Diagnostics', 'phone-repair', 'Smartphone OLED screen restorations, motherboard micro-soldering, charging IC repair', 'Smartphone', '/images/services/nigerian_specialist_salamah.jpg?v=2', 'tech', ARRAY['iPhone Screen Repair', 'Logic Board Micro-soldering', 'Battery Health', 'TrueTone Transfer', 'Charging Ports'], 3),
('c1010000-0000-0000-0000-000000000004', 'Computers & Software Labs', 'computer-repair', 'Full-stack software dev, NVMe SSD upgrades, OS diagnostics, thermal paste & BIOS fixes', 'Laptop', '/images/services/computer_repair_technician.jpg', 'tech', ARRAY['React', 'Node.js', 'NVMe SSD', 'Data Recovery', 'Full Stack TypeScript'], 4),
('c1010000-0000-0000-0000-000000000005', 'Carpentry & Architectural Woodwork', 'carpentry', 'Custom office cabinetry, hardwood wardrobes, precision door framing, acoustical timber', 'Hammer', '/images/services/nigerian_carpenter_kabiru.jpg?v=2', 'trades', ARRAY['Custom Cabinetry', 'Hardwood Wardrobes', 'Door Frame Alignment', 'Timber Joinery', 'Roof Trusses'], 5),
('c1010000-0000-0000-0000-000000000006', 'Automotive & Diagnostics', 'auto-mechanic', 'Computerized vehicle OBD2 diagnostic scanning, ceramic brake service, suspension & engine overhauls', 'Car', '/images/services/car_mechanic_repairing_engine.jpg', 'trades', ARRAY['OBD2 Engine Scans', 'Ceramic Brake Pads', 'Suspension Bushings', 'Alternators', 'Transmission Check'], 6),
('c1010000-0000-0000-0000-000000000007', 'Painting & Wall Finishing', 'painting', 'Interior & exterior painting, decorative plastering, POP ceilings, waterproofing membrane', 'Paintbrush', '/images/services/house_painter_painting_wall.jpg', 'creative', ARRAY['POP Plastering', 'Interior Painting', 'Waterproofing', 'Wall Stucco', 'Epoxy Flooring'], 7),
('c1010000-0000-0000-0000-000000000008', 'AC & Climate Control', 'ac-cooling', 'Precision AC gas refill, inverter split unit installation, compressor overhaul, deep coil cleaning', 'Wind', '/images/services/air_conditioner_repair_technician.jpg', 'trades', ARRAY['Refrigerant Top-up', 'Compressor Overhaul', 'Split Unit Mounting', 'Deep Coil Cleaning', 'Inverter Chiller'], 8)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description;

-- 4.2 User Profiles (Clients & Providers)
INSERT INTO public.profiles (id, full_name, first_name, last_name, email, phone, whatsapp, roles, city, country, avatar_url) VALUES
-- Platform Administrator
('a1010000-0000-0000-0000-000000000000', 'Malam Aminu Danbatta', 'Malam Aminu', 'Danbatta', 'admin@connecta.ng', '+2348030000001', '+2348030000001', ARRAY['admin'::user_role], 'Kano', 'Nigeria', '/brand/svg/connecta-icon.svg'),
-- Verified Providers
('a1010000-0000-0000-0000-000000000001', 'Ibrahim Aliyu', 'Ibrahim', 'Aliyu', 'ibrahim.aliyu@connecta.ng', '+2348031234001', '+2348031234001', ARRAY['provider'::user_role], 'Kano', 'Nigeria', '/images/services/nigerian_electrician_ibrahim.jpg?v=2'),
('a1010000-0000-0000-0000-000000000002', 'Jonah Blessing', 'Jonah', 'Blessing', 'jonah.blessing@connecta.ng', '+2348031234002', '+2348031234002', ARRAY['provider'::user_role], 'Port Harcourt', 'Nigeria', '/images/services/nigerian_plumber_jonah.jpg?v=2'),
('a1010000-0000-0000-0000-000000000003', 'Kabiru Sani', 'Kabiru', 'Sani', 'kabiru.sani@connecta.ng', '+2348031234003', '+2348031234003', ARRAY['provider'::user_role], 'Abuja', 'Nigeria', '/images/services/nigerian_carpenter_kabiru.jpg?v=2'),
('a1010000-0000-0000-0000-000000000004', 'Salamah Othman', 'Salamah', 'Othman', 'salamah.othman@connecta.ng', '+2348031234004', '+2348031234004', ARRAY['provider'::user_role], 'Lagos', 'Nigeria', '/images/services/nigerian_specialist_salamah.jpg?v=2'),
('a1010000-0000-0000-0000-000000000005', 'David Okafor', 'David', 'Okafor', 'david.okafor@connecta.ng', '+2348031234005', '+2348031234005', ARRAY['provider'::user_role], 'Lagos', 'Nigeria', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('a1010000-0000-0000-0000-000000000006', 'Elena Rodriguez', 'Elena', 'Rodriguez', 'elena.design@connecta.ng', '+2348031234006', '+2348031234006', ARRAY['provider'::user_role], 'Lagos', 'Nigeria', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),

-- Verified Clients (Customers)
('a1010000-0000-0000-0000-000000000010', 'Tunde Bakare', 'Tunde', 'Bakare', 'tunde@payflow.ng', '+2348039876001', '+2348039876001', ARRAY['customer'::user_role], 'Lagos', 'Nigeria', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
('a1010000-0000-0000-0000-000000000011', 'Amaka Okonkwo', 'Amaka', 'Okonkwo', 'amaka@techpulse.ng', '+2348039876002', '+2348039876002', ARRAY['customer'::user_role], 'Abuja', 'Nigeria', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'),
('a1010000-0000-0000-0000-000000000012', 'Amina Bello', 'Amina', 'Bello', 'amina.bello@example.com', '+2348039876003', '+2348039876003', ARRAY['customer'::user_role], 'Kano', 'Nigeria', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;

-- 4.3 Customer Profiles (Client Onboarding Metadata)
INSERT INTO public.customer_profiles (user_id, company_name, company_bio, company_size, company_website, industry, client_goal) VALUES
('a1010000-0000-0000-0000-000000000010', 'PayFlow Financial Technologies', 'Fast growing Nigerian fintech company modernizing cross-border B2B payments and automated escrow.', '11 - 50 Employees', 'https://payflow.ng', 'tech_startup', 'dedicated_freelancer'),
('a1010000-0000-0000-0000-000000000011', 'TechPulse Africa Media & Labs', 'African tech publication and venture studio building digital tools for creative entrepreneurs.', '2 - 10 Employees', 'https://techpulse.ng', 'agency_consulting', 'collabo_team'),
('a1010000-0000-0000-0000-000000000012', 'Bello Heritage Properties', 'Residential property management firm managing luxury gated estates and commercial real estate.', 'Solo Entrepreneur / Founder', 'https://bello-properties.ng', 'facilities_trades', 'one_off_project')
ON CONFLICT (user_id) DO NOTHING;

-- 4.4 Customer Addresses
INSERT INTO public.customer_addresses (user_id, label, address_text, city, state, country_code, is_default) VALUES
('a1010000-0000-0000-0000-000000000010', 'Office', 'Plot 14 Admiralty Way, Lekki Phase 1', 'Lagos', 'Lagos', 'NG', true),
('a1010000-0000-0000-0000-000000000011', 'Office', '45 Gana Street, Maitama', 'Abuja', 'FCT', 'NG', true),
('a1010000-0000-0000-0000-000000000012', 'Home', '12 Bompai Road, Nassarawa GRA', 'Kano', 'Kano', 'NG', true)
ON CONFLICT DO NOTHING;

-- 4.5 Provider Profiles (Artisans & Digital Pros)
INSERT INTO public.provider_profiles (id, user_id, business_name, slug, headline, bio, primary_category_id, skills, verification_status, onboarding_status, experience_years, hourly_rate_minor, nin_number, workshop_address, profile_photo_url, average_rating, review_count, completed_jobs_count, city, state) VALUES
('b2010000-0000-0000-0000-000000000001', 'a1010000-0000-0000-0000-000000000001', 'Aliyu Power & Solar Systems', 'ibrahim-aliyu-solar', 'Master Electrician & Certified Solar Installation Lead', 'Over 8 years sizing residential lithium battery banks, hybrid inverter setups, industrial breaker boards, and earthing protection across Kano and Lagos.', 'c1010000-0000-0000-0000-000000000002', ARRAY['Solar Inverters', 'Lithium Batteries', 'Distribution Boards', 'Safety Earthing', 'Prepaid Meters'], 'verified', 'approved', 8, 2500000, 'NIN-8932478190', 'Shop 14, Mubi Electrical Market, Kano', '/images/services/nigerian_electrician_ibrahim.jpg?v=2', 4.99, 74, 118, 'Kano', 'Kano'),
('b2010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000002', 'Apex Fluidics & Plumbing Works', 'jonah-blessing-plumbing', 'Certified Plumber & Domestic Water Systems Lead', 'Specialized in high-pressure water booster pumps, borehole pulling, copper pipe manifold retrofits, leak detection, and sanitary plumbing across Lagos & Port Harcourt.', 'c1010000-0000-0000-0000-000000000001', ARRAY['Borehole Pumps', 'Pressure Control Valves', 'Pipe Leak Detection', 'Overhead Tanks', 'Clean Piping'], 'verified', 'approved', 7, 2000000, 'NIN-4591823701', 'Block B, Trans-Amadi Industrial Layout, Port Harcourt', '/images/services/nigerian_plumber_jonah.jpg?v=2', 4.95, 64, 92, 'Port Harcourt', 'Rivers'),
('b2010000-0000-0000-0000-000000000003', 'a1010000-0000-0000-0000-000000000003', 'Heritage Woodwork & Precision Joinery', 'kabiru-sani-carpentry', 'Master Carpenter & Architectural Furniture Maker', '10+ years handcrafting bespoke hardwood boardroom desks, walk-in solid timber wardrobes, acoustic wall cladding, and precision hung exterior doors.', 'c1010000-0000-0000-0000-000000000005', ARRAY['Custom Cabinetry', 'Hardwood Wardrobes', 'Door Frame Fitting', 'Roof Trusses', 'Cabinet Joinery'], 'verified', 'approved', 10, 3000000, 'NIN-7712398412', 'Timber Village, Idu Industrial Zone, Abuja', '/images/services/nigerian_carpenter_kabiru.jpg?v=2', 4.98, 82, 140, 'Abuja', 'FCT'),
('b2010000-0000-0000-0000-000000000004', 'a1010000-0000-0000-0000-000000000004', 'MicroTech Hardware Diagnostics', 'salamah-othman-tech', 'Device Diagnostics & Electronics Micro-Soldering Specialist', 'Specializing in Apple, Samsung and high-end hardware logic board trace repair, display calibrations, IC chip replacements, and thermal diagnostics.', 'c1010000-0000-0000-0000-000000000003', ARRAY['iPhone Diagnostics', 'Logic Board Micro-soldering', 'TrueTone Transfer', 'Battery Health 100%', 'Charging IC'], 'verified', 'approved', 6, 1800000, 'NIN-6120938456', 'Computer Village, Ikeja, Lagos', '/images/services/nigerian_specialist_salamah.jpg?v=2', 4.96, 58, 88, 'Lagos', 'Lagos'),
('b2010000-0000-0000-0000-000000000005', 'a1010000-0000-0000-0000-000000000005', 'Okafor Cloud Labs', 'david-okafor-dev', 'Senior Full-Stack & Cloud Architecture Lead', 'Expert in React, Next.js, Node.js, and Postgres cloud solutions. Experience building high-scale fintech backends and escrow platforms across Africa.', 'c1010000-0000-0000-0000-000000000004', ARRAY['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'], 'verified', 'approved', 7, 4500000, 'NIN-3910294851', 'Yaba Tech Hub, Herbert Macaulay Way, Lagos', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 4.97, 42, 65, 'Lagos', 'Lagos'),
('b2010000-0000-0000-0000-000000000006', 'a1010000-0000-0000-0000-000000000006', 'Studio Elena Design', 'elena-rodriguez-design', 'Principal Product & Mobile UI/UX Designer', 'Creating intuitive, award-winning mobile banking experiences, design systems, interactive prototypes in Figma, and design-to-code pipelines.', 'c1010000-0000-0000-0000-000000000004', ARRAY['Figma', 'UI/UX Design', 'Design Systems', 'Mobile Prototyping', 'User Research'], 'verified', 'approved', 6, 3500000, 'NIN-9081237465', 'Victoria Island, Lagos', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 4.95, 38, 54, 'Lagos', 'Lagos')
ON CONFLICT (id) DO UPDATE SET
    headline = EXCLUDED.headline,
    profile_photo_url = EXCLUDED.profile_photo_url;

-- 4.6 Provider Catalog Services
INSERT INTO public.provider_services (id, provider_id, category_id, title, description, pricing_model, base_price_minor, currency) VALUES
('a4010000-0000-0000-0000-000000000001', 'b2010000-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000002', 'Residential Solar & Inverter System Installation', 'Full installation, sizing calculations, lithium battery integration, and circuit breaker distribution board wiring.', 'fixed', 35000000, 'NGN'),
('a4010000-0000-0000-0000-000000000002', 'b2010000-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000001', 'Borehole Submersible Pump Overhaul & Manifold Setup', 'Complete borehole pump extraction, safety inspection, check valve replacement, and overhead tank piping alignment.', 'quote_required', 15000000, 'NGN'),
('a4010000-0000-0000-0000-000000000003', 'b2010000-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000005', 'Custom Solid Wood Executive Boardroom Desk', 'Custom sized boardroom or executive table in solid mahogany, complete with discreet cable management channels.', 'quote_required', 45000000, 'NGN'),
('a4010000-0000-0000-0000-000000000004', 'b2010000-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000003', 'iPhone/Samsung Screen Restoration & Micro-Soldering', 'Original high-refresh OLED display replacement with TrueTone transfer and board diagnostic report.', 'starting_from', 3500000, 'NGN'),
('a4010000-0000-0000-0000-000000000005', 'b2010000-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000004', 'Full Stack Fintech Dashboard & Escrow Integration', 'End-to-end development of customer portal, milestone escrow integration with Paystack/Flutterwave, and admin tools.', 'hourly', 2500000, 'NGN')
ON CONFLICT (id) DO NOTHING;

-- 4.7 Provider Service Areas
INSERT INTO public.provider_service_areas (provider_id, city, state, radius_km, supported_neighborhoods) VALUES
('b2010000-0000-0000-0000-000000000001', 'Kano', 'Kano', 35.0, ARRAY['Nassarawa GRA', 'Bompai', 'Sabon Gari', 'Tarauni', 'Fagge', 'Kano City Center']),
('b2010000-0000-0000-0000-000000000002', 'Port Harcourt', 'Rivers', 30.0, ARRAY['Old GRA', 'Trans-Amadi', 'Peter Odili', 'D-Line', 'Rumuogba']),
('b2010000-0000-0000-0000-000000000003', 'Abuja', 'FCT', 40.0, ARRAY['Maitama', 'Asokoro', 'Wuse 2', 'Jabi', 'Gwarinpa', 'Idu']),
('b2010000-0000-0000-0000-000000000004', 'Lagos', 'Lagos', 30.0, ARRAY['Ikeja', 'Victoria Island', 'Lekki Phase 1', 'Ikoyi', 'Surulere']),
('b2010000-0000-0000-0000-000000000005', 'Lagos', 'Lagos', 50.0, ARRAY['Yaba', 'Lekki', 'Victoria Island', 'Ikeja', 'Maryland'])
ON CONFLICT DO NOTHING;

-- 4.8 Service Requests (Live Job Postings & Project Briefs)
INSERT INTO public.service_requests (id, customer_id, category_id, title, description, urgency, budget_min_minor, budget_max_minor, status, city) VALUES
('d1010000-0000-0000-0000-000000000001', 'a1010000-0000-0000-0000-000000000010', 'c1010000-0000-0000-0000-000000000002', '15kVA Solar Inverter & Lithium Battery Retrofit for Office', 'We need a certified solar engineer to inspect our current diesel generator backup and replace it with a clean 15kVA hybrid solar system with 20kWh lithium batteries for our Lekki office.', 'today', 35000000, 50000000, 'booked', 'Lagos'),
('d1010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000011', 'c1010000-0000-0000-0000-000000000004', 'Cross-Platform React & Node.js B2B Marketplace Portal', 'Looking for an experienced Full-Stack Engineer to collaborate with our design team. Must be proficient in Next.js, Postgres, and escrow milestone release mechanisms.', 'scheduled', 40000000, 75000000, 'open', 'Abuja'),
('d1010000-0000-0000-0000-000000000003', 'a1010000-0000-0000-0000-000000000012', 'c1010000-0000-0000-0000-000000000001', 'Emergency Borehole Pump Extraction & Overhead Tank Leak', 'Submersible borehole pump stopped pumping to the 5,000L overhead tanks. Pressure booster valve leaking in Nassarawa GRA residential compound. Need same day artisan.', 'emergency', 15000000, 25000000, 'open', 'Kano')
ON CONFLICT (id) DO NOTHING;

-- 4.9 Quotes (Artisan Proposals)
INSERT INTO public.quotes (id, request_id, provider_id, customer_id, line_items, labor_minor, materials_minor, total_minor, notes, estimated_duration_minutes, valid_until, status) VALUES
('e1010000-0000-0000-0000-000000000001', 'd1010000-0000-0000-0000-000000000001', 'b2010000-0000-0000-0000-000000000001', 'a1010000-0000-0000-0000-000000000010', '[{"item": "15kVA Solar Hybrid Inverter Commissioning", "costMinor": 15000000}, {"item": "4x 5kWh Lithium Iron Phosphate Battery Bank", "costMinor": 25000000}, {"item": "DC Breaker Panel & Surge Suppressor", "costMinor": 3500000}, {"item": "Installation & Certified Safety Earthing", "costMinor": 4500000}]'::jsonb, 4500000, 43500000, 48000000, 'Includes 2-year warranty on lithium cells, full circuit breaker testing, and load balancing across all 3 phases.', 480, NOW() + INTERVAL '14 days', 'accepted')
ON CONFLICT (id) DO NOTHING;

-- 4.10 Bookings (Contracts with Milestone Escrow)
INSERT INTO public.bookings (id, booking_number, request_id, quote_id, customer_id, provider_id, service_snapshot, price_snapshot, appointment_starts_at, status) VALUES
('b1010000-0000-0000-0000-000000000001', 'CN-782419', 'd1010000-0000-0000-0000-000000000001', 'e1010000-0000-0000-0000-000000000001', 'a1010000-0000-0000-0000-000000000010', 'b2010000-0000-0000-0000-000000000001', '{"title": "15kVA Hybrid Solar Inverter System & Battery Bank Installation", "category": "Solar & Electrical Power"}'::jsonb, '{"subtotalMinor": 48000000, "escrowFeeMinor": 0, "totalMinor": 48000000, "currency": "NGN"}'::jsonb, NOW() - INTERVAL '2 days', 'in_progress'),
('b1010000-0000-0000-0000-000000000002', 'CN-319084', NULL, NULL, 'a1010000-0000-0000-0000-000000000012', 'b2010000-0000-0000-0000-000000000002', '{"title": "Commercial Building Pressure Booster Pump & Pipe Overhaul", "category": "Plumbing & Water Systems"}'::jsonb, '{"subtotalMinor": 18500000, "escrowFeeMinor": 0, "totalMinor": 18500000, "currency": "NGN"}'::jsonb, NOW() - INTERVAL '10 days', 'completed')
ON CONFLICT (id) DO NOTHING;

-- 4.11 Reviews (Two-way authentic verified reviews)
INSERT INTO public.reviews (id, booking_id, reviewer_id, reviewee_id, rating, comment, status) VALUES
('f1010000-0000-0000-0000-000000000001', 'b1010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000012', 'a1010000-0000-0000-0000-000000000002', 5, 'Jonah and his plumbing team pulled the failed pump, replaced the manifold, and restored pressurized water to our 8 residential apartments before 4 PM. Very neat workmanship.', 'published'),
('f1010000-0000-0000-0000-000000000002', 'b1010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000012', 5, 'Amina was an exceptional client. Clear job requirements, on-site access was ready immediately, and milestone payment was approved the second pressure testing concluded.', 'published')
ON CONFLICT (id) DO NOTHING;

-- 4.12 Wallets (Customer & Provider Escrow Balances + AI Sparks)
INSERT INTO public.wallets (id, user_id, balance_minor, escrow_balance_minor, currency, sparks_balance) VALUES
('a3010000-0000-0000-0000-000000000001', 'a1010000-0000-0000-0000-000000000001', 34500000, 48000000, 'NGN', 85),
('a3010000-0000-0000-0000-000000000002', 'a1010000-0000-0000-0000-000000000002', 28500000, 0, 'NGN', 60),
('a3010000-0000-0000-0000-000000000003', 'a1010000-0000-0000-0000-000000000003', 42000000, 0, 'NGN', 75),
('a3010000-0000-0000-0000-000000000004', 'a1010000-0000-0000-0000-000000000004', 19000000, 0, 'NGN', 50),
('a3010000-0000-0000-0000-000000000010', 'a1010000-0000-0000-0000-000000000010', 125000000, 48000000, 'NGN', 100)
ON CONFLICT (user_id) DO UPDATE SET
    balance_minor = EXCLUDED.balance_minor,
    escrow_balance_minor = EXCLUDED.escrow_balance_minor;

-- 4.13 Wallet Ledger Transactions
INSERT INTO public.wallet_transactions (wallet_id, booking_id, type, amount_minor, currency, status, description, reference) VALUES
('a3010000-0000-0000-0000-000000000010', 'b1010000-0000-0000-0000-000000000001', 'escrow_hold', 48000000, 'NGN', 'completed', 'Escrow Locked: 15kVA Solar Inverter System (Booking #CN-782419)', 'TX-ESC-782419'),
('a3010000-0000-0000-0000-000000000002', 'b1010000-0000-0000-0000-000000000002', 'escrow_release', 18500000, 'NGN', 'completed', 'Milestone Released: Commercial Water Pump Overhaul (Booking #CN-319084)', 'TX-REL-319084'),
('a3010000-0000-0000-0000-000000000002', NULL, 'withdrawal', 10000000, 'NGN', 'completed', 'Bank Payout to Zenith Bank Account ****8821', 'TX-WTH-994812')
ON CONFLICT (reference) DO NOTHING;

-- 4.14 Collabo Squads (Connecting Cross-Functional Specialists with Automated Splits)
INSERT INTO public.collabo_squads (id, name, slug, lead_provider_id, headline, description, avatar_url, split_formula, rating, completed_jobs_count) VALUES
('c2010000-0000-0000-0000-000000000001', 'Apex Smart Home & Solar Squad', 'apex-smart-home-squad', 'b2010000-0000-0000-0000-000000000001', 'Integrated Solar Engineering, Fluidics & Smart IoT Automation', 'Combined trade powerhouse linking certified solar engineers with high-capacity plumbers and smart home wiring specialists.', '/images/services/nigerian_electrician_ibrahim.jpg?v=2', '[{"role": "Solar Lead", "percent": 45}, {"role": "Plumbing & Pumps", "percent": 35}, {"role": "Automation Tech", "percent": 20}]'::jsonb, 4.98, 34),
('c2010000-0000-0000-0000-000000000002', 'Pulse Mobile & Cloud Studio', 'pulse-mobile-cloud-studio', 'b2010000-0000-0000-0000-000000000005', 'High-Impact Product Design & Full-Stack Cloud Engineering', 'Cross-functional software squad combining award-winning Figma mobile designers with veteran Node/Postgres backend architects.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '[{"role": "Full-Stack Cloud Lead", "percent": 55}, {"role": "Principal UI/UX Designer", "percent": 45}]'::jsonb, 4.96, 28)
ON CONFLICT (id) DO NOTHING;

-- 4.15 Squad Members
INSERT INTO public.squad_members (squad_id, provider_id, role_title, split_percentage, is_lead) VALUES
('c2010000-0000-0000-0000-000000000001', 'b2010000-0000-0000-0000-000000000001', 'Solar & Inverter Lead', 45.0, true),
('c2010000-0000-0000-0000-000000000001', 'b2010000-0000-0000-0000-000000000002', 'Plumbing & Fluidics Lead', 35.0, false),
('c2010000-0000-0000-0000-000000000001', 'b2010000-0000-0000-0000-000000000004', 'IoT Hardware & Diagnostic Tech', 20.0, false),
('c2010000-0000-0000-0000-000000000002', 'b2010000-0000-0000-0000-000000000005', 'Cloud Backend Architect', 55.0, true),
('c2010000-0000-0000-0000-000000000002', 'b2010000-0000-0000-0000-000000000006', 'Lead Product Designer', 45.0, false)
ON CONFLICT (squad_id, provider_id) DO NOTHING;

-- 4.16 Community Feed (Social Updates from Old Connecta)
INSERT INTO public.community_feed (actor_id, actor_name, actor_avatar, actor_role, post_type, title, body, emoji, likes_count) VALUES
('a1010000-0000-0000-0000-000000000001', 'Ibrahim Aliyu', '/images/services/nigerian_electrician_ibrahim.jpg?v=2', 'Master Electrician', 'milestone_released', '30kVA Solar Hybrid Commercial Milestone Approved!', 'Successfully energized a 30kVA dual-inverter system with 40kWh lithium batteries for an agricultural facility in Kano. Milestone escrow payment approved!', '⚡', 24),
('a1010000-0000-0000-0000-000000000010', 'Tunde Bakare', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Founder at PayFlow', 'job_completed', 'Outstanding Work by Connecta Tradespeople', 'Funded our 15kVA office solar brief via milestone escrow. Ibrahim was matched in under a minute and started the site audit next morning. 10/10 experience.', '🤝', 18),
('a1010000-0000-0000-0000-000000000005', 'David Okafor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Cloud Architect', 'squad_formed', 'Pulse Mobile & Cloud Studio is Live on Connecta', 'Formed a new Collabo Squad with Elena Rodriguez to provide end-to-end design and high-scale engineering for African tech companies.', '🚀', 31)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 5. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_category ON public.provider_profiles(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider ON public.provider_services(provider_id, is_active);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status, category_id);
CREATE INDEX IF NOT EXISTS idx_quotes_request ON public.quotes(request_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id, status, appointment_starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id, created_at);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_collabo_squads_slug ON public.collabo_squads(slug);

-- =============================================================================
-- End of Connecta 2.0 Unified Master Seed
-- =============================================================================
