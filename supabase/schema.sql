create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  role text not null default 'viewer' check (role in ('super_admin','admin','manager','viewer')),
  status text not null default 'active' check (status in ('active','pending','suspended')),
  department text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  specialty text not null,
  location text not null,
  rating numeric not null default 0,
  price_level text not null default 'mid' check (price_level in ('budget','mid','premium')),
  status text not null default 'review' check (status in ('approved','review','suspended')),
  featured boolean not null default false,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  vendor_name text not null,
  service text not null,
  status text not null default 'pending' check (status in ('confirmed','pending','completed','cancelled')),
  booking_date date not null,
  amount numeric not null default 0,
  location text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  price numeric not null default 0,
  duration text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null default 'Zaffa',
  support_email text not null default 'support@zaffa.com',
  maintenance_mode boolean not null default false,
  currency text not null default 'SAR',
  locale text not null default 'en',
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_plans (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  owner_email text not null,
  wedding_date date,
  venue text,
  guest_count integer not null default 0,
  budget_total numeric not null default 0,
  checklist jsonb not null default '[]'::jsonb,
  budget jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.bookings enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.content_blocks enable row level security;
alter table public.settings enable row level security;
alter table public.wedding_plans enable row level security;

create policy "Public read profiles" on public.profiles for select using (true);
create policy "Public read vendors" on public.vendors for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read services" on public.services for select using (true);
create policy "Public read bookings" on public.bookings for select using (true);
create policy "Public read settings" on public.settings for select using (true);
create policy "Public read content blocks" on public.content_blocks for select using (status = 'published');

insert into public.settings (brand_name, support_email, currency, locale)
select 'Zaffa', 'support@zaffa.com', 'SAR', 'ar'
where not exists (select 1 from public.settings);

insert into public.vendors (name, specialty, location, rating, price_level, status, featured, bio)
select * from (values
  ('Elysian Events', 'Full planning', 'Riyadh', 4.9, 'premium', 'approved', true, 'Luxury wedding planning and coordination.'),
  ('Lumen Studio', 'Photography', 'Jeddah', 4.8, 'mid', 'approved', true, 'Cinematic wedding photography.'),
  ('Petal Atelier', 'Florals', 'Dammam', 4.7, 'mid', 'approved', false, 'Modern floral design for weddings.')
) as seed(name, specialty, location, rating, price_level, status, featured, bio)
where not exists (select 1 from public.vendors limit 1);

insert into public.bookings (client_name, vendor_name, service, status, booking_date, amount, location)
select * from (values
  ('Admin', 'Elysian Events', 'Venue styling', 'confirmed', current_date + 90, 18000, 'Riyadh'),
  ('Admin', 'Lumen Studio', 'Photography package', 'pending', current_date + 120, 9000, 'Jeddah')
) as seed(client_name, vendor_name, service, status, booking_date, amount, location)
where not exists (select 1 from public.bookings limit 1);

-- Wallets and booking payments are applied via migration `wallets_and_booking_payments`.
