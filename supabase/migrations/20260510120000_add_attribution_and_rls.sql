-- Attribution columns for FB ad campaign tracking and RLS hardening.

alter table public.leads
  add column if not exists utm_source       text,
  add column if not exists utm_medium       text,
  add column if not exists utm_campaign     text,
  add column if not exists utm_content      text,
  add column if not exists utm_term         text,
  add column if not exists gift_card_variant text,
  add column if not exists referrer         text,
  add column if not exists user_agent       text,
  add column if not exists landing_path     text,
  add column if not exists fb_capi_status   text,
  add column if not exists fb_capi_response text;

create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);
create index if not exists leads_utm_content_idx  on public.leads (utm_content);
create index if not exists leads_gift_card_idx    on public.leads (gift_card_variant);

-- RLS hardening: deny anon/authenticated direct access; service_role (edge functions) keeps full access.
-- Service role bypasses RLS by design, so no explicit policy is needed for it. Anon and authenticated
-- have no policy granted, so RLS denies all access by default.

drop policy if exists "leads_anon_no_access" on public.leads;
drop policy if exists "leads_authenticated_no_access" on public.leads;

create policy "leads_anon_no_access"
  on public.leads for all
  to anon
  using (false)
  with check (false);

create policy "leads_authenticated_no_access"
  on public.leads for all
  to authenticated
  using (false)
  with check (false);
