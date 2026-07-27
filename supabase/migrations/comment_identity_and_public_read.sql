-- Yorum görünürlüğü ve kimlik sistemi güncellemesi
-- Supabase SQL Editor'da çalıştırın.

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;

alter table public.comments add column if not exists is_anonymous boolean not null default false;
alter table public.comments add column if not exists identity_type text not null default 'full_name';

alter table public.comments drop constraint if exists comments_identity_type_check;
alter table public.comments add constraint comments_identity_type_check
  check (identity_type in ('full_name', 'username', 'anonymous'));

-- Herkese açık okuma (anonim dahil)
alter table public.comments enable row level security;
alter table public.profiles enable row level security;
alter table public.comment_reactions enable row level security;

drop policy if exists "comments_select_public" on public.comments;
create policy "comments_select_public" on public.comments
  for select using (true);

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public" on public.profiles
  for select using (true);

drop policy if exists "reactions_select_public" on public.comment_reactions;
create policy "reactions_select_public" on public.comment_reactions
  for select using (true);

-- Profil oluşturma / güncelleme (giriş yapan kullanıcı)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Eski yorumlar: anonim değilse kimlik tipini tamamla
update public.comments
set identity_type = case
  when is_anonymous = true then 'anonymous'
  else coalesce(nullif(identity_type, ''), 'full_name')
end
where identity_type is null or identity_type = '';
