-- FIX: Add INSERT policy for order_items (blocked by RLS, causing empty items)
create policy "Buyers can create order items for their orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.buyer_id = auth.uid()
    )
  );
