-- Seed brands with Clearbit logos
INSERT INTO public.brands (name, slug, description, logo_url, website, is_active) VALUES
('Samsung', 'samsung', 'Electronics & Technology', 'https://logo.clearbit.com/samsung.com', 'https://samsung.com', true),
('Apple', 'apple', 'Consumer Electronics', 'https://logo.clearbit.com/apple.com', 'https://apple.com', true),
('Sony', 'sony', 'Electronics & Entertainment', 'https://logo.clearbit.com/sony.com', 'https://sony.com', true),
('Nike', 'nike', 'Sportswear & Footwear', 'https://logo.clearbit.com/nike.com', 'https://nike.com', true),
('Adidas', 'adidas', 'Sportswear & Footwear', 'https://logo.clearbit.com/adidas.com', 'https://adidas.com', true),
('ASUS', 'asus', 'Computer Hardware', 'https://logo.clearbit.com/asus.com', 'https://asus.com', true),
('Xiaomi', 'xiaomi', 'Consumer Electronics', 'https://logo.clearbit.com/xiaomi.com', 'https://xiaomi.com', true),
('Logitech', 'logitech', 'Computer Peripherals', 'https://logo.clearbit.com/logitech.com', 'https://logitech.com', true),
('LG', 'lg', 'Electronics & Home Appliances', 'https://logo.clearbit.com/lg.com', 'https://lg.com', true),
('Lenovo', 'lenovo', 'Computers & Laptops', 'https://logo.clearbit.com/lenovo.com', 'https://lenovo.com', true)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  is_active = true;
