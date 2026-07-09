-- ============================================================
-- SEED ACCOUNTS — Modesy Clone
-- Semua password: password123
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

-- Hapus ON CONFLICT karena auth.users punya constraint khusus
-- Gunakan DELETE + INSERT ulang untuk idempotency

DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
  moderator_id UUID := gen_random_uuid();
  vendor1_id UUID := gen_random_uuid();
  vendor2_id UUID := gen_random_uuid();
  member1_id UUID := gen_random_uuid();
  member2_id UUID := gen_random_uuid();
BEGIN

-- Hapus data lama berdasarkan email (biar bisa jalan berkali-kali)
-- Hapus profiles dulu (karena FK ke auth.users), baru auth.users
DELETE FROM public.profiles WHERE email IN (
  'admin@modesy.com', 'moderator@modesy.com',
  'vendor1@modesy.com', 'vendor2@modesy.com',
  'member1@modesy.com', 'member2@modesy.com'
);
DELETE FROM auth.users WHERE email IN (
  'admin@modesy.com', 'moderator@modesy.com',
  'vendor1@modesy.com', 'vendor2@modesy.com',
  'member1@modesy.com', 'member2@modesy.com'
);

-- ADMIN
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated', 'admin@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Modesy","username":"admin"}', NOW(), NOW(), NOW());

-- MODERATOR
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', moderator_id, 'authenticated', 'authenticated', 'moderator@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Moderator Modesy","username":"moderator"}', NOW(), NOW(), NOW());

-- VENDOR 1
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', vendor1_id, 'authenticated', 'authenticated', 'vendor1@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Toko Elektronik","username":"toko-elektronik"}', NOW(), NOW(), NOW());

-- VENDOR 2
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', vendor2_id, 'authenticated', 'authenticated', 'vendor2@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Fashion Studio","username":"fashion-studio"}', NOW(), NOW(), NOW());

-- MEMBER 1
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', member1_id, 'authenticated', 'authenticated', 'member1@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Santoso","username":"budi"}', NOW(), NOW(), NOW());

-- MEMBER 2
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_sent_at)
VALUES ('00000000-0000-0000-0000-000000000000', member2_id, 'authenticated', 'authenticated', 'member2@modesy.com',
  '$2a$10$Q2dW.9akemHDwKOVc8FZ7ux8d0w4jHtxFV2Pb6V.5cTwxK/AifE4C',
  NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Rahma","username":"siti"}', NOW(), NOW(), NOW());

-- ============================================================
-- 2. UPDATE profiles — set role & data lengkap
-- ============================================================
-- (trigger handle_new_user sudah bikin profiles, tinggal update)

UPDATE public.profiles
SET role = 'admin', full_name = 'Admin Modesy', username = 'admin', is_verified = true, updated_at = NOW()
WHERE email = 'admin@modesy.com';

UPDATE public.profiles
SET role = 'moderator', full_name = 'Moderator Modesy', username = 'moderator', is_verified = true, updated_at = NOW()
WHERE email = 'moderator@modesy.com';

UPDATE public.profiles
SET role = 'vendor', full_name = 'Toko Elektronik', username = 'toko-elektronik', bio = 'Pusat elektronik terpercaya sejak 2020', location = 'Jakarta', is_verified = true, updated_at = NOW()
WHERE email = 'vendor1@modesy.com';

UPDATE public.profiles
SET role = 'vendor', full_name = 'Fashion Studio', username = 'fashion-studio', bio = 'Fashion kekinian dengan kualitas terbaik', location = 'Bandung', is_verified = true, updated_at = NOW()
WHERE email = 'vendor2@modesy.com';

UPDATE public.profiles
SET role = 'member', full_name = 'Budi Santoso', username = 'budi', updated_at = NOW()
WHERE email = 'member1@modesy.com';

UPDATE public.profiles
SET role = 'member', full_name = 'Siti Rahma', username = 'siti', updated_at = NOW()
WHERE email = 'member2@modesy.com';

END $$;

-- ============================================================
-- VERIFIKASI
-- ============================================================
SELECT email, role, full_name, username, is_verified
FROM public.profiles
WHERE email IN ('admin@modesy.com', 'moderator@modesy.com', 'vendor1@modesy.com', 'vendor2@modesy.com', 'member1@modesy.com', 'member2@modesy.com')
ORDER BY role, email;

-- ============================================================
-- LOGIN INFO:
-- admin@modesy.com     / password123  → Admin Panel
-- moderator@modesy.com / password123  → Moderator Panel
-- vendor1@modesy.com   / password123  → Vendor Hub
-- vendor2@modesy.com   / password123  → Vendor Hub
-- member1@modesy.com   / password123  → Member (pembeli)
-- member2@modesy.com   / password123  → Member (pembeli)
-- ============================================================
