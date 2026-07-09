-- ============================================
-- PART 4: PRODUCTS - GAMING & KOMPUTER
-- ============================================
-- Run this AFTER part 3

WITH vendor AS (
  SELECT id FROM profiles WHERE role = 'vendor' LIMIT 1
),
cat_gaming AS (
  SELECT id FROM categories WHERE slug = 'gaming' LIMIT 1
),
cat_komputer AS (
  SELECT id FROM categories WHERE slug = 'komputer-laptop' LIMIT 1
),
cat_aksesoris AS (
  SELECT id FROM categories WHERE slug = 'aksesoris-komputer' LIMIT 1
)

INSERT INTO products (vendor_id, category_id, title, slug, description, price, sale_price, stock, type, status, is_featured)
SELECT vendor.id, cat_gaming.id,
  'Mouse Gaming Wireless RGB 6 Button 3200 DPI',
  'mouse-gaming-wireless-rgb',
  E'Mouse gaming wireless dengan RGB lighting dan 6 tombol programmable.\n\nSpesifikasi:\n- Sensor: Optical High Precision\n- DPI: 800-3200 (adjustable)\n- Button: 6 programmable\n- Battery: 600mAh rechargeable\n- RGB: 7 color breathing light\n- Polling Rate: 125Hz\n- Wireless: 2.4GHz\n- Range: 10 meter\n\nFitur:\n✓ Silent click\n✓ Ergonomic design\n✓ Anti-slip grip\n✓ Battery indicator\n✓ Macro support\n\nCocok untuk:\n- Gaming FPS/MOBA\n- Design work\n- Office work',
  249000, 199000, 100, 'physical', 'active', true
FROM vendor, cat_gaming

UNION ALL

SELECT vendor.id, cat_gaming.id,
  'Mechanical Keyboard RGB Gaming Outemu Blue',
  'mechanical-keyboard-rgb-gaming',
  E'Keyboard mechanical gaming dengan RGB backlight dan switch Outemu Blue.\n\nSpesifikasi:\n- Switch: Outemu Blue (Clicky)\n- Layout: TKL (87 keys)\n- Backlight: RGB per-key\n- Keycap: ABS Double-shot\n- Cable: 1.8m braided\n- Anti-ghosting: Full key\n- Polling rate: 1000Hz\n\nFeatures:\n✓ Hot-swappable switch\n✓ 18 RGB modes\n✓ Macro programmable\n✓ Win-key lock\n✓ Media control\n✓ Durable (50M clicks)\n\nSwitch Options:\n- Blue: Clicky, tactile\n- Red: Linear, smooth\n- Brown: Tactile, quiet',
  549000, 479000, 60, 'physical', 'active', true
FROM vendor, cat_gaming

UNION ALL

SELECT vendor.id, cat_gaming.id,
  'Gaming Headset RGB 7.1 Surround Microphone',
  'gaming-headset-rgb-surround-mic',
  E'Headset gaming dengan virtual 7.1 surround sound dan RGB LED.\n\nSpesifikasi:\n- Driver: 50mm\n- Impedance: 32Ω\n- Frequency: 20-20KHz\n- Mic: Noise-cancelling\n- Connection: USB + 3.5mm\n- Cable: 2.2m braided\n- RGB: Dynamic lighting\n\nComfort Features:\n✓ Memory foam cushion\n✓ Adjustable headband\n✓ Lightweight (280g)\n✓ Breathable material\n\nCompatible:\n- PC/Laptop\n- PS4/PS5\n- Xbox\n- Nintendo Switch\n- Mobile',
  379000, 319000, 70, 'physical', 'active', true
FROM vendor, cat_gaming

UNION ALL

SELECT vendor.id, cat_gaming.id,
  'Gaming Chair Kursi Gaming Ergonomic Racing',
  'gaming-chair-ergonomic-racing',
  E'Kursi gaming dengan desain racing yang ergonomis dan nyaman.\n\nSpesifikasi:\n- Material: PU Leather Premium\n- Frame: Steel reinforced\n- Gas lift: Class 4\n- Armrest: 3D adjustable\n- Backrest: 90-180° recline\n- Max weight: 150kg\n- Wheels: 60mm PU silent\n\nKenyamanan:\n✓ High-density foam\n✓ Lumbar support pillow\n✓ Neck cushion included\n✓ Adjustable height\n✓ Tilt lock mechanism\n\nWarna:\n- Black/Red\n- Black/Blue\n- Full Black\n- Black/White',
  1899000, 1649000, 25, 'physical', 'active', true
FROM vendor, cat_gaming

UNION ALL

SELECT vendor.id, cat_gaming.id,
  'Mousepad Gaming XXL Extended 90x40cm',
  'mousepad-gaming-xxl-extended',
  E'Mousepad gaming ukuran extra large untuk keyboard + mouse.\n\nSpesifikasi:\n- Ukuran: 90cm x 40cm x 3mm\n- Material: Cloth surface + rubber base\n- Type: Speed surface\n- Edge: Stitched anti-fray\n- Weight: 450gr\n\nKeunggulan:\n✓ Tracking presisi\n✓ Low friction\n✓ Anti-slip base\n✓ Waterproof surface\n✓ Easy to clean\n✓ Portable (rollable)\n\nDesign:\n- World map\n- Abstract RGB\n- Full Black\n- Dragon pattern',
  129000, 99000, 150, 'physical', 'active', false
FROM vendor, cat_gaming

UNION ALL

SELECT vendor.id, cat_komputer.id,
  'Monitor LED 24 Inch Full HD IPS 75Hz',
  'monitor-led-24-inch-fhd-ips',
  E'Monitor LED 24 inch dengan panel IPS dan refresh rate 75Hz.\n\nSpesifikasi:\n- Size: 24 inch (23.8")\n- Resolution: 1920x1080 (Full HD)\n- Panel: IPS\n- Refresh rate: 75Hz\n- Response time: 5ms\n- Contrast: 1000:1\n- Brightness: 250 cd/m²\n- Viewing angle: 178°/178°\n\nConnector:\n- HDMI x2\n- VGA x1\n- Audio out\n\nFitur:\n✓ Flicker-free\n✓ Low blue light\n✓ AMD FreeSync\n✓ VESA mount 100x100\n✓ Adjustable stand\n\nCocok untuk:\n- Gaming casual\n- Office work\n- Design\n- Entertainment',
  1249000, 1099000, 35, 'physical', 'active', true
FROM vendor, cat_komputer

UNION ALL

SELECT vendor.id, cat_aksesoris.id,
  'SSD 512GB M.2 NVMe Gen3 High Speed',
  'ssd-512gb-m2-nvme-gen3',
  E'SSD NVMe M.2 Gen3 dengan kecepatan baca/tulis tinggi.\n\nSpesifikasi:\n- Capacity: 512GB\n- Interface: PCIe Gen3 x4, NVMe 1.3\n- Form factor: M.2 2280\n- Sequential read: 2400 MB/s\n- Sequential write: 1750 MB/s\n- MTBF: 1.5 million hours\n- TBW: 300TB\n- Warranty: 3 years\n\nKeunggulan:\n✓ Boot Windows <10 detik\n✓ Load game lebih cepat\n✓ Silent operation\n✓ Low power consumption\n✓ Shock resistant\n\nCompatible:\n- Desktop PC\n- Laptop\n- PS5 (dengan heatsink)',
  549000, 499000, 80, 'physical', 'active', true
FROM vendor, cat_aksesoris

UNION ALL

SELECT vendor.id, cat_aksesoris.id,
  'RAM DDR4 16GB 3200MHz Gaming Desktop',
  'ram-ddr4-16gb-3200mhz-gaming',
  E'RAM DDR4 16GB dengan frekuensi 3200MHz untuk gaming dan multitasking.\n\nSpesifikasi:\n- Capacity: 16GB (8GB x2)\n- Type: DDR4\n- Frequency: 3200MHz\n- CL: 16-18-18-38\n- Voltage: 1.35V\n- RGB: Yes (sync compatible)\n- Heatspreader: Aluminum\n\nPerforma:\n✓ Dual channel support\n✓ XMP 2.0 ready\n✓ Stable overclock\n✓ Low latency\n\nCompatible:\n- Intel (Z390, Z490, Z590, Z690)\n- AMD (B450, B550, X570)\n\nIdeal untuk:\n- Gaming AAA titles\n- Video editing\n- 3D rendering\n- Streaming',
  849000, 749000, 50, 'physical', 'active', true
FROM vendor, cat_aksesoris

UNION ALL

SELECT vendor.id, cat_aksesoris.id,
  'Webcam Full HD 1080P Autofocus Microphone',
  'webcam-full-hd-1080p-autofocus',
  E'Webcam Full HD dengan autofocus dan microphone built-in.\n\nSpesifikasi:\n- Resolution: 1920x1080 @30fps\n- Sensor: CMOS 2MP\n- Focus: Auto focus\n- Field of view: 90°\n- Mic: Stereo built-in\n- Connection: USB 2.0\n- Mount: Universal clip\n\nFitur:\n✓ Low light correction\n✓ Auto white balance\n✓ Noise reduction\n✓ Plug and play\n✓ Privacy shutter\n\nCocok untuk:\n- WFH/Remote work\n- Online meeting\n- Streaming\n- Content creation\n- Distance learning\n\nCompatible:\n- Windows 7/8/10/11\n- macOS\n- Chrome OS\n- Linux',
  329000, 279000, 90, 'physical', 'active', true
FROM vendor, cat_aksesoris;

-- Verify
SELECT 
  p.title, 
  p.slug, 
  p.price, 
  p.sale_price,
  p.stock,
  c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('gaming', 'komputer-laptop', 'aksesoris-komputer')
ORDER BY p.created_at DESC;

SELECT COUNT(*) as total_gaming_komputer FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('gaming', 'komputer-laptop', 'aksesoris-komputer');
