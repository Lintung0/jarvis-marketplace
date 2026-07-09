-- Add created_at to order_items (was missing from 001_initial.sql)
alter table public.order_items add column if not exists created_at timestamptz default now();
