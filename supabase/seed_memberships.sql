-- Create membership_plans table
create table if not exists public.membership_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_days int not null default 30,
  product_limit int not null default 5,
  featured_products int not null default 0,
  commission_rate numeric(5,2) not null default 5.00,
  is_active boolean default true,
  features jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Create vendor_subscriptions table
create table if not exists public.vendor_subscriptions (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.membership_plans(id) on delete restrict not null,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  start_date timestamptz default now(),
  end_date timestamptz not null,
  payment_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: membership_plans
alter table public.membership_plans enable row level security;

drop policy if exists "Anyone can view active plans" on public.membership_plans;
create policy "Anyone can view active plans"
  on public.membership_plans for select
  using (is_active = true);

drop policy if exists "Admins can manage plans" on public.membership_plans;
create policy "Admins can manage plans"
  on public.membership_plans for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS: vendor_subscriptions
alter table public.vendor_subscriptions enable row level security;

drop policy if exists "Vendors can view own subscriptions" on public.vendor_subscriptions;
create policy "Vendors can view own subscriptions"
  on public.vendor_subscriptions for select
  using (vendor_id = auth.uid());

drop policy if exists "Vendors can insert own subscriptions" on public.vendor_subscriptions;
create policy "Vendors can insert own subscriptions"
  on public.vendor_subscriptions for insert
  with check (vendor_id = auth.uid());

drop policy if exists "Admins can view all subscriptions" on public.vendor_subscriptions;
create policy "Admins can view all subscriptions"
  on public.vendor_subscriptions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins can update subscriptions" on public.vendor_subscriptions;
create policy "Admins can update subscriptions"
  on public.vendor_subscriptions for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed plans
insert into public.membership_plans (name, description, price, duration_days, product_limit, featured_products, commission_rate, features) values
('Free', 'Coba jualan gratis tanpa biaya. Cocok untuk pemula.', 0, 30, 5, 0, 5.00, '["5 produk aktif", "0 produk featured", "Komisi 5% per penjualan", "Akses dashboard dasar", "Dukungan email"]'::jsonb),
('Pro', 'Paket terpopuler untuk vendor aktif dengan fitur lengkap.', 99000, 30, 50, 10, 2.00, '["50 produk aktif", "10 produk featured", "Komisi 2% per penjualan", "Statistik penjualan", "Prioritas dukungan", "API akses"]'::jsonb),
('Enterprise', 'Solusi bisnis skala besar tanpa batas. Untuk profesional.', 299000, 30, 999999, 999999, 1.00, '["Produk tidak terbatas", "Featured tidak terbatas", "Komisi 1% per penjualan", "Analitik lanjutan", "Dukungan prioritas 24/7", "API akses penuh", "Dedicated account manager"]'::jsonb)
on conflict (id) do nothing;
