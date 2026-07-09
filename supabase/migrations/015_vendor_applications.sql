-- Vendor applications flow (member → apply → admin approve → vendor)

create table public.vendor_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  store_name text not null,
  description text,
  reason text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

alter table public.vendor_applications enable row level security;

create policy "Users can see own applications"
  on public.vendor_applications for select
  using (user_id = auth.uid());

create policy "Users can create own application"
  on public.vendor_applications for insert
  with check (user_id = auth.uid());

create policy "Admins can see all applications"
  on public.vendor_applications for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update applications"
  on public.vendor_applications for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
