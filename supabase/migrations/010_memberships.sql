-- MEMBERSHIP PLANS
create table public.membership_plans (
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

-- VENDOR SUBSCRIPTIONS
create table public.vendor_subscriptions (
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

create policy "Anyone can view active plans"
  on public.membership_plans for select
  using (is_active = true);

create policy "Admins can manage plans"
  on public.membership_plans for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS: vendor_subscriptions
alter table public.vendor_subscriptions enable row level security;

create policy "Vendors can view own subscriptions"
  on public.vendor_subscriptions for select
  using (vendor_id = auth.uid());

create policy "Vendors can insert own subscriptions"
  on public.vendor_subscriptions for insert
  with check (vendor_id = auth.uid());

create policy "Admins can view all subscriptions"
  on public.vendor_subscriptions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can manage all subscriptions"
  on public.vendor_subscriptions for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Indexes
create index idx_vendor_subscriptions_vendor_id on public.vendor_subscriptions(vendor_id);
create index idx_vendor_subscriptions_status on public.vendor_subscriptions(status);
