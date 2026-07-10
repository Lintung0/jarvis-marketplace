-- Add start_at column to coupons for date range support
alter table public.coupons
  add column if not exists start_at timestamptz;

-- Update RLS policies if any (none for coupons in 001_initial.sql)
