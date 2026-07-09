-- AFFILIATE PROFILES
create table public.affiliate_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  referral_code text unique not null,
  commission_rate numeric(5,2) default 5.00,
  total_earnings numeric(10,2) default 0,
  total_clicks int default 0,
  total_conversions int default 0,
  referred_by uuid references public.affiliate_profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- AFFILIATE CLICKS
create table public.affiliate_clicks (
  id uuid default gen_random_uuid() primary key,
  affiliate_id uuid references public.affiliate_profiles(id) on delete cascade not null,
  ip_address text,
  user_agent text,
  referrer_url text,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz default now()
);

-- AFFILIATE CONVERSIONS
create table public.affiliate_conversions (
  id uuid default gen_random_uuid() primary key,
  click_id uuid references public.affiliate_clicks(id) on delete set null,
  affiliate_id uuid references public.affiliate_profiles(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete cascade not null,
  commission_amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'approved', 'paid')),
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- RLS
alter table public.affiliate_profiles enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.affiliate_conversions enable row level security;

-- Affiliate profiles policies
create policy "Affiliates can see own profile"
  on public.affiliate_profiles for select
  using (auth.uid() = id);

create policy "Admins can see all affiliate profiles"
  on public.affiliate_profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Anyone can create affiliate profile"
  on public.affiliate_profiles for insert
  with check (true);

create policy "Affiliates can update own profile"
  on public.affiliate_profiles for update
  using (auth.uid() = id);

-- Clicks policies
create policy "Affiliates can see own clicks"
  on public.affiliate_clicks for select
  using (affiliate_id = auth.uid());

create policy "Admins can see all clicks"
  on public.affiliate_clicks for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Anyone can insert clicks"
  on public.affiliate_clicks for insert
  with check (true);

-- Conversions policies
create policy "Affiliates can see own conversions"
  on public.affiliate_conversions for select
  using (affiliate_id = auth.uid());

create policy "Admins can see all conversions"
  on public.affiliate_conversions for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Service role can insert conversions"
  on public.affiliate_conversions for insert
  with check (true);

create policy "Admins can update conversions"
  on public.affiliate_conversions for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- FUNCTION: generate unique referral code
create or replace function public.generate_referral_code()
returns text as $$
declare
  code text;
  done bool;
begin
  done := false;
  while not done loop
    code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    done := not exists (select 1 from public.affiliate_profiles where referral_code = code);
  end loop;
  return code;
end;
$$ language plpgsql;

-- FUNCTION: auto-create affiliate profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  ref_code text;
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );

  ref_code := public.generate_referral_code();
  insert into public.affiliate_profiles (id, referral_code)
  values (new.id, ref_code);

  return new;
end;
$$ language plpgsql security definer;

-- FUNCTION: increment affiliate clicks counter
create or replace function public.increment_affiliate_clicks(affiliate_id uuid)
returns void as $$
begin
  update public.affiliate_profiles
  set total_clicks = total_clicks + 1
  where id = affiliate_id;
end;
$$ language plpgsql security definer;

-- FUNCTION: increment conversions and earnings
create or replace function public.increment_affiliate_conversions_and_earnings(
  affiliate_id uuid,
  amount numeric
)
returns void as $$
begin
  update public.affiliate_profiles
  set total_conversions = total_conversions + 1,
      total_earnings = total_earnings + amount
  where id = affiliate_id;
end;
$$ language plpgsql security definer;
