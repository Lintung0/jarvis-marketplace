-- Migration: Create currency_rates table for multi-currency support
-- Date: 2026-07-17

CREATE TABLE IF NOT EXISTS public.currency_rates (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    rate_to_idr NUMERIC(10, 4) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view currency rates"
    ON public.currency_rates FOR SELECT
    USING (true);

-- Seed default currencies
INSERT INTO public.currency_rates (code, name, symbol, rate_to_idr, is_default) VALUES
    ('IDR', 'Indonesian Rupiah', 'Rp', 1.0000, true),
    ('USD', 'US Dollar', '$', 0.000062, false),
    ('EUR', 'Euro', '€', 0.000057, false),
    ('SGD', 'Singapore Dollar', 'S$', 0.000084, false),
    ('MYR', 'Malaysian Ringgit', 'RM', 0.00029, false),
    ('JPY', 'Japanese Yen', '¥', 0.0093, false)
ON CONFLICT (code) DO UPDATE SET
    rate_to_idr = EXCLUDED.rate_to_idr,
    updated_at = now();

GRANT SELECT ON public.currency_rates TO anon;
GRANT ALL ON public.currency_rates TO authenticated;
