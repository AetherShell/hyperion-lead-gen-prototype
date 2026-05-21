# DEPLOY.md — Hyperion Lead Gen Prototype site topology

**Purpose:** this document is the source of truth for how this repo deploys, where the live sites live, and the steps a deploy must follow to not break production. Read this before pushing changes that touch the landing page or Supabase functions. It exists because the deploy topology is not obvious from the code, and a 6-hour bookmywatertest.com 404 on 2026-05-20 made that gap visible.

---

## TL;DR

- **`bookmywatertest.com`** is served by **GitHub Pages** from the **`gh-pages` branch**, mapped via a `CNAME` file at the branch root.
- **`aethershell.github.io/hyperion-lead-gen-prototype/`** is the same gh-pages deploy under GitHub's default project URL.
- The `main` branch holds source. **`main` is NOT directly served to bookmywatertest.com.** A Cloudflare Pages deploy may exist on a `*.pages.dev` URL (verify in Cloudflare dashboard) but is separate from the production custom domain.
- **Deploying gh-pages REPLACES the entire branch.** If `dist/public/` doesn't include `CNAME` (and `.nojekyll`), they disappear from gh-pages and the live custom domain breaks.

---

## Hostnames and where they actually serve from

| Hostname | Serves from | Mapping mechanism |
|---|---|---|
| `bookmywatertest.com` | gh-pages branch, GitHub Pages | `CNAME` file at branch root, contents = `bookmywatertest.com` |
| `aethershell.github.io/hyperion-lead-gen-prototype/` | Same gh-pages branch, GitHub Pages | Default GitHub Pages project URL — no extra config |
| `*.pages.dev` (if any) | main branch (auto-deploy) | Cloudflare Pages project settings (verify in dashboard) |

**Critical:** bookmywatertest.com does not deploy from `main`. Pushing to main alone will NOT update production. The production-impacting deploy is to gh-pages.

---

## Repository topology

- **Canonical source on sophia:** `~/claude-code-sandbox/hyperion-lead-gen-prototype/` (has GitHub remote)
- **GitHub remote:** `git@github.com:AetherShell/hyperion-lead-gen-prototype.git`
- **Branches:**
  - `main` — source. Pushes here trigger Cloudflare Pages (if configured). Does NOT update bookmywatertest.com.
  - `gh-pages` — built artifacts. Pushes here update bookmywatertest.com and aethershell.github.io/hyperion-lead-gen-prototype/.

**Sister copy (legacy):** `~/projects/hyperion-lead-gen-prototype/` on sophia. No git remote per project memory. Do not edit; reconcile or remove if you encounter it.

---

## Build (frontend, `artifacts/pure-gentle-landing`)

The landing page is a Vite + React SPA. Build output goes to `dist/public/` (note the subpath — Vite is configured with `outDir: "dist/public"`).

**Required env vars at build time:**

| Var | Required | gh-pages value | main/Cloudflare value | Notes |
|---|---|---|---|---|
| `PORT` | yes | any (e.g. 5174) | any | Required by vite.config.ts but irrelevant for build |
| `BASE_PATH` | yes | `./` | `/` | gh-pages needs relative paths; root deploys need absolute |
| `VITE_FB_PIXEL_ID` | no | empty or `1667275161131722` | same | If unset, browser-side Pixel doesn't fire (CAPI still works server-side) |
| `VITE_LEAD_INTAKE_URL` | no | empty (uses hardcoded fallback) | same | Fallback is the Supabase Edge Function URL |
| `VITE_SUPABASE_ANON_KEY` | no | empty | same | If unset, lead-intake call goes without auth header (handled by function CORS) |

**Build command (gh-pages target):**
```
cd artifacts/pure-gentle-landing
BASE_PATH=./ PORT=5174 pnpm build
```

Output: `dist/public/` containing `index.html`, `assets/`, copied static files from `public/`, **including the `CNAME` file**.

---

## Deploy

### Frontend — gh-pages (this is what updates bookmywatertest.com)

```
cd artifacts/pure-gentle-landing
BASE_PATH=./ PORT=5174 pnpm build
npx gh-pages -d dist/public -m "Deploy: <short description>"
```

**Critical behavior of `npx gh-pages`:**

- **It REPLACES the entire gh-pages branch contents with the dist folder.** Any file in gh-pages that's not in `dist/public/` will be deleted. This includes `CNAME` and `.nojekyll`.
- To prevent CNAME loss, ensure `artifacts/pure-gentle-landing/public/CNAME` exists and contains `bookmywatertest.com`. Vite copies `public/` contents into the build output, so `CNAME` ends up at `dist/public/CNAME` and survives the deploy.
- Alternative: use `--add` flag to merge instead of replace, but the cleaner discipline is "build output is the source of truth for what gh-pages contains."

### Frontend — Cloudflare Pages (if configured)

Push to `main`. Cloudflare auto-deploys to `*.pages.dev` URL. Verify deploy succeeded in Cloudflare dashboard. Does not affect bookmywatertest.com.

### Backend — Supabase Edge Functions

Functions `lead-intake` and `fb-conversion` live in `supabase/functions/`. They do **NOT** auto-deploy on push to main. Manual deploy required:

```
cd ~/claude-code-sandbox/hyperion-lead-gen-prototype
SUPABASE_ACCESS_TOKEN=<PAT> ~/.local/bin/supabase functions deploy <function-name> --project-ref bbccnglbxwnxpxlplxyv
```

**PAT generation:** https://supabase.com/dashboard/account/tokens. Personal Access Token required for non-interactive CLI use.

**Important per-function config:**
- `fb-conversion` has **Verify JWT disabled** (set 2026-05-19 via dashboard toggle). It's called server-to-server by `lead-intake` from within Supabase's runtime; the new-format `sb_secret_` keys don't pass the legacy JWT gateway, so verify_jwt must remain off. See memory: `supabase_capi_jwt_gateway_fix`.

---

## Files that MUST persist on gh-pages

These files must be in `gh-pages` branch root or the production site breaks:

| File | Purpose | If missing |
|---|---|---|
| `CNAME` | Maps `bookmywatertest.com` to this GitHub Pages site | Custom domain stops resolving → 404 from GitHub Pages |
| `.nojekyll` | Disables Jekyll processing | GitHub Pages tries to render the React build as Jekyll → broken assets |
| `index.html` | Entry point | Site doesn't load |
| `assets/*` | Built JS/CSS bundles | Site doesn't load |

`CNAME` is now included via `artifacts/pure-gentle-landing/public/CNAME` so it survives `pnpm build` automatically. Do not delete it from `public/`. `.nojekyll` is auto-added by the `gh-pages` npm package on every deploy — no source-side file needed.

---

## Pre-deploy checklist

Before running `npx gh-pages -d dist/public`:

1. `git ls-tree origin/gh-pages | head -20` — see what's currently on gh-pages. Any files NOT in your dist will be removed.
2. `ls dist/public/CNAME dist/public/.nojekyll` — confirm both exist in the build output. If missing, your deploy will break production.
3. `cat dist/public/CNAME` — confirm contents are exactly `bookmywatertest.com` (no trailing newline, no other domains).
4. Visual diff: `find dist/public -type f | sort` and confirm asset filenames look right.

## Post-deploy verification

Immediately after deploying:

```
curl -sI https://bookmywatertest.com | head -5
curl -sI https://aethershell.github.io/hyperion-lead-gen-prototype/ | head -5
```

Both should return `HTTP/2 200`. If either returns 404, gh-pages config is broken — most likely `CNAME` is missing or wrong. Fix immediately by adding CNAME directly to gh-pages via clone-commit-push (see [Incident: 2026-05-20](#incident-2026-05-20-cname-wipeout)).

---

## Supabase env vars (Edge Function secrets)

Set via Supabase Dashboard → project `bbccnglbxwnxpxlplxyv` → Edge Functions → Secrets:

| Secret | Purpose | Notes |
|---|---|---|
| `F9_USERNAME` / `F9_PASSWORD` / `F9_DOMAIN` / `F9_LIST` | Five9 WebToCampaign auth and routing | Currently routes to list `0 James Leads` per response echo |
| `FB_PIXEL_ID` | Meta Pixel ID for CAPI events | `1667275161131722` |
| `FB_CAPI_ACCESS_TOKEN` | Meta Graph API token, generated against the pixel | Generate in FB Events Manager → pixel → Settings → Conversions API |
| `FB_CAPI_ENABLED` | Must be `"true"` for the function to POST to FB | Anything else → events log-only, not sent |
| `FB_TEST_EVENT_CODE` | If set, routes events to Events Manager Test Events tab | **REMOVE BEFORE LAUNCH** — see memory: `capi_test_event_code_cleanup` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase at runtime.

---

## Common pitfalls

### Incident: 2026-05-20 CNAME wipeout

**What happened:** Logos pushed gh-pages via `npx gh-pages -d dist/public` to fix a phone number digit. The dist folder didn't include `CNAME`. The gh-pages CLI replaced all branch contents → CNAME wiped → bookmywatertest.com 404'd for ~6 hours until discovered.

**Root cause:** Mental model error. Logos believed bookmywatertest.com served from Cloudflare Pages (via main branch) and treated gh-pages as a "mirror." In reality, gh-pages IS production for bookmywatertest.com via CNAME.

**Fix:** Restored CNAME to gh-pages via direct commit. Added `artifacts/pure-gentle-landing/public/CNAME` so all future builds include it automatically.

**Prevention going forward:** This document. Always verify the gh-pages contents before deploying, always curl the live site after.

### Other pitfalls

- **Forgetting `BASE_PATH`.** `BASE_PATH=/` is for root-served deploys. `BASE_PATH=./` is for gh-pages (relative paths so assets load under the subpath). Wrong value = broken asset loading on the wrong target.
- **Deploying main and assuming bookmywatertest.com updated.** It didn't. main doesn't deploy to bookmywatertest.com. The custom domain only updates on gh-pages deploy.
- **Editing the `~/projects/...` legacy copy on sophia.** It has no git remote; edits won't push. Always work in `~/claude-code-sandbox/...`.
- **Forgetting that Supabase functions don't auto-deploy.** Pushing to main updates the source on GitHub but doesn't redeploy `lead-intake` or `fb-conversion`. They need the `supabase functions deploy` step with a PAT.

---

## Related memory references

- `supabase_capi_jwt_gateway_fix` — why fb-conversion has verify_jwt off
- `capi_test_event_code_cleanup` — remove FB_TEST_EVENT_CODE before launch
- `hyperion_email_privacy_verify` — required verification before shipping value-exchange email copy
- `hyperion_tomas_frank_routing` — operational comm routing through Frank, not Tomas
- `funnel_responsibility_to_coherent_flow` — operating principle for funnel work

---

*Last updated: 2026-05-21, after the CNAME wipeout incident. Update this file when deploy topology changes.*
