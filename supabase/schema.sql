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
