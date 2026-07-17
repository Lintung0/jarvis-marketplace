-- Migration: Create payouts table for vendor withdrawals
-- Date: 2026-07-17

CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    bank_name TEXT,
    account_number TEXT,
    account_holder TEXT,
    notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON public.payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON public.payouts(created_at DESC);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendors can view own payouts" ON public.payouts;
DROP POLICY IF EXISTS "Vendors can create own payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can view all payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can update payouts" ON public.payouts;

CREATE POLICY "Vendors can view own payouts"
    ON public.payouts FOR SELECT
    USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can create own payouts"
    ON public.payouts FOR INSERT
    WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Admins can view all payouts"
    ON public.payouts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admins can update payouts"
    ON public.payouts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

CREATE OR REPLACE FUNCTION public.update_payouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payouts_updated_at ON public.payouts;
CREATE TRIGGER update_payouts_updated_at
    BEFORE UPDATE ON public.payouts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_payouts_updated_at();

GRANT ALL ON public.payouts TO authenticated;
