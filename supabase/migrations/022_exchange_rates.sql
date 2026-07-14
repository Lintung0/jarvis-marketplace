-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS public.exchange_rates (
    currency_code VARCHAR(3) PRIMARY KEY,
    rate_to_idr NUMERIC(15, 4) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rate
INSERT INTO public.exchange_rates (currency_code, rate_to_idr)
VALUES ('USD', 16250.00)
ON CONFLICT (currency_code) DO NOTHING;
