-- BRANDS
create table public.brands (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  website text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Add brand_id to products
alter table public.products add column brand_id uuid references public.brands(id) on delete set null;

-- RLS: brands
alter table public.brands enable row level security;

create policy "Anyone can view active brands"
  on public.brands for select
  using (is_active = true);

create policy "Admins can view all brands"
  on public.brands for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can insert brands"
  on public.brands for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update brands"
  on public.brands for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete brands"
  on public.brands for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Indexes
create index idx_brands_slug on public.brands(slug);
create index idx_brands_active on public.brands(is_active);
create index idx_products_brand_id on public.products(brand_id);
