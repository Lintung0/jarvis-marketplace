-- Fix withdrawals method check constraint
ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_method_check;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_method_check
  CHECK (method IN ('bank_transfer', 'paypal', 'manual'));

-- Add paid_at timestamp
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS policies for withdrawals
CREATE POLICY "Vendors can view own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can create withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Admins can manage all withdrawals"
  ON public.withdrawals FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Fix: Add missing SELECT policy for vendors on orders table
-- Previously vendors could UPDATE but not SELECT orders, breaking order_items joins
CREATE POLICY "Vendors can view orders for their items"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.order_items
      WHERE order_items.order_id = orders.id
      AND order_items.vendor_id = auth.uid()
    )
  );
