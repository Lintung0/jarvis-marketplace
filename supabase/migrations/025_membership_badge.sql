-- Add plan_name to profiles for membership badge display
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_name TEXT;
