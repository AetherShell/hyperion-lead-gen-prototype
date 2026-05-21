# DEPLOY.md — Hyperion Lead Gen Prototype site topology

**Purpose:** this document is the source of truth for how this repo deploys, where the live sites live, and the steps a deploy must follow to not break production. Read this before pushing changes that touch the landing page or Supabase functions. It exists because the deploy topology is not obvious from the code, and a 6-hour bookmywatertest.com 404 on 2026-05-20 made that gap visible.

---

## TL;DR

- **`bookmywatertest.com`** is served by **GitHub Pages** from the **`gh-pages` branch**. The mapping is configured in GitHub repo Settings → Pages → Custom domain, AND maintained by a `CNAME` file at the branch root.
- **`aethershell.github.io/hyperion-lead-gen-prototype/`** is the same gh-pages deploy under GitHub's default project URL. It 301-redirects to bookmywatertest.com when a custom domain is configured.
- The `main` branch holds source. **`main` is NOT directly served to bookmywatertest.com.** A Cloudflare Pages deploy may exist on a `*.pages.dev` URL (verify in Cloudflare dashboard) but is separate from the production custom domain.
- **Deploying gh-pages REPLACES the entire branch** with the source folder by default. If `dist/public/` doesn't include `CNAME`, it disappears from gh-pages and the live custom domain breaks. The documented deploy command below uses `--cname` to defend against this even if the source-side file is missing.

---

## Hostnames and where they actually serve from

| Hostname | Serves from | Mapping mechanism |
|---|---|---|
| `bookmywatertest.com` | gh-pages branch, GitHub Pages | Settings → Pages → Custom domain + `CNAME` file at branch root containing `bookmywatertest.com` |
| `aethershell.github.io/hyperion-lead-gen-prototype/` | Same gh-pages branch, GitHub Pages | Default GitHub Pages project URL. **301-redirects to custom domain when one is configured.** |
| `*.pages.dev` (if any) | main branch (auto-deploy) | Cloudflare Pages project settings (verify in dashboard) |

**Critical:** bookmywatertest.com does not deploy from `main`. Pushing to main alone will NOT update production. The production-impacting deploy is to gh-pages.

**Empirically verified 2026-05-21:** live site returns HTTP 200 from `server: GitHub.com`, Let's Encrypt TLS cert `CN=bookmywatertest.com`, DNS resolves to GitHub Pages anycast IPs (185.199.108-111.153). No Cloudflare proxy in front of production (no `cf-ray` headers).

---

## Repository topology

- **Canonical source on sophia:** `~/claude-code-sandbox/hyperion-lead-gen-prototype/` (has GitHub remote)
- **GitHub remote:** `git@github.com:AetherShell/hyperion-lead-gen-prototype.git`
- **Branches:**
  - `main` — source. Pushes here may trigger Cloudflare Pages (if configured). Does NOT update bookmywatertest.com.
  - `gh-pages` — built artifacts. Pushes here update bookmywatertest.com and aethershell.github.io/hyperion-lead-gen-prototype/.

**Sister copy (legacy):** `~/projects/hyperion-lead-gen-prototype/` on sophia. No git remote per project memory. Do not edit; reconcile or remove if you encounter it.

---

## DNS pre-conditions

bookmywatertest.com depends on DNS at the registrar pointing the apex (and www subdomain) at GitHub Pages anycast IPs. If those records drift, no amount of CNAME-file discipline will recover the site.

**Expected DNS records:**
- Apex A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` CNAME → `aethershell.github.io` (recommended) OR apex A records duplicated

Verify with `getent hosts bookmywatertest.com` — should return all four IPs.

---

## TLS certificate

GitHub Pages auto-provisions and renews a Let's Encrypt cert for the custom domain. Currently issued by `Let's Encrypt R13`. Renewal is automatic; if it ever fails, the symptom is a TLS error (not a 404), and the fix is:

1. Settings → Pages → toggle "Enforce HTTPS" off, save, wait ~30s, toggle on again.
2. If that doesn't trigger a new cert issuance, remove and re-add the custom domain in Settings.

Different failure mode than CNAME-wipeout. Don't conflate them.

---

## Build (frontend, `artifacts/pure-gentle-landing`)

The landing page is a Vite + React SPA. Build output goes to `dist/public/` (note the subpath — Vite is configured with `outDir: "dist/public"` and `emptyOutDir: true`, which empties the directory before each build).

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

Output: `dist/public/` containing `index.html`, `assets/`, and all files copied verbatim from `artifacts/pure-gentle-landing/public/` — including `CNAME` and `.nojekyll`. Vite copies the source `public/` directory's contents to the build output root with no transformation.

---

## Deploy

### Frontend — gh-pages (this is what updates bookmywatertest.com)

```
cd artifacts/pure-gentle-landing
BASE_PATH=./ PORT=5174 pnpm build
npx gh-pages -d dist/public --cname bookmywatertest.com -m "Deploy: <short description>"
```

**Why `--cname bookmywatertest.com` is in the command:** the `gh-pages` package's `--cname` option re-emits the CNAME file with the specified content on every deploy. This is belt-and-suspenders with the source-side `public/CNAME` — even if someone deletes the source-side file by accident, the deploy command itself encodes the custom-domain contract.

**Critical behavior of `npx gh-pages` to understand:**

- **Default `--remove` is `**/*`**, meaning the deploy replaces the branch contents with the source folder. Files in gh-pages that aren't in `dist/public/` will be deleted.
- **Dotfiles are excluded from removal by default** (the `--remove` glob doesn't match dotfiles). This is why `.nojekyll` survives across deploys even without explicit re-creation. **But this is fragile** — if `--dotfiles` is ever passed (which makes dotfiles match the remove glob too), or if deploy tooling is switched, `.nojekyll` evaporates. We ship `.nojekyll` from `public/.nojekyll` for defense.
- **The package does NOT auto-add `.nojekyll`** despite some documentation suggesting otherwise. The `--nojekyll` option exists and defaults to false; passing it explicitly creates an empty `.nojekyll` at the deploy root, but we don't rely on this either.
- **Don't use `--add`** — it never deletes anything from gh-pages, so over time the branch accumulates stale hashed asset bundles and loses the invariant "gh-pages tree == last build output." Cleaner to use the default replace-behavior with `--cname` and the source-side defenses.

### Frontend — Cloudflare Pages (if configured)

Push to `main`. Cloudflare auto-deploys to `*.pages.dev` URL (if any). Verify in Cloudflare dashboard. Does not affect bookmywatertest.com.

### Backend — Supabase Edge Functions

Functions `lead-intake` and `fb-conversion` live in `supabase/functions/`. They do **NOT** auto-deploy on push to main. Manual deploy required:

```
cd ~/claude-code-sandbox/hyperion-lead-gen-prototype
SUPABASE_ACCESS_TOKEN=<PAT> ~/.local/bin/supabase functions deploy <function-name> --project-ref bbccnglbxwnxpxlplxyv
```

**PAT generation:** https://supabase.com/dashboard/account/tokens.

**Per-function config:**
- `fb-conversion` has **Verify JWT disabled** (set 2026-05-19 via dashboard toggle). It's called server-to-server by `lead-intake` from within Supabase's runtime; the new-format `sb_secret_` keys don't pass the legacy JWT gateway, so verify_jwt must remain off. See memory: `supabase_capi_jwt_gateway_fix`.

---

## Files that MUST persist on gh-pages

These files must be at the `gh-pages` branch root or the production site breaks. They are now sourced from `artifacts/pure-gentle-landing/public/`, copied verbatim to `dist/public/` by Vite, and survive deploys via the build + `--cname` defenses described above.

| File | Purpose | If missing |
|---|---|---|
| `CNAME` | Maps `bookmywatertest.com` to this GitHub Pages site (in conjunction with the Settings → Pages → Custom domain field) | Custom domain stops resolving → 404 from GitHub Pages |
| `.nojekyll` | Disables Jekyll processing on the served branch | GitHub Pages may apply Jekyll rules to React build output → broken/skipped assets (especially anything under `_`-prefixed paths) |
| `index.html` | Entry point | Site doesn't load |
| `assets/*` | Built JS/CSS bundles | Site doesn't load |

`CNAME` and `.nojekyll` are now both in `artifacts/pure-gentle-landing/public/` so they're included in every build. Do not delete them from `public/`. The `--cname` deploy flag is a second line of defense for CNAME.

---

## Pre-deploy checklist

Before running the deploy command:

1. `git fetch origin gh-pages` — refresh local view of current gh-pages state (the local ref can be stale; always fetch before inspecting).
2. `git ls-tree origin/gh-pages | head -20` — see what's currently on gh-pages. Any files NOT in `dist/public/` will be removed by the deploy.
3. `ls dist/public/CNAME dist/public/.nojekyll` — confirm both exist in the build output. If `CNAME` is missing, the `--cname` flag in the deploy command will recreate it; if `.nojekyll` is missing, add `artifacts/pure-gentle-landing/public/.nojekyll` and rebuild.
4. `cat dist/public/CNAME` — confirm contents are exactly `bookmywatertest.com` (no other domains).
5. Visual diff: `find dist/public -type f | sort` and confirm asset filenames look right.

## Post-deploy verification

Immediately after deploying:

```
curl -sIL https://bookmywatertest.com | head -10
curl -sI https://aethershell.github.io/hyperion-lead-gen-prototype/ | head -5
```

**Expected results:**
- `bookmywatertest.com`: final response should be HTTP 200 (with `-L`, curl follows any redirects; the chain may include HTTP→HTTPS but should resolve to 200 on the apex).
- `aethershell.github.io/hyperion-lead-gen-prototype/`: HTTP **301** with `location: https://bookmywatertest.com/`. The 301 redirect is *expected behavior* when a custom domain is configured — it's actually a stronger health signal than a 200 because it proves the custom-domain mapping is wired up in GitHub Settings.

If `bookmywatertest.com` returns 404 with `server: GitHub.com` and title "Site not found · GitHub Pages," see Incident Response below.

---

## Incident response — bookmywatertest.com 404

If the live site 404s:

1. **First check `git ls-tree origin/gh-pages` after `git fetch`.** If `CNAME` is missing from the branch root, restore it (see Step 2). If `CNAME` is present, skip to Step 3.

2. **Restore CNAME directly to gh-pages without rebuilding source:**
   ```
   cd /tmp && git clone -b gh-pages --single-branch <repo-url> ghpages-fix
   cd ghpages-fix
   echo -n "bookmywatertest.com" > CNAME
   git add CNAME && git commit -m "fix(gh-pages): restore CNAME" && git push origin gh-pages
   ```
   Site should recover within 1-5 minutes. If it doesn't:

3. **Check the Settings → Pages → Custom domain field in the GitHub UI.** If the field is empty (GitHub may have unset it during the failure), re-enter `bookmywatertest.com` and save. Site should recover within 1-5 minutes.

4. **If neither helps, check DNS:**
   ```
   getent hosts bookmywatertest.com
   ```
   Should return the four `185.199.108-111.153` IPs. If different IPs or NXDOMAIN, the issue is at the DNS registrar, not GitHub.

5. **TLS errors (not 404)** are a separate failure mode — see the TLS section above.

### Rollback procedure (broken deploy that ships bad application logic)

If a deploy ships a broken site that needs immediate revert:

```
cd ~/claude-code-sandbox/hyperion-lead-gen-prototype
git fetch origin gh-pages
git log origin/gh-pages --oneline  # identify last known-good commit
# Carefully verify the SHA, then:
git push origin <good-sha>:gh-pages --force
```

Force-pushing to gh-pages is acceptable here because gh-pages is a deploy branch, not a source branch — its history is intended to be overwritten by deploys. Verify with curl after force-push.

---

## Files removed from `public/` = files removed from production

Anything currently in `artifacts/pure-gentle-landing/public/` ships to gh-pages root on next deploy. Currently includes brand assets (HES_Logo_White.png, HES_Wordmark_White.png, faucet-split.png, favicon.png, hero-kitchen.png, opengraph.jpg, logos/) and infrastructure files (CNAME, .nojekyll).

**Silent breakage failure mode:** if a redesign removes a logo or image file from `public/`, the next deploy removes it from gh-pages. Any external site, old social post, or backlink that references the old URL will start returning 404 with no other warning. Before removing files from `public/`, audit known external references (or accept the breakage explicitly).

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

**What happened:** Logos pushed gh-pages via `npx gh-pages -d dist/public` to fix a phone number digit. The dist folder didn't include `CNAME` and the deploy command didn't include `--cname`. The gh-pages CLI replaced all branch contents → CNAME wiped → bookmywatertest.com 404'd for ~6 hours until discovered.

**Root cause:** Mental model error. Logos believed bookmywatertest.com served from Cloudflare Pages (via main branch) and treated gh-pages as a "mirror." In reality, gh-pages IS production for bookmywatertest.com via the Settings → Pages custom domain config + CNAME file.

**Fix:** Restored CNAME via direct gh-pages commit. Added `artifacts/pure-gentle-landing/public/CNAME` so all builds include it. Added `--cname bookmywatertest.com` to the documented deploy command. This document exists.

### Other pitfalls

- **Forgetting `BASE_PATH`.** `BASE_PATH=/` is for root-served deploys. `BASE_PATH=./` is for gh-pages (relative paths so assets load under the subpath). Wrong value = broken asset loading on the wrong target.
- **Deploying main and assuming bookmywatertest.com updated.** It didn't. main doesn't deploy to bookmywatertest.com. The custom domain only updates on gh-pages deploy.
- **Stale local ref of gh-pages.** Local `origin/gh-pages` can show files that aren't actually on the remote (or vice versa). Always `git fetch origin gh-pages` before inspecting.
- **Editing the `~/projects/...` legacy copy on sophia.** It has no git remote; edits won't push. Always work in `~/claude-code-sandbox/...`.
- **Forgetting that Supabase functions don't auto-deploy.** Pushing to main updates the source on GitHub but doesn't redeploy `lead-intake` or `fb-conversion`. They need the `supabase functions deploy` step with a PAT.
- **Confusing 301 → custom domain with broken deploy.** `aethershell.github.io/hyperion-lead-gen-prototype/` returning HTTP 301 to bookmywatertest.com is expected and healthy. The 301 confirms the custom-domain mapping is configured.

---

## Phase 2: GitHub Actions migration

The cleanest long-term fix is moving deploys off local imperative commands and into a `actions/deploy-pages` workflow. Per GitHub Pages docs: *"If you are publishing from a custom GitHub Actions workflow, no CNAME file is created, and any existing CNAME file is ignored and is not required."*

That eliminates the entire CNAME-wipeout failure mode — custom domain becomes purely a Settings-field concern, no branch-state coupling. Also moves builds off local laptops (no `PORT=5174 BASE_PATH=./` ritual to remember) and into a reproducible CI environment.

**Estimated cost:** ~30 min one-time setup, plus testing.

Not done today because (a) launch is imminent and pre-launch infrastructure churn is the named over-investment pattern, (b) the source-side `public/CNAME` + `public/.nojekyll` + `--cname` flag combination addresses the immediate failure mode adequately. Queue for Phase 2 work once the Hyperion trial dust settles.

---

## Related memory references

- `supabase_capi_jwt_gateway_fix` — why fb-conversion has verify_jwt off
- `capi_test_event_code_cleanup` — remove FB_TEST_EVENT_CODE before launch
- `hyperion_email_privacy_verify` — required verification before shipping value-exchange email copy
- `hyperion_tomas_frank_routing` — operational comm routing through Frank, not Tomas
- `funnel_responsibility_to_coherent_flow` — operating principle for funnel work

---

*Last updated: 2026-05-21, after the CNAME wipeout incident and red-team reviews from Logos + GPT. Update this file when deploy topology changes.*
