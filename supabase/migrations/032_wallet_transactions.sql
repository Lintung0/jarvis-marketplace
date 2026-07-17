-- Migration: Create wallet_transactions table
-- Date: 2026-07-17

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('topup', 'payment', 'refund', 'withdrawal')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON public.wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON public.wallet_transactions;

CREATE POLICY "Users can view own transactions"
    ON public.wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
    ON public.wallet_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_wallet_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_wallet_transactions_updated_at ON public.wallet_transactions;
CREATE TRIGGER update_wallet_transactions_updated_at
    BEFORE UPDATE ON public.wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wallet_transactions_updated_at();

GRANT ALL ON public.wallet_transactions TO authenticated;
