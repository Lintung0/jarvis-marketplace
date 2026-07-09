-- APP SETTINGS
create table public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table public.settings enable row level security;

create policy "Admins can read settings" on public.settings for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can upsert settings" on public.settings for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can update settings" on public.settings for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

insert into public.settings (key, value) values ('watermark_enabled', 'false') on conflict (key) do nothing;
