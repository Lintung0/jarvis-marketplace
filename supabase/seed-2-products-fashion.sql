-- ============================================
-- PART 2: PRODUCTS - FASHION & PAKAIAN
-- ============================================
-- Run this AFTER part 1

-- Get vendor and category IDs
WITH vendor AS (
  SELECT id FROM profiles WHERE role = 'vendor' LIMIT 1
),
cat_fashion AS (
  SELECT id FROM categories WHERE slug = 'fashion-pakaian' LIMIT 1
),
cat_pria AS (
  SELECT id FROM categories WHERE slug = 'pakaian-pria' LIMIT 1
),
cat_wanita AS (
  SELECT id FROM categories WHERE slug = 'pakaian-wanita' LIMIT 1
),
cat_sepatu AS (
  SELECT id FROM categories WHERE slug = 'sepatu' LIMIT 1
)

-- Insert Fashion Products
INSERT INTO products (vendor_id, category_id, title, slug, description, price, sale_price, stock, type, status, is_featured)
SELECT vendor.id, cat_pria.id,
  'Kaos Polos Premium Cotton Combed 30s',
  'kaos-polos-premium-cotton',
  E'Kaos polos berkualitas tinggi dengan bahan cotton combed 30s. Nyaman dipakai sehari-hari.\n\nSpesifikasi:\n- Bahan: Cotton Combed 30s\n- Gramasi: 180 GSM\n- Sablon: Rubber/Plastisol\n- Jahitan: Obras rapi\n- Ukuran: S, M, L, XL, XXL\n\nKeunggulan:\n✓ Adem dan menyerap keringat\n✓ Tidak mudah berbulu\n✓ Warna tidak mudah pudar\n✓ Jahitan rapih dan kuat',
  89000, 69000, 150, 'physical', 'active', true
FROM vendor, cat_pria

UNION ALL

SELECT vendor.id, cat_pria.id,
  'Kemeja Flanel Lengan Panjang Pria Motif Kotak',
  'kemeja-flanel-pria-kotak',
  E'Kemeja flanel casual dengan motif kotak-kotak yang timeless.\n\nDetail Produk:\n- Material: Cotton Flannel\n- Model: Regular Fit\n- Lengan: Panjang\n- Kancing: Depan penuh\n- Kantong: 2 di depan\n\nCocok untuk:\n- Hangout santai\n- Kuliah\n- Travelling\n- Acara casual',
  175000, 149000, 80, 'physical', 'active', true
FROM vendor, cat_pria

UNION ALL

SELECT vendor.id, cat_pria.id,
  'Celana Jeans Slim Fit Pria Stretch',
  'celana-jeans-slim-fit-pria',
  E'Celana jeans dengan model slim fit yang cocok untuk berbagai acara.\n\nSpesifikasi:\n- Bahan: Denim Stretch\n- Model: Slim Fit\n- Warna: Dark Blue, Light Blue, Black\n- Kantong: 5 pocket\n- Resleting: YKK\n\nFeatures:\n✓ Bahan stretch nyaman\n✓ Tidak mudah melar\n✓ Warna awet\n✓ Cutting modern',
  285000, NULL, 60, 'physical', 'active', false
FROM vendor, cat_pria

UNION ALL

SELECT vendor.id, cat_wanita.id,
  'Dress Midi Wanita Motif Bunga Korean Style',
  'dress-midi-wanita-bunga',
  E'Dress midi dengan motif bunga yang cantik dan feminin.\n\nDetail:\n- Material: Katun Rayon Premium\n- Panjang: Midi (di bawah lutut)\n- Model: A-line\n- Lengan: Pendek\n- Kancing: Depan\n- Variasi: 3 motif bunga\n\nKelebihan:\n✓ Adem dan ringan\n✓ Tidak nerawang\n✓ Jahitan rapi\n✓ Model elegan',
  195000, 169000, 45, 'physical', 'active', true
FROM vendor, cat_wanita

UNION ALL

SELECT vendor.id, cat_wanita.id,
  'Blouse Wanita Lengan Panjang Premium',
  'blouse-wanita-lengan-panjang',
  E'Blouse wanita dengan bahan premium yang nyaman untuk aktivitas sehari-hari.\n\nSpesifikasi:\n- Bahan: Wolfis Premium\n- Lengan: Panjang\n- Model: Loose Fit\n- Kancing: Depan\n- Warna: Putih, Hitam, Navy, Mocca\n\nCocok untuk:\n- Kerja kantoran\n- Kuliah\n- Acara formal\n- Daily wear',
  145000, 129000, 70, 'physical', 'active', false
FROM vendor, cat_wanita

UNION ALL

SELECT vendor.id, cat_wanita.id,
  'Rok Plisket Wanita Premium All Size',
  'rok-plisket-wanita-premium',
  E'Rok plisket dengan bahan premium yang jatuh dan tidak mudah kusut.\n\nDetail Produk:\n- Material: Ceruti Premium\n- Model: Plisket lebar\n- Panjang: 85cm\n- Pinggang: Karet elastis (fit to L)\n- Warna: 8 pilihan warna\n\nKeunggulan:\n✓ Bahan adem dan lembut\n✓ Tidak nerawang\n✓ Plisket rapi awet\n✓ Bisa untuk berbagai acara',
  125000, 99000, 100, 'physical', 'active', true
FROM vendor, cat_wanita

UNION ALL

SELECT vendor.id, cat_sepatu.id,
  'Sneakers Casual Pria Running Sport',
  'sneakers-casual-pria-running',
  E'Sepatu sneakers dengan desain sporty yang nyaman untuk aktivitas sehari-hari.\n\nSpesifikasi:\n- Upper: Mesh Breathable + Synthetic\n- Sole: Rubber Anti-slip\n- Insole: Memory Foam\n- Ukuran: 39-44\n- Berat: 250gr/pcs\n\nFitur:\n✓ Ringan dan nyaman\n✓ Anti-slip\n✓ Breathable\n✓ Cocok untuk jogging\n✓ Desain modern',
  299000, 249000, 50, 'physical', 'active', true
FROM vendor, cat_sepatu

UNION ALL

SELECT vendor.id, cat_sepatu.id,
  'Sandal Slop Pria Kulit Sintetis Premium',
  'sandal-slop-pria-kulit',
  E'Sandal slop casual dengan bahan kulit sintetis premium.\n\nDetail:\n- Bahan: Kulit Sintetis Premium\n- Sol: Karet elastis\n- Ukuran: 39-43\n- Warna: Coklat, Hitam, Tan\n- Model: Casual simple\n\nKeunggulan:\n✓ Nyaman dipakai\n✓ Bahan berkualitas\n✓ Sol empuk\n✓ Awet dan tahan lama\n✓ Cocok untuk santai',
  145000, NULL, 80, 'physical', 'active', false
FROM vendor, cat_sepatu

UNION ALL

SELECT vendor.id, cat_sepatu.id,
  'High Heels Wanita Pantofel 7cm',
  'high-heels-wanita-pantofel',
  E'Sepatu pantofel high heels untuk wanita dengan tinggi 7cm.\n\nSpesifikasi:\n- Bahan: Suede Premium\n- Tinggi: 7cm\n- Model: Pointed Toe\n- Ukuran: 36-40\n- Insole: Soft padding\n\nCocok untuk:\n- Kerja kantoran\n- Pesta\n- Acara formal\n- Wisuda\n\nFeatures:\n✓ Nyaman dipakai seharian\n✓ Bahan lembut\n✓ Heels kuat\n✓ Desain elegan',
  225000, 199000, 35, 'physical', 'active', true
FROM vendor, cat_sepatu;

-- Verify
SELECT 
  p.title, 
  p.slug, 
  p.price, 
  p.sale_price,
  p.stock,
  p.status,
  c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('fashion-pakaian', 'pakaian-pria', 'pakaian-wanita', 'sepatu')
ORDER BY p.created_at DESC;

SELECT COUNT(*) as total_fashion_products FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('fashion-pakaian', 'pakaian-pria', 'pakaian-wanita', 'sepatu');
