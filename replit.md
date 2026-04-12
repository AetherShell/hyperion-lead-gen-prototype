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

### Features
- Interactive multi-step soap cost quiz with personalized savings calculator
- Lead capture form (POST `/api/leads`) saves submissions to the `leads` DB table
- Branding: Hyperion Elite Systems (water/RO system) + Pure and Gentle (soap program partner)

### Lead Storage
- Leads saved to PostgreSQL `leads` table (id, name, email, phone, zip_code, preferred_time, created_at)
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
