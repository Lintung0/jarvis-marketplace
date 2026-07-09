-- RETURN REQUESTS
create table public.return_requests (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.return_requests enable row level security;

create policy "Users can see own return requests"
  on public.return_requests for select
  using (user_id = auth.uid());

create policy "Users can create return requests"
  on public.return_requests for insert
  with check (user_id = auth.uid());

create policy "Moderators and admins can see all return requests"
  on public.return_requests for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('moderator', 'admin')
    )
  );

create policy "Moderators and admins can update return requests"
  on public.return_requests for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('moderator', 'admin')
    )
  );
