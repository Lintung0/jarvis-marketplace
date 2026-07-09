-- FIX: Add missing RLS policies for order_items
create policy "Buyers can see order items for their orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.buyer_id = auth.uid()
    )
  );

create policy "Vendors can see order items for their products"
  on public.order_items for select
  using (vendor_id = auth.uid());

create policy "Admins can see all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- FIX: Allow buyers to cancel their own pending orders
create policy "Buyers can cancel own pending orders"
  on public.orders for update
  using (buyer_id = auth.uid())
  with check (
    buyer_id = auth.uid()
    and status = 'cancelled'
  );

-- FIX: Allow admin to update all orders
create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- FIX: Allow vendors to update orders they have items in (processing/shipped)
create policy "Vendors can update orders for their items"
  on public.orders for update
  using (
    exists (
      select 1 from public.order_items
      where order_items.order_id = orders.id
      and order_items.vendor_id = auth.uid()
    )
  )
  with check (
    status in ('processing', 'shipped')
  );

-- FIX: Allow moderators to update orders (for refunds)
create policy "Moderators can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'moderator'
    )
  );
