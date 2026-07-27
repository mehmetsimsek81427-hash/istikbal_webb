-- profiles: hakkımda (bio) ve iletişim alanları

alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists is_admin boolean not null default false;
