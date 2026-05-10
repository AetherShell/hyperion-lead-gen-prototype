create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  name text not null,
  email text,
  phone text not null,
  zip_code text,
  preferred_time text,
  water_test boolean default false,
  five9_status text,
  five9_response text
);

alter table public.leads enable row level security;
