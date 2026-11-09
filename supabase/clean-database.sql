-- =============================================================================
-- CONNECTA 2.0 — SUPABASE SQL EDITOR CLEANUP SCRIPT
-- =============================================================================
-- Purpose:
--   1. Deletes all transactions, payments, bookings, service requests, quotes, reviews, and logs.
--   2. Deletes all users and customer/provider profiles EXCEPT the admin (admin@connecta.ng).
--   3. Safely handles missing tables (checks table existence with to_regclass before truncating).
--   4. Cleans both Supabase 'auth.users' and 'public.profiles'.
--
-- How to run:
--   1. Go to your Supabase Project Dashboard: https://supabase.com/dashboard
--   2. Click "SQL Editor" in the left sidebar
--   3. Paste this entire script into the editor
--   4. Click "Run" (or Ctrl+Enter)
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Step 1: Truncate All Transactions, Bookings, Jobs, Reviews, Squads & Media
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    tbl TEXT;
    target_tables TEXT[] := ARRAY[
        -- Financial & Transactions
        'wallet_transactions',
        'payments',
        'disputes',
        -- Bookings, Quotes & Reviews
        'job_evidence',
        'booking_events',
        'reviews',
        'bookings',
        'quotes',
        -- Service Requests & Attachments
        'request_invitations',
        'request_attachments',
        'service_requests',
        -- Provider & Verification Data
        'verification_documents',
        'verification_cases',
        'provider_availability',
        'provider_service_areas',
        'provider_services',
        'provider_profiles',
        -- Customer Data
        'customer_addresses',
        'customer_profiles',
        -- Community & Squads
        'squad_members',
        'collabo_squads',
        'community_feed'
    ];
BEGIN
    FOREACH tbl IN ARRAY target_tables
    LOOP
        IF to_regclass('public.' || quote_ident(tbl)) IS NOT NULL THEN
            EXECUTE 'TRUNCATE TABLE public.' || quote_ident(tbl) || ' CASCADE';
            RAISE NOTICE 'Truncated: public.%', tbl;
        END IF;
    END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- Step 2: Delete All Non-Admin Wallets & Reset Admin Wallet
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('public.wallets') IS NOT NULL THEN
        -- Delete all non-admin wallets
        DELETE FROM public.wallets
        WHERE user_id NOT IN (
            SELECT id FROM public.profiles 
            WHERE LOWER(COALESCE(email, '')) = 'admin@connecta.ng' 
               OR 'admin'::TEXT = ANY(roles::TEXT[])
        );

        -- Reset admin wallet to clean initial state
        UPDATE public.wallets
        SET balance_minor = 0,
            escrow_balance_minor = 0,
            sparks_balance = 500,
            updated_at = NOW()
        WHERE user_id IN (
            SELECT id FROM public.profiles 
            WHERE LOWER(COALESCE(email, '')) = 'admin@connecta.ng' 
               OR 'admin'::TEXT = ANY(roles::TEXT[])
        );
        RAISE NOTICE 'Cleared non-admin wallets and reset admin wallet.';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Step 3: Delete All Profiles Except the Administrator
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('public.profiles') IS NOT NULL THEN
        DELETE FROM public.profiles
        WHERE LOWER(COALESCE(email, '')) <> 'admin@connecta.ng'
          AND NOT ('admin'::TEXT = ANY(roles::TEXT[]));
        RAISE NOTICE 'Deleted non-admin profiles from public.profiles.';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Step 4: Delete Non-Admin Users From Supabase Auth (auth.users)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('auth.users') IS NOT NULL THEN
        DELETE FROM auth.users
        WHERE LOWER(COALESCE(email, '')) <> 'admin@connecta.ng';
        RAISE NOTICE 'Deleted non-admin auth accounts from auth.users.';
    END IF;
END $$;

COMMIT;

-- -----------------------------------------------------------------------------
-- Step 5: Verification Summary
-- -----------------------------------------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM public.profiles) AS remaining_profiles,
    (SELECT email FROM public.profiles WHERE LOWER(email) = 'admin@connecta.ng' LIMIT 1) AS preserved_admin_email,
    (SELECT COUNT(*) FROM auth.users WHERE LOWER(email) = 'admin@connecta.ng') AS preserved_auth_admin,
    'All transactions, bookings, and non-admin users have been successfully deleted!' AS status;
