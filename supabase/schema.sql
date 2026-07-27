-- Supabase: profiles, comments, reactions + RLS + Realtime

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  content text not null check (char_length(trim(content)) > 0),
  parent_id uuid references public.comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_product_id_idx on public.comments (product_id);
create index if not exists comments_parent_id_idx on public.comments (parent_id);
create index if not exists comments_created_at_idx on public.comments (created_at desc);

create table if not exists public.comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists comment_reactions_comment_id_idx on public.comment_reactions (comment_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := trim(concat(
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    ' ',
    coalesce(new.raw_user_meta_data->>'last_name', '')
  ));

  if display_name = '' then
    display_name := split_part(new.email, '@', 1);
  end if;

  insert into public.profiles (id, username, avatar_url)
  values (new.id, display_name, new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists comments_updated_at on public.comments;
create trigger comments_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

alter table public.comments enable row level security;
alter table public.comment_reactions enable row level security;

-- Ek sütunlar (mevcut projeler için)
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.comments add column if not exists is_anonymous boolean not null default false;
alter table public.comments add column if not exists identity_type text not null default 'full_name';

alter table public.comments drop constraint if exists comments_identity_type_check;
alter table public.comments add constraint comments_identity_type_check
  check (identity_type in ('full_name', 'username', 'anonymous'));

alter table public.profiles add column if not exists website text;
alter table public.profiles add column if not exists social_instagram text;
alter table public.profiles add column if not exists social_twitter text;
alter table public.profiles add column if not exists social_facebook text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists display_preference text not null default 'full_name';
alter table public.profiles add column if not exists created_at timestamptz not null default now();

alter table public.profiles drop constraint if exists profiles_display_preference_check;
alter table public.profiles add constraint profiles_display_preference_check
  check (display_preference in ('full_name', 'username'));

create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username));

create policy "profiles_select_public" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "comments_select_public" on public.comments for select using (true);
create policy "comments_insert_authenticated" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

create policy "reactions_select_public" on public.comment_reactions for select using (true);
create policy "reactions_insert_authenticated" on public.comment_reactions for insert with check (auth.uid() = user_id);
create policy "reactions_update_own" on public.comment_reactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reactions_delete_own" on public.comment_reactions for delete using (auth.uid() = user_id);

alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.comment_reactions;
