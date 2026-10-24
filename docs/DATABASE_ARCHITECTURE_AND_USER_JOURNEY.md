# Connecta 2.0 — Complete Database Architecture and User Journey

Connecta is designed as a trusted local services marketplace, connecting customers with skilled service providers such as plumbers, electricians, computer technicians, phone repairers, carpenters, mechanics, and other professionals.

The database supports the entire business journey, from a customer discovering a nearby technician to booking a service, agreeing on a price, completing the work, making payment, reviewing the provider, and resolving disputes if something goes wrong.

Key architectural decision: Connecta is more than a directory of artisans; it is an end-to-end platform for service discovery, provider verification, job management, reputation, and accountability.

---

## 1. Marketplace Participants

- **Customer:** Discovers nearby professionals, describes a problem, requests quotations, books services, tracks jobs, pays, and reviews completed work.
- **Service Provider:** Registers a trade, submits verification documents, defines services and service areas, receives job requests, submits quotations, completes jobs, and builds a reputation.
- **Connecta Administrator / Support:** Reviews verification applications, manages categories, monitors transactions, handles reports and disputes, and enforces marketplace rules.

*Single Identity Rule:* One person can use Connecta as a customer and also register as a service provider without creating two separate accounts. A provider can offer multiple trades or services.

---

## 2. Core Architecture & Design Principles

### Stack
- **Web Platform:** Next.js (App Router, React 19, TypeScript, Tailwind CSS)
- **Mobile App:** React Native Expo
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security, Realtime, Storage, Auth) & Express + TypeScript microservices / APIs
- **Realtime & Messaging:** Supabase Realtime / WebSockets (Socket.IO)
- **Object Storage:** Supabase Storage (Private buckets for verification IDs, public buckets for portfolio & brand assets)
- **Payment Gateway:** Paystack / Flutterwave (NGN kobo minor units, webhooks, escrow / direct settlement)

### Database Design Principles
1. Store money as integer minor units (e.g. kobo: `10000` = `₦100.00`) alongside an explicit currency code (`NGN`).
2. Separate lifecycles: Service requests, quotations, bookings, payments, and reviews are separate entities.
3. Snapshotting: Embed immutable snapshots in bookings and transactions so changes to a provider's profile or service catalog do not mutate past records.
4. Server-enforced state machines: Never allow client apps to unilaterally update booking or payment statuses.
5. Strict access control: Private addresses, phone numbers, and identity verification documents are protected behind authorization policies.

---

## 3. Complete Data Model Inventory

### Core Identity & Setup
- `users` / `profiles`: Shared authentication identity, roles (`customer`, `provider`, `admin`), contact verification.
- `customer_profiles`: Preferences and default addresses.
- `customer_addresses`: Saved locations with GeoJSON coordinates `[longitude, latitude]`.
- `provider_profiles`: Trade identity, bio, business name, verification & onboarding status, denormalized ratings.
- `service_categories`: Hierarchical category tree (slug, parent_category_id, required_verification_types).
- `provider_services`: Specific services, pricing models (`fixed`, `hourly`, `inspection`, `quote_required`), base price in kobo.
- `provider_service_areas`: City, state, service radius, GeoJSON boundaries (initial launch: Kano, Nigeria).
- `provider_availability`: Weekly schedules and exception dates.
- `provider_portfolio`: Project gallery, photos, completion stories.
- `verification_cases` & `verification_documents`: Tiered provider verification, document reviews, private storage keys.

### Discovery & Job Lifecycle
- `service_requests`: Problem descriptions, urgency (`emergency`, `today`, `scheduled`, `flexible`), location, budget.
- `request_attachments`: Diagnostic photos and videos.
- `request_invitations`: Targeted dispatch to eligible local providers.
- `quotes`: Detailed line items, labor, materials, visit fees, validity period.
- `bookings`: Accepted quotation, confirmed appointment, immutable service & pricing snapshots.
- `booking_events`: Append-only audit log of state changes.
- `job_evidence`: Before, during, and after photos uploaded during service delivery.
- `job_change_orders`: Documented and customer-approved scope/price adjustments.

### Trust, Communication & Finance
- `conversations` & `messages`: Secure direct chat between matched customer and provider.
- `reviews`: Verified 1–5 star ratings and reviews tied to completed bookings (unique per booking).
- `disputes`: Formal dispute cases with evidence and support admin resolution.
- `payments`: Transaction attempts, payment gateway references, idempotency keys, status.
- `payouts`: Provider disbursements, net calculations minus platform fees.
- `audit_logs`: Administrative actions log.

---

## 4. Booking State Machine

```
[Pending Confirmation] ──(Provider accepts)──> [Confirmed]
        │                                         │
        ├──(Cancelled by Customer/Provider)       ├──(Provider travels)
        ▼                                         ▼
   [Cancelled]                             [Provider En Route]
                                                  │
                                                  ▼
                                           [In Progress]
                                                  │
                                                  ├──(Extra work requested -> Change Order)
                                                  ▼
                                       [Completion Submitted]
                                                  │
                        ┌─────────────────────────┴─────────────────────────┐
                        ▼                                                   ▼
                   [Completed]                                         [Disputed]
                        │                                                   │
                  (Leave Review)                                      (Admin Resolves)
```

---

## 5. Payment Lifecycle State Machine

```
[Initiated] ──> [Pending] ──(Webhook verified)──> [Succeeded]
                   │                                  │
                   ▼                                  ├──> [Partially Refunded]
                [Failed]                              ▼
                                                  [Refunded]
```

---

## 6. Initial Launch Configuration (Phase 1)
- **Primary Launch City:** Kano, Nigeria (Expanding to Kaduna, Abuja, and nationwide).
- **Primary Currency:** Nigerian Naira (`NGN`), calculated in Kobo (`minor_units`).
- **Booking Flow:** Request Service → Compare Competitive Quotes → Confirm Booking & Appointment.
- **Provider Verification:** Tiered verification (Tier 1: Phone + Govt ID, Tier 2: Trade certification / apprenticeship guarantor, Tier 3: Verified Badge).
