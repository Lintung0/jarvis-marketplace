-- NOTIFICATIONS
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  message text not null,
  order_id text,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can see own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

create policy "Users can mark own notifications as read"
  on public.notifications for update
  using (user_id = auth.uid());
