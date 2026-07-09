-- ============================================
-- PART 3: PRODUCTS - ELEKTRONIK
-- ============================================
-- Run this AFTER part 2

WITH vendor AS (
  SELECT id FROM profiles WHERE role = 'vendor' LIMIT 1
),
cat_elektronik AS (
  SELECT id FROM categories WHERE slug = 'elektronik' LIMIT 1
),
cat_smartphone AS (
  SELECT id FROM categories WHERE slug = 'smartphone' LIMIT 1
),
cat_audio AS (
  SELECT id FROM categories WHERE slug = 'audio' LIMIT 1
),
cat_kamera AS (
  SELECT id FROM categories WHERE slug = 'kamera' LIMIT 1
)

INSERT INTO products (vendor_id, category_id, title, slug, description, price, sale_price, stock, type, status, is_featured)
SELECT vendor.id, cat_smartphone.id,
  'TWS Earbuds Bluetooth 5.3 Wireless Premium',
  'tws-earbuds-bluetooth-wireless',
  E'Earbuds TWS dengan teknologi Bluetooth 5.3 untuk koneksi stabil.\n\nSpesifikasi:\n- Bluetooth: 5.3\n- Battery: 350mAh (case) + 35mAh x2 (earbuds)\n- Playtime: 4-5 jam per charge\n- Total: 24 jam dengan case\n- Driver: 13mm Dynamic\n- Impedance: 32Ω\n- Charging: USB-C\n\nFitur:\n✓ Active Noise Cancellation (ANC)\n✓ Touch Control\n✓ IPX5 Waterproof\n✓ Auto Pairing\n✓ Voice Assistant Support',
  399000, 299000, 120, 'physical', 'active', true
FROM vendor, cat_smartphone

UNION ALL

SELECT vendor.id, cat_smartphone.id,
  'Powerbank 20000mAh Fast Charging 22.5W',
  'powerbank-20000mah-fast-charging',
  E'Powerbank kapasitas besar dengan fast charging untuk smartphone.\n\nSpesifikasi:\n- Kapasitas: 20000mAh\n- Input: USB-C 18W\n- Output: USB-C 22.5W, USB-A 18W\n- Display: LED indicator\n- Material: ABS Premium\n- Berat: 380gr\n\nKeunggulan:\n✓ Charge 3 device bersamaan\n✓ Fast charging support\n✓ Multi-protect safety\n✓ Compact dan portable\n✓ Compatible semua smartphone',
  285000, 249000, 85, 'physical', 'active', true
FROM vendor, cat_smartphone

UNION ALL

SELECT vendor.id, cat_smartphone.id,
  'Holder HP Mobil Universal 360 Derajat',
  'holder-hp-mobil-universal',
  E'Holder smartphone untuk mobil dengan rotasi 360 derajat.\n\nDetail Produk:\n- Material: ABS + Silicone\n- Mount: Dashboard/Windshield\n- Rotasi: 360°\n- Ukuran: 4.0-6.5 inch\n- Grip: Strong suction\n\nFitur:\n✓ Pegangan kuat\n✓ Mudah dipasang\n✓ Tidak merusak dashboard\n✓ Cocok semua HP\n✓ Stabil saat berkendara',
  75000, 59000, 200, 'physical', 'active', false
FROM vendor, cat_smartphone

UNION ALL

SELECT vendor.id, cat_audio.id,
  'Headphone Gaming RGB LED Surround Sound',
  'headphone-gaming-rgb-surround',
  E'Headphone gaming dengan RGB LED dan surround sound 7.1.\n\nSpesifikasi:\n- Driver: 50mm Neodymium\n- Frequency: 20Hz-20KHz\n- Impedance: 32Ω ±15%\n- Sensitivity: 105dB ±3dB\n- Cable: 2.1m braided\n- Connector: USB + 3.5mm\n- Mic: Omnidirectional\n\nFitur Gaming:\n✓ Virtual 7.1 Surround\n✓ RGB LED backlight\n✓ Noise cancelling mic\n✓ Soft ear cushion\n✓ In-line volume control',
  349000, 279000, 65, 'physical', 'active', true
FROM vendor, cat_audio

UNION ALL

SELECT vendor.id, cat_audio.id,
  'Speaker Bluetooth Portable Waterproof Bass',
  'speaker-bluetooth-portable-waterproof',
  E'Speaker bluetooth portable dengan kualitas bass yang powerful.\n\nSpesifikasi:\n- Bluetooth: 5.0\n- Output: 10W stereo\n- Battery: 2400mAh\n- Playtime: 8-10 jam\n- Waterproof: IPX7\n- Range: 10 meter\n- Charging: Micro USB\n\nKeunggulan:\n✓ Suara jernih bass kuat\n✓ Waterproof untuk outdoor\n✓ Battery tahan lama\n✓ Desain compact\n✓ Support TF Card & AUX',
  275000, 229000, 90, 'physical', 'active', true
FROM vendor, cat_audio

UNION ALL

SELECT vendor.id, cat_audio.id,
  'Microphone Condenser USB Streaming Podcast',
  'microphone-condenser-usb-streaming',
  E'Microphone condenser USB untuk streaming, podcast, dan recording.\n\nSpesifikasi:\n- Type: Condenser\n- Polar Pattern: Cardioid\n- Frequency: 20Hz-20KHz\n- Bit Rate: 24bit/192KHz\n- Connection: USB 2.0\n- Compatibility: Windows, Mac, Linux\n\nPaket Termasuk:\n- Microphone\n- Shock mount\n- Pop filter\n- Arm stand\n- USB cable\n\nCocok untuk:\n✓ Streaming game\n✓ Podcast\n✓ Voice over\n✓ Recording musik\n✓ Meeting online',
  549000, 479000, 40, 'physical', 'active', true
FROM vendor, cat_audio

UNION ALL

SELECT vendor.id, cat_kamera.id,
  'Action Camera 4K WiFi Waterproof 30M',
  'action-camera-4k-wifi-waterproof',
  E'Action camera dengan resolusi 4K untuk merekam petualangan Anda.\n\nSpesifikasi:\n- Video: 4K@30fps, 2.7K@60fps, 1080P@120fps\n- Photo: 20MP\n- Sensor: Sony IMX179\n- Lens: 170° wide angle\n- LCD: 2.0 inch\n- Waterproof: 30 meter (dengan case)\n- WiFi: Built-in\n- Battery: 1350mAh\n\nAksesoris Lengkap:\n- Waterproof case\n- Mounting accessories\n- Remote control\n- 2x Battery\n- Charger\n\nIdeal untuk:\n✓ Diving\n✓ Motocross\n✓ Surfing\n✓ Hiking\n✓ Vlogging',
  1299000, 1099000, 30, 'physical', 'active', true
FROM vendor, cat_kamera

UNION ALL

SELECT vendor.id, cat_kamera.id,
  'Ring Light LED 26cm dengan Tripod Stand',
  'ring-light-led-tripod-stand',
  E'Ring light LED untuk fotografi, video call, dan live streaming.\n\nSpesifikasi:\n- Diameter: 26cm (10 inch)\n- LED: 120 pcs\n- Color temp: 3200K-5600K\n- Brightness: 3 mode (warm, natural, cool)\n- Dimmer: 10 level\n- Tripod: 160cm adjustable\n- Power: USB 5V\n\nFitur:\n✓ Cahaya merata\n✓ Anti-glare\n✓ Holder HP included\n✓ Remote shutter\n✓ Mudah diatur\n\nCocok untuk:\n- Makeup tutorial\n- TikTok/Instagram\n- Video call\n- Selfie\n- Product photography',
  349000, 299000, 55, 'physical', 'active', true
FROM vendor, cat_kamera

UNION ALL

SELECT vendor.id, cat_elektronik.id,
  'Smart Watch Fitness Tracker Heart Rate',
  'smart-watch-fitness-tracker',
  E'Smartwatch dengan fitur fitness tracking dan heart rate monitor.\n\nSpesifikasi:\n- Display: 1.4" IPS Touch Screen\n- Resolution: 240x240\n- Battery: 180mAh (7 hari)\n- Waterproof: IP68\n- Bluetooth: 5.0\n- Compatibility: iOS & Android\n\nFitur Kesehatan:\n✓ Heart rate 24/7\n✓ Sleep monitoring\n✓ Blood oxygen\n✓ Step counter\n✓ Calorie tracker\n\nFitur Lainnya:\n- 8 Sport modes\n- Call/message notification\n- Weather forecast\n- Music control\n- Camera remote\n- Find phone',
  499000, 399000, 75, 'physical', 'active', true
FROM vendor, cat_elektronik;

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
WHERE c.slug IN ('elektronik', 'smartphone', 'audio', 'kamera')
ORDER BY p.created_at DESC;

SELECT COUNT(*) as total_elektronik FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug IN ('elektronik', 'smartphone', 'audio', 'kamera');
