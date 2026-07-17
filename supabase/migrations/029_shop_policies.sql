-- Migration: Add shop_policies column to profiles for vendor shop policies
-- Date: 2026-07-17

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS shop_policies TEXT;

-- Grant access
GRANT ALL ON public.profiles TO authenticated;
