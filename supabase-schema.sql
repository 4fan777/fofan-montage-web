create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('reels', 'youtube')),
  video_url text not null,
  frame text not null check (frame in ('9:16', '16:9')),
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.works enable row level security;

drop policy if exists "Public can read published works" on public.works;
create policy "Public can read published works"
  on public.works
  for select
  using (is_published = true);

grant select on public.works to anon;
grant select, insert, update, delete on public.works to service_role;

create index if not exists works_public_order_idx
  on public.works (is_published, sort_order, created_at desc);
