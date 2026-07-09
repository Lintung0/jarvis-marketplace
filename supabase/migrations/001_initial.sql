-- PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  email text unique not null,
  avatar_url text,
  bio text,
  location text,
  website text,
  role text default 'member' check (role in ('member', 'vendor', 'moderator', 'admin')),
  is_verified boolean default false,
  is_banned boolean default false,
  balance numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  icon text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  stock int default 0,
  type text default 'physical' check (type in ('physical', 'digital', 'license_key')),
  status text default 'pending' check (status in ('pending', 'active', 'hidden', 'draft', 'rejected')),
  is_featured boolean default false,
  commission_rate numeric(5,2),
  tags text[],
  location text,
  views int default 0,
  sold_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PRODUCT IMAGES
create table public.product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  alt text,
  sort_order int default 0,
  is_primary boolean default false
);

-- PRODUCT OPTIONS
create table public.product_options (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null,
  values text[] not null,
  price_modifier numeric(10,2) default 0
);

-- CART ITEMS
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity int default 1,
  options jsonb,
  created_at timestamptz default now()
);

-- ORDERS
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) on delete set null not null,
  status text default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  total numeric(10,2) not null,
  shipping_address jsonb,
  payment_method text,
  payment_id text,
  coupon_code text,
  discount_amount numeric(10,2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  vendor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  price numeric(10,2) not null,
  quantity int not null,
  options jsonb,
  commission_rate numeric(5,2),
  vendor_earning numeric(10,2),
  created_at timestamptz default now()
);

-- REVIEWS
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating int check (rating between 1 and 5) not null,
  comment text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- WISHLISTS
create table public.wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- FOLLOWS
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(follower_id, following_id)
);

-- MESSAGES
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- COUPONS
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  type text check (type in ('percentage','fixed')) not null,
  value numeric(10,2) not null,
  min_order numeric(10,2) default 0,
  max_uses int,
  used_count int default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- WITHDRAWALS
create table public.withdrawals (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric(10,2) not null,
  method text check (method in ('paypal','iban','swift')) not null,
  account_details jsonb not null,
  status text default 'pending' check (status in ('pending','approved','rejected','paid')),
  notes text,
  created_at timestamptz default now()
);

-- BLOG POSTS
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  cover_image text,
  status text default 'draft' check (status in ('draft','published')),
  tags text[],
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- BANNERS
create table public.banners (
  id uuid default gen_random_uuid() primary key,
  title text,
  image_url text not null,
  link text,
  placement text default 'hero' check (placement in ('hero','top','middle','bottom','sidebar')),
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.messages enable row level security;

-- Profiles: everyone can read, only owner can update
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products: active products are public
create policy "Active products are viewable by everyone" on public.products for select using (status = 'active' or vendor_id = auth.uid());
create policy "Vendors can insert own products" on public.products for insert with check (vendor_id = auth.uid());
create policy "Vendors can update own products" on public.products for update using (vendor_id = auth.uid());

-- Cart: only owner
create policy "Users can manage own cart" on public.cart_items for all using (user_id = auth.uid());

-- Orders: buyer and vendor can see their orders
create policy "Buyers can see own orders" on public.orders for select using (buyer_id = auth.uid());
create policy "Buyers can create orders" on public.orders for insert with check (buyer_id = auth.uid());

-- Wishlists
create policy "Users can manage own wishlist" on public.wishlists for all using (user_id = auth.uid());

-- Messages
create policy "Users can see own messages" on public.messages for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "Users can send messages" on public.messages for insert with check (sender_id = auth.uid());

-- FUNCTION: auto create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();