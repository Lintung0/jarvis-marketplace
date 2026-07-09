-- NEWSLETTER SUBSCRIBERS
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
