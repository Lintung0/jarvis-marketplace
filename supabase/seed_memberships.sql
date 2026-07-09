-- Seed membership plans
insert into public.membership_plans (name, description, price, duration_days, product_limit, featured_products, commission_rate, features) values
(
  'Free',
  'Coba jualan gratis tanpa biaya. Cocok untuk pemula.',
  0, 30, 5, 0, 5.00,
  '["5 produk aktif", "0 produk featured", "Komisi 5% per penjualan", "Akses dashboard dasar", "Dukungan email"]'::jsonb
),
(
  'Pro',
  'Paket terpopuler untuk vendor aktif dengan fitur lengkap.',
  99000, 30, 50, 10, 2.00,
  '["50 produk aktif", "10 produk featured", "Komisi 2% per penjualan", "Statistik penjualan", "Prioritas dukungan", "API akses"]'::jsonb
),
(
  'Enterprise',
  'Solusi bisnis skala besar tanpa batas. Untuk profesional.',
  299000, 30, 999999, 999999, 1.00,
  '["Produk tidak terbatas", "Featured tidak terbatas", "Komisi 1% per penjualan", "Analitik lanjutan", "Dukungan prioritas 24/7", "API akses penuh", "Dedicated account manager"]'::jsonb
);
