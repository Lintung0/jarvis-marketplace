-- SUPPORT TICKETS
create table public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  message text not null,
  status text default 'open' check (status in ('open', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TICKET REPLIES
create table public.ticket_replies (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.tickets enable row level security;
alter table public.ticket_replies enable row level security;

-- Users can see own tickets
create policy "Users can see own tickets"
  on public.tickets for select
  using (user_id = auth.uid());

create policy "Users can insert own tickets"
  on public.tickets for insert
  with check (user_id = auth.uid());

-- Admins can see all tickets
create policy "Admins can see all tickets"
  on public.tickets for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all tickets"
  on public.tickets for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Ticket replies: users can see replies on own tickets
create policy "Users can see replies on own tickets"
  on public.ticket_replies for select
  using (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_replies.ticket_id
      and (tickets.user_id = auth.uid())
    )
  );

create policy "Users can reply to own tickets"
  on public.ticket_replies for insert
  with check (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_replies.ticket_id
      and tickets.user_id = auth.uid()
    )
    and user_id = auth.uid()
  );

-- Admin can see/reply to all ticket replies
create policy "Admins can see all ticket replies"
  on public.ticket_replies for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can reply to all tickets"
  on public.ticket_replies for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
