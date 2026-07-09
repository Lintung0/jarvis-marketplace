# Supabase Seed Scripts

## 📁 File Structure

```
supabase/
├── SEEDING_GUIDE.md                    # 📘 Complete guide & instructions
├── seed-0-schema-setup.sql             # 0️⃣ Database schema setup (RUN FIRST!)
├── seed-1-categories-users.sql         # 1️⃣ Categories & User profiles
├── seed-2-products-fashion.sql         # 2️⃣ Fashion products (9 items)
├── seed-3-products-elektronik.sql      # 3️⃣ Electronics products (9 items)
├── seed-4-products-gaming.sql          # 4️⃣ Gaming & Computer products (9 items)
├── seed-5-product-images.sql           # 5️⃣ Product images (all products)
├── seed-6-reviews.sql                  # 6️⃣ Reviews & statistics
├── verify-seed.sql                     # ✅ Verification queries
├── check-schema.sql                    # 🔍 Check existing schema
└── seed-test-data.sql                  # 🧪 Old test script (ignore)
```

## 🚀 Quick Start

### 1. Read the Guide
```bash
cat SEEDING_GUIDE.md
```

### 2. Run Scripts in Order
Open **Supabase SQL Editor** and run:
0. `seed-0-schema-setup.sql` ⚠️ **RUN THIS FIRST!**
1. `seed-1-categories-users.sql`
2. `seed-2-products-fashion.sql`
3. `seed-3-products-elektronik.sql`
4. `seed-4-products-gaming.sql`
5. `seed-5-product-images.sql`
6. `seed-6-reviews.sql`

### 3. Verify Results
```sql
-- Run verify-seed.sql in SQL Editor
-- Should show 27 products, 19 categories, etc.
```

### 4. Test Application
```bash
npm run dev
# Visit http://localhost:3000
```

## 📊 What Gets Seeded

| Item | Count | Notes |
|------|-------|-------|
| **Categories** | 19 | 10 main + 9 sub-categories |
| **Products** | 27 | Fashion, Electronics, Gaming, Computer |
| **Images** | 50-80 | 1-4 images per product |
| **Reviews** | 8 | For featured products |
| **Vendors** | 1+ | Uses existing profiles |

## 🎯 Product Breakdown

- **Fashion (9):** Kaos, Kemeja, Celana, Dress, Blouse, Rok, Sneakers, Sandal, High Heels
- **Electronics (9):** TWS, Powerbank, Holder HP, Headphone, Speaker, Microphone, Action Cam, Ring Light, Smartwatch
- **Gaming (5):** Mouse, Keyboard, Headset, Gaming Chair, Mousepad
- **Computer (4):** Monitor, SSD, RAM, Webcam

## 🔗 Sample URLs to Test

After seeding, test these URLs:

```
http://localhost:3000/products/kaos-polos-premium-cotton
http://localhost:3000/products/tws-earbuds-bluetooth-wireless
http://localhost:3000/products/mouse-gaming-wireless-rgb
http://localhost:3000/categories/fashion-pakaian
http://localhost:3000/categories/gaming
```

## ⚠️ Important Notes

1. **Run in order** - Scripts depend on previous ones
2. **Check vendors exist** - Need at least 1 user with vendor role
3. **Placeholder images** - All products use `/placeholder-product.png`
4. **Safe to re-run** - Scripts use `ON CONFLICT DO NOTHING`

## 🐛 Troubleshooting

**Error: foreign key constraint**
- Make sure you have at least 1 user in `auth.users`
- Login to app first to auto-create profile

**Products not showing**
- Check RLS policies (see SEEDING_GUIDE.md)
- Verify with `verify-seed.sql`

**Images 404**
- Run: `curl -s "https://placehold.co/600x600/e5e7eb/999999?text=No+Image" -o public/placeholder-product.png`

## 📝 Next Steps

After seeding:
1. ✅ Test all pages (home, products, categories, detail)
2. ✅ Test search & filters
3. ✅ Test add to cart
4. 🚀 Start building Vendor Dashboard (Phase 3)

---

**Created:** 2026-07-06  
**Total SQL Lines:** ~650 lines  
**Data Volume:** Small-Medium (perfect for development)
