# Connecta 2.0 — Audit and Architecture Report

## 1. Executive Summary & Audit Baseline
- **Codebase:** Next.js 16 (App Router, Turbopack, React 19, TypeScript, Tailwind CSS v4)
- **Primary Database:** Supabase PostgreSQL with PostGIS support for proximity search.
- **Authentication:** Clerk for user identity, session management, and role-based access control (RBAC).
- **Media Storage:** Cloudinary for image transformations, portfolios, and job evidence.
- **Email Service:** Resend for transactional marketplace notifications.
- **Realtime Infrastructure:** Supabase Realtime for live booking status events and in-app messaging.

## 2. Security & Architectural Decisions
1. **Single Identity Rule:** A single `users` / `profiles` record maps to Clerk `user_id`. A user can act as both a customer and a provider without separate accounts.
2. **PostgreSQL Relational Normalization:** Strict foreign keys, composite unique constraints (`booking_id + reviewer_id + reviewee_id`), check constraints, and immutable snapshots for quotes and bookings.
3. **Financial Precision:** Currency stored as integer minor units (`kobo`) with explicit ISO currency (`NGN`).
4. **Finite State Machines:** Server-enforced state transitions for Bookings (`pending_confirmation` -> `confirmed` -> `provider_en_route` -> `in_progress` -> `completion_submitted` -> `completed` / `disputed` / `cancelled`) and Payments (`initiated` -> `pending` -> `succeeded` -> `refunded`).
5. **Private Data Isolation:** Private addresses and government verification documents are strictly isolated behind authorization checks and signed access URLs.
