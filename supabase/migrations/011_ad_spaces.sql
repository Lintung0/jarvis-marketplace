-- AD SPACES
create table public.ad_spaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  placement text not null check (placement in ('header', 'footer', 'sidebar', 'between_products')),
  code text not null,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.ad_spaces enable row level security;

create policy "Anyone can view active ads"
  on public.ad_spaces for select
  using (is_active = true);

create policy "Admins can view all ads"
  on public.ad_spaces for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can insert ads"
  on public.ad_spaces for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update ads"
  on public.ad_spaces for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete ads"
  on public.ad_spaces for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Indexes
create index idx_ad_spaces_placement on public.ad_spaces(placement);
create index idx_ad_spaces_active on public.ad_spaces(is_active);
