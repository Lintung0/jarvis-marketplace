-- KNOWLEDGE BASE: Categories
create table public.kb_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- KNOWLEDGE BASE: Articles
create table public.kb_articles (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.kb_categories(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  is_published boolean default false,
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.kb_categories enable row level security;
alter table public.kb_articles enable row level security;

-- Everyone can read published
create policy "Anyone can read published KB categories"
  on public.kb_categories for select
  using (true);

create policy "Anyone can read published KB articles"
  on public.kb_articles for select
  using (is_published = true);

-- Admins can CRUD categories
create policy "Admins can insert KB categories"
  on public.kb_categories for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update KB categories"
  on public.kb_categories for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete KB categories"
  on public.kb_categories for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can CRUD articles
create policy "Admins can insert KB articles"
  on public.kb_articles for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update KB articles"
  on public.kb_articles for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete KB articles"
  on public.kb_articles for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can read all articles (including unpublished)
create policy "Admins can read all KB articles"
  on public.kb_articles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- FUNCTION: increment KB article views
create or replace function public.increment_kb_view(article_id uuid)
returns void as $$
begin
  update public.kb_articles
  set views = views + 1
  where id = article_id;
end;
$$ language plpgsql security definer;
