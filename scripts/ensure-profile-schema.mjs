/**
 * Ensures profile-related columns exist in Supabase/Postgres.
 * Run automatically via: npm run db:ensure-profile-schema
 */
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const STATEMENTS = [
  `alter table public.profiles add column if not exists full_name text`,
  `alter table public.profiles add column if not exists email text`,
  `alter table public.profiles add column if not exists bio text`,
  `alter table public.profiles add column if not exists phone text`,
  `alter table public.profiles add column if not exists address text`,
  `alter table public.profiles add column if not exists is_admin boolean not null default false`,
  `alter table public.profiles add column if not exists website text`,
  `alter table public.profiles add column if not exists social_instagram text`,
  `alter table public.profiles add column if not exists social_twitter text`,
  `alter table public.profiles add column if not exists social_facebook text`,
  `alter table public.profiles add column if not exists date_of_birth date`,
  `alter table public.profiles add column if not exists gender text`,
  `alter table public.profiles add column if not exists display_preference text not null default 'full_name'`,
  `alter table public.profiles add column if not exists created_at timestamptz not null default now()`,
  `alter table public.profiles drop constraint if exists profiles_display_preference_check`,
  `alter table public.profiles add constraint profiles_display_preference_check check (display_preference in ('full_name', 'username'))`,
  `create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username))`,
  `create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    product_name text not null,
    status text not null default 'processing' check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
    total_amount numeric(12, 2) not null default 0,
    created_at timestamptz not null default now()
  )`,
  `create index if not exists orders_user_id_idx on public.orders (user_id)`,
  `create index if not exists orders_created_at_idx on public.orders (created_at desc)`,
  `alter table public.orders enable row level security`,
  `drop policy if exists orders_select_own on public.orders`,
  `create policy orders_select_own on public.orders for select using (auth.uid() = user_id)`,
  `drop policy if exists orders_insert_own on public.orders`,
  `create policy orders_insert_own on public.orders for insert with check (auth.uid() = user_id)`,
];

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("No database URL configured; skipping profile schema migration.");
    return;
  }

  const isSupabaseHost = /supabase\.com|pooler\.supabase/i.test(connectionString);
  const isLocalHost = /localhost|127\.0\.0\.1/i.test(connectionString);

  if (isLocalHost && !process.env.SUPABASE_DB_URL) {
    console.warn("DATABASE_URL points to localhost; skipping remote Supabase migration.");
    return;
  }

  const needsSsl =
    isSupabaseHost ||
    /sslmode=require/i.test(connectionString) ||
    process.env.PGSSLMODE === "require";

  const pool = new pg.Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

  try {
    for (const statement of STATEMENTS) {
      await pool.query(statement);
      console.log("OK:", statement.split("\n")[0].slice(0, 80));
    }
    console.log("Profile schema is up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.warn("Profile schema migration skipped:", error.message);
});
