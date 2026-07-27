-- Extended profile fields, orders, username uniqueness

alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists website text;
alter table public.profiles add column if not exists social_instagram text;
alter table public.profiles add column if not exists social_twitter text;
alter table public.profiles add column if not exists social_facebook text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists display_preference text not null default 'full_name';

alter table public.profiles drop constraint if exists profiles_display_preference_check;
alter table public.profiles add constraint profiles_display_preference_check
  check (display_preference in ('full_name', 'username'));

create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_name text not null,
  status text not null default 'processing' check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders
  for insert with check (auth.uid() = user_id);
