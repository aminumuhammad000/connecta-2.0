-- =============================================================================
-- Connecta 2.0 Live Data Migration to Supabase PostgreSQL
-- Exported on: 2026-11-02T13:50:13.230Z
-- Total Profiles: 25 | Bookings: 17 | Requests: 17
-- =============================================================================

-- 1. INSERT PROFILES
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Engr. Rabiu Haruna', '2348039876541@myconnecta.ng', '+2348039876541', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-01-10T08:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Malam Usman Bello', '2348021112233@myconnecta.ng', '+2348021112233', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-02-05T09:30:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Malam Kabir Danladi', '2348065554433@myconnecta.ng', '+2348065554433', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-01-12T11:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Sani Shehu', '2348107778899@myconnecta.ng', '+2348107778899', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-02-14T10:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Aisha Bello Suleiman', '2348098761234@myconnecta.ng', '+2348098761234', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-02-18T14:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Mustapha Tukur', '2348134445566@myconnecta.ng', '+2348134445566', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-03-02T13:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Engr. Salisu Aliyu', '2348053332211@myconnecta.ng', '+2348053332211', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-01-25T08:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Abubakar Garba', '2348182223344@myconnecta.ng', '+2348182223344', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-02-11T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Engr. Mustapha Balarabe', '2348029876543@myconnecta.ng', '+2348029876543', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-02-10T10:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Ibrahim Jibril', '2348036667788@myconnecta.ng', '+2348036667788', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2025-03-05T09:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Aliyu Test Team', '2348100015498@myconnecta.ng', '+2348100015498', ARRAY['customer'::user_role], 'active'::account_status, 'en', '2026-10-28T13:28:49.592Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Hassan Dankura', '2349020222290@myconnecta.ng', '+2349020222290', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2026-10-28T13:58:50.836Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Musa Danladi (Carpenter)', '2348011112222@myconnecta.ng', '+2348011112222', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:40:24.785Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Fatima Garba', '2349033334444@myconnecta.ng', '+2349033334444', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:40:24.999Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Aliyu Welder', '2347099990001@myconnecta.ng', '+2347099990001', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:41:08.926Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Kabiru Electrician', '2347088880002@myconnecta.ng', '+2347088880002', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:42:07.053Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Malam Shehu Electrician', '2347077770003@myconnecta.ng', '+2347077770003', ARRAY['provider'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:45:12.098Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Hajiya Maryam', '2347066660004@myconnecta.ng', '+2347066660004', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-10-30T14:45:14.692Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'HD', '2348065104741@myconnecta.ng', '+2348065104741', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-11-02T09:43:57.281Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Usman Umar', '2349138826727@myconnecta.ng', '+2349138826727', ARRAY['customer'::user_role], 'active'::account_status, 'en', '2026-11-02T10:10:54.698Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'صابر عمر', '2348129394837@myconnecta.ng', '+2348129394837', ARRAY['provider'::user_role], 'active'::account_status, 'en', '2026-11-02T10:14:44.388Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Usman Aminu Multi Trade Venture', '2348108509691@myconnecta.ng', '+2348108509691', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-11-02T10:18:45.712Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'B!LAL', '2349120727749@myconnecta.ng', '+2349120727749', ARRAY['provider'::user_role], 'active'::account_status, 'en', '2026-11-02T11:17:11.749Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'Sir Hafeez Makama👨🏽‍💻', '2347068021019@myconnecta.ng', '+2347068021019', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-11-02T11:17:24.777Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles (id, full_name, email, phone, roles, account_status, preferred_language, created_at)
VALUES (gen_random_uuid(), 'WhatsApp Customer', '2348149449090@myconnecta.ng', '+2348149449090', ARRAY['customer'::user_role], 'active'::account_status, 'ha', '2026-11-02T11:21:15.982Z')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT PROVIDER PROFILES (TIER 1, 2, 3)
-- Provider: Engr. Rabiu Haruna (+2348039876541)
-- Provider: Malam Usman Bello (+2348021112233)
-- Provider: Malam Kabir Danladi (+2348065554433)
-- Provider: Sani Shehu (+2348107778899)
-- Provider: Aisha Bello Suleiman (+2348098761234)
-- Provider: Mustapha Tukur (+2348134445566)
-- Provider: Engr. Salisu Aliyu (+2348053332211)
-- Provider: Abubakar Garba (+2348182223344)
-- Provider: Engr. Mustapha Balarabe (+2348029876543)
-- Provider: Ibrahim Jibril (+2348036667788)
-- Provider: Hassan Dankura (+2349020222290)
-- Provider: Musa Danladi (Carpenter) (+2348011112222)
-- Provider: Malam Shehu Electrician (+2347077770003)
-- Provider: صابر عمر (+2348129394837)
-- Provider: B!LAL (+2349120727749)

-- 3. INSERT LIVE BOOKINGS & ESCROW
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-5985', 'Solar da Inverter Diagnostic & Repair', 'Solar da Inverter', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-11-02T10:23:37.256Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-8376', 'Solar & Inverter Diagnostic & Repair', 'Solar & Inverter', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-11-02T10:12:31.732Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-6094', 'AC da Firiji Diagnostic & Repair', 'AC da Firiji', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-30T12:33:33.765Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-5790', 'salaam Diagnostic & Repair', 'salaam', 'Dala (Gwammaja), Kano', 500000, 'locked', 'pending', '2026-10-30T10:50:49.686Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-4678', 'Solar da Inverter Diagnostic & Repair', 'Solar da Inverter', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-29T12:57:10.828Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-8934', 'Famfo da Ruwa Diagnostic & Repair', 'Famfo da Ruwa', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-29T10:56:26.482Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-8926', 'Famfo da Ruwa Diagnostic & Repair', 'Famfo da Ruwa', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-29T10:53:54.996Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-1289', 'Famfo da Ruwa Diagnostic & Repair', 'Famfo da Ruwa', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-29T10:52:43.235Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-6224', 'Famfo da Ruwa Diagnostic & Repair', 'Famfo da Ruwa', 'Tarauni (Gyadi-Gyadi), Kano', 500000, 'locked', 'pending', '2026-10-29T09:51:42.650Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-9846', '🇳🇬 Hausa Diagnostic & Repair', '🇳🇬 Hausa', 'Tarauni, Kano', 500000, 'locked', 'pending', '2026-10-28T18:56:27.920Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-4143', '⚡ Gyaran Generator Diagnostic & Repair', '⚡ Gyaran Generator', 'famfo na ya tsaya, Kano', 500000, 'locked', 'pending', '2026-10-28T18:38:04.795Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-7774', '❄️ AC & Cooling Diagnostic & Repair', '❄️ AC & Cooling', 'Tarauni, Kano', 500000, 'released', 'completed', '2026-10-28T14:13:27.469Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-5979', '⚡ Generator Repair Diagnostic & Repair', '⚡ Generator Repair', 'Fagge (Sabon Gari / Fagge), Kano', 500000, 'released', 'completed', '2026-10-28T13:54:40.698Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-6808', '☀️ Solar & Inverter Diagnostic & Repair', '☀️ Solar & Inverter', 'Nassarawa (GRA / Bompai), Kano', 500000, 'locked', 'completion_submitted', '2026-10-28T13:51:39.400Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-5257', '☀️ Solar & Inverter Diagnostic & Repair', '☀️ Solar & Inverter', 'Nassarawa (GRA / Bompai), Kano', 500000, 'locked', 'provider_en_route', '2026-10-28T13:50:06.209Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-1441', '☀️ Solar & Inverter Diagnostic & Repair', '☀️ Solar & Inverter', 'Nassarawa (GRA / Bompai), Kano', 500000, 'locked', 'pending', '2026-10-28T13:28:54.141Z')
ON CONFLICT (booking_number) DO NOTHING;
INSERT INTO public.bookings (id, booking_number, title, category, location, total_amount_minor, escrow_status, booking_status, created_at)
VALUES (gen_random_uuid(), 'CN-KN-9531', 'Solar & Inverter Diagnostic & Repair', 'Solar & Inverter', 'Nassarawa (GRA / Bompai), Kano', 500000, 'locked', 'pending', '2026-10-28T13:27:13.291Z')
ON CONFLICT (booking_number) DO NOTHING;
