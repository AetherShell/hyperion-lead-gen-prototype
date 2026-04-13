# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Project: Hyperion Elite Systems — Lead Generation Landing Page

**Artifact:** `artifacts/pure-gentle-landing` — React + Vite landing page at `/`
**API:** `artifacts/api-server` — Express API at `/api`

### Conversion Strategy (Applied)
The landing page follows a trust-first, skeptic-friendly conversion strategy:
- **Hero**: Water-quality-first headline ("Do you know what's in your water?"), not cost-first
- **Problem section**: Grounded descriptions of real water issues (contaminants, hard water, appliance damage) with softened cost ranges, no inflated claims
- **How It Works**: 3-step explanation (refiner, RO, soap program) with accurate 8–15 year financing timeline
- **Cost comparison**: Side-by-side with ranges (~$80–160/mo soap, ~$30–80/mo bottled water per person), not exact numbers
- **Calculator**: Outputs savings as rough ranges (75%–100% of calculated savings), with disclaimers about estimates
- **Decision flow**: Primary CTA = "Talk to a Water Specialist" (callback), Secondary = "Move Forward" (order). Reassurance that it's normal not to decide immediately.
- **In-home water test**: Integrated naturally as free, no-obligation option — mentioned in quiz results, FAQ, and CTA form checkbox
- **No hype**: No urgency, no exaggerated claims, no "80% lather" statistics, no "secret method" language

### Features
- Interactive multi-step quiz with personalized savings calculator (outputs ranges)
- Lead capture form (POST `/api/leads`) with optional water test checkbox
- Self-service order flow at `/order` with e-signature
- Branding: Hyperion Elite Systems (water refiner + RO system) + Pure and Gentle (soap program partner)
- **Product distinction:** The system uses a water REFINER, not a basic softener. A refiner removes hardness AND chemicals (chlorine, arsenic, uranium) — essential for Southwest/desert groundwater. Softeners only handle hardness and cost ~1/4 as much.
- Target geography: Southwest USA / desert areas where groundwater contaminants make a refiner necessary
- **Financing:** $160/mo, typically 8–15 years depending on credit. Do NOT say "paid off in 5 years."
- **Warranty:** LIFETIME — if anything breaks we fix it; if it can't be fixed, we replace with new system.
- **Maintenance after payoff:** $180/yr RO service + $340/yr alkaline filters (~$520/yr total)

### Lead Storage
- Leads saved to PostgreSQL `leads` table (id, name, email, phone, zip_code, preferred_time, water_test, created_at)
- Schema: `lib/db/src/schema/leads.ts`
- Route: `artifacts/api-server/src/routes/leads.ts`

### Self-Service Order Flow (`/order`)
- 3-step flow: Customer Info → Scheduling → Agreement + E-Signature
- Canvas-based signature pad (react-signature-canvas) + typed name confirmation
- Orders saved to PostgreSQL `orders` table with full customer info, signature data, soap/water costs, preferred date
- Schema: `lib/db/src/schema/orders.ts`
- Route: `artifacts/api-server/src/routes/orders.ts`
- Quiz results CTA navigates to /order with soap and water cost query params

### Admin Dashboard (`/admin`)
- Password protected (ADMIN_PASSWORD env var)
- Shows Orders tab (signed work orders with all details) and Leads tab (consultation requests)
- Summary stats: Total Orders, Total Leads, Pending Orders

### Future integrations (not yet set up — user dismissed OAuth flow)
- **Email notifications**: Use the Resend connector (`connector:ccfg_resend_01K69QKYK789WN202XSE3QS17V`) to send email alerts on new lead submissions
- **Google Sheets**: Use the Google Sheets connector (`connector:ccfg_google-sheet_E42A9F6CA62546F68A1FECA0E8`) to sync leads to a spreadsheet
