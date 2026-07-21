-- Migration: Fix infinite recursion in orders/order_items RLS policies
-- Date: 2026-07-19

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Vendors can update orders for their items" ON public.orders;
DROP POLICY IF EXISTS "Buyers can see order items for their orders" ON public.order_items;

-- Recreate the vendor update policy WITHOUT recursion
-- Use a simpler approach: vendor can update if they have items in the order
-- This avoids the circular reference by not joining back to orders in the subquery
CREATE POLICY "Vendors can update orders for their items"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.order_items
      WHERE order_items.order_id = orders.id
      AND order_items.vendor_id = auth.uid()
    )
  )
  WITH CHECK (
    status IN ('processing', 'shipped')
  );

-- Recreate buyer order items select policy without recursion
-- The original policy was recursive because it queried orders table
-- Instead, use the fact that order_items has buyer_id indirectly via orders
-- But we can't avoid the join. Instead, ensure the policies don't create cycles.
-- The issue is: orders UPDATE policy -> queries order_items -> order_items SELECT policy -> queries orders
-- Solution: Make the order_items policy simpler or use SECURITY DEFINER functions

-- For now, drop the problematic order_items policy that causes recursion
-- and recreate it without querying orders table in a way that triggers recursion
DROP POLICY IF EXISTS "Buyers can see order items for their orders" ON public.order_items;

-- This policy causes recursion when combined with orders update policy
-- We need a different approach: use a view or function, or simplify
-- For now, let's make it simpler - just check if the user owns the order via order_id
-- But we can't avoid the join. The real fix is to use SECURITY DEFINER functions
-- or to structure policies so they don't create cycles.

-- Alternative: Create a view for buyer order items that handles the join
-- and grant select on the view instead of the table

-- For immediate fix, let's use a simpler approach for the buyer policy:
-- The recursion happens when:
-- 1. INSERT into orders -> triggers UPDATE policies -> queries order_items
-- 2. order_items SELECT policy queries orders -> triggers UPDATE policies -> infinite loop

-- The fix: Ensure INSERT doesn't trigger UPDATE policies, or use functions
-- Actually, INSERT should not trigger UPDATE policies. The issue might be that
-- the order creation also inserts into order_items in the same transaction.

-- Best fix: Create a SECURITY DEFINER function for order creation
-- that bypasses RLS for the insert, then use RLS only for SELECT/UPDATE

-- For now, let's ensure the basic INSERT policy exists and works:
-- (Already exists in 001_initial: "Buyers can create orders")

-- Let's add a proper fix by creating a function for order creation
-- that runs with SECURITY DEFINER to bypass RLS during insert

CREATE OR REPLACE FUNCTION public.create_order(
  p_buyer_id UUID,
  p_total NUMERIC,
  p_shipping_address JSONB,
  p_payment_method TEXT,
  p_coupon_code TEXT,
  p_discount_amount NUMERIC,
  p_items JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- Create order
  INSERT INTO public.orders (buyer_id, status, total, shipping_address, payment_method, coupon_code, discount_amount)
  VALUES (p_buyer_id, 'pending', p_total, p_shipping_address, p_payment_method, p_coupon_code, p_discount_amount)
  RETURNING id INTO v_order_id;

  -- Insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, vendor_id, title, price, quantity, options)
    VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      (v_item->>'vendor_id')::UUID,
      v_item->>'title',
      (v_item->>'price')::NUMERIC,
      (v_item->>'quantity')::INT,
      v_item->'options'
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.create_order(UUID, NUMERIC, JSONB, TEXT, TEXT, NUMERIC, JSONB) TO authenticated;

-- Also ensure the basic INSERT policy exists (from 001_initial)
-- It should already exist but let's verify by recreating if needed
DROP POLICY IF EXISTS "Buyers can create orders" ON public.orders;
CREATE POLICY "Buyers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Fix the vendor update policy to be non-recursive
-- The current policy works for UPDATE but causes recursion on INSERT
-- because order_items insert triggers the orders update policy evaluation
-- Actually, INSERT shouldn't trigger UPDATE policies. Let me check if there's a trigger.

-- The real issue: When inserting order_items, the orders UPDATE policy is evaluated
-- because the trigger on order_items might update orders.updated_at
-- But we don't have such a trigger. The recursion is likely from:
-- 1. INSERT orders -> RLS evaluates INSERT policy (OK)
-- 2. INSERT order_items -> RLS evaluates order_items SELECT policy -> queries orders
-- 3. Orders UPDATE policy evaluates -> queries order_items -> queries orders -> infinite

-- The fix: Make the order_items SELECT policy NOT query the orders table in a way that triggers UPDATE policies
-- Or use a different approach for vendor access

-- For now, let's simplify the order_items buyer policy to avoid the join
-- that triggers the recursion. We'll use a different approach:
-- Store buyer_id directly on order_items (denormalized) or use a function

-- For immediate fix, let's just drop the recursive policies and use functions
-- for the complex queries, keeping RLS simple

DROP POLICY IF EXISTS "Vendors can see order items for their products" ON public.order_items;
DROP POLICY IF EXISTS "Vendors can see their order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can see all order items" ON public.order_items;

-- Recreate simple policies that don't cause recursion
CREATE POLICY "Vendors can see their order items"
  ON public.order_items FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Admins can see all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Buyers can see their order items via a view or function
-- For now, we'll allow buyers to see order items where they are the buyer
-- This still requires joining orders, but we'll make it a function

CREATE OR REPLACE FUNCTION public.get_buyer_order_items(p_buyer_id UUID)
RETURNS SETOF public.order_items
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT oi.* FROM public.order_items oi
  JOIN public.orders o ON o.id = oi.order_id
  WHERE o.buyer_id = p_buyer_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_buyer_order_items(UUID) TO authenticated;

-- Also create a function for buyers to see their orders with items
CREATE OR REPLACE FUNCTION public.get_buyer_orders(p_buyer_id UUID)
RETURNS TABLE (
  id UUID,
  status TEXT,
  total NUMERIC,
  created_at TIMESTAMPTZ,
  items JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.id,
    o.status,
    o.total,
    o.created_at,
    COALESCE(
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', oi.id,
          'title', oi.title,
          'price', oi.price,
          'quantity', oi.quantity,
          'options', oi.options
        )
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'::JSONB
    ) AS items
  FROM public.orders o
  LEFT JOIN public.order_items oi ON oi.order_id = o.id
  WHERE o.buyer_id = p_buyer_id
  GROUP BY o.id;
$$;

GRANT EXECUTE ON FUNCTION public.get_buyer_orders(UUID) TO authenticated;