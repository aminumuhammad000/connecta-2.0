# Connecta 2.0 — Local Services Marketplace

Connecta is a trusted local services marketplace connecting customers with vetted service providers (plumbers, electricians, computer and phone repairers, carpenters, auto mechanics, and more) across Kano and Nigeria.

---

## Architecture Overview

- **Frontend & Web Platform:** Next.js 16 (App Router, Turbopack, React 19, TypeScript, Tailwind CSS v4)
- **Database:** Supabase PostgreSQL with PostGIS extensions
- **Authentication:** Clerk for session management and role-based access control (RBAC)
- **Media Management:** Cloudinary for verified evidence and image uploads
- **Transactional Email:** Resend
- **Realtime Infrastructure:** Supabase Realtime

---

## Key Features

1. **Brand Identity & Tokens:** Integrated official Connecta 02 brand identity (Azure `#1A73E8`, Green `#10B981`, Amber `#F59E0B`, Midnight `#111827`, Geist typography).
2. **PostgreSQL Relational Schema:** Complete schema in `supabase/schema.sql` supporting the 4-phase marketplace lifecycle.
3. **Finite State Machines:** Server-enforced state transitions for Bookings and Payments preventing invalid updates.
4. **Integer Minor Unit Currency:** All monetary amounts calculated in Kobo (`NGN minor_units`).
5. **Provider Verification & Onboarding:** Multi-step registration (`/provider/register`) and admin review interface (`/admin/verification`).
6. **Customer Discovery & Quotations:** Broadcast problem requests (`/requests/new`) and atomic quote acceptance (`/api/quotes/[id]/accept`).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase, Clerk, Cloudinary, and Resend credentials.

### 3. Database Migration
Apply the PostgreSQL migration to your Supabase project:
```bash
# In the Supabase SQL editor or via Supabase CLI
supabase db push
# or execute supabase/schema.sql directly
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Automated Tests
```bash
npm test
```

### 6. Production Build
```bash
npm run build
```

---

## Documentation Links
- [Database Architecture & User Journey](docs/DATABASE_ARCHITECTURE_AND_USER_JOURNEY.md)
- [Audit & Architecture Report](docs/AUDIT_AND_ARCHITECTURE_REPORT.md)
- [Brand Guidelines](brand/BRAND_GUIDELINES.md)
- [PostgreSQL Schema](supabase/schema.sql)
