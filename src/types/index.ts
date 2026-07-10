export type Role = "member" | "vendor" | "moderator" | "admin"
export type ProductType = "physical" | "digital" | "license_key"
export type ProductStatus = "pending" | "active" | "hidden" | "draft" | "rejected"
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid"
export type BannerPlacement = "hero" | "top" | "middle" | "bottom" | "sidebar"

export interface Profile {
  id: string
  username: string
  full_name: string | null
  email: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  role: Role
  is_verified: boolean
  is_banned: boolean
  balance: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  children?: Category[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  sort_order: number
  is_primary: boolean
}

export interface ProductOption {
  id: string
  product_id: string
  name: string
  values: string[]
  price_modifier: number
}

export interface Product {
  id: string
  vendor_id: string
  category_id: string | null
  brand_id: string | null
  title: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  stock: number
  type: ProductType
  status: ProductStatus
  is_featured: boolean
  commission_rate: number | null
  tags: string[] | null
  location: string | null
  views: number
  sold_count: number
  created_at: string
  updated_at: string
  vendor?: Profile
  category?: Category
  images?: ProductImage[]
  options?: ProductOption[]
  reviews?: Review[]
  avg_rating?: number
  review_count?: number
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  options: Record<string, string> | null
  created_at: string
  product?: Product
}

// Client-side cart item (for Zustand store)
export interface ClientCartItem {
  id: string
  product_id: string
  product_title: string
  product_slug: string
  product_image: string
  product_type: "physical" | "digital" | "license_key"
  vendor_id: string
  price: number
  quantity: number
  options: Record<string, string> | null
}

export interface Order {
  id: string
  buyer_id: string
  status: OrderStatus
  total: number
  shipping_address: ShippingAddress | null
  payment_method: string | null
  payment_id: string | null
  coupon_code: string | null
  discount_amount: number
  notes: string | null
  created_at: string
  updated_at: string
  buyer?: Profile
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  vendor_id: string | null
  title: string
  price: number
  quantity: number
  options: Record<string, string> | null
  commission_rate: number | null
  vendor_earning: number | null
  created_at?: string
  product?: {
    id: string
    slug: string
    images?: { url: string; is_primary: boolean }[]
  }
}

export interface ShippingAddress {
  full_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  user?: Profile
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  start_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface Withdrawal {
  id: string
  vendor_id: string
  amount: number
  method: "paypal" | "iban" | "swift"
  account_details: Record<string, string>
  status: WithdrawalStatus
  notes: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  author_id: string | null
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  status: "draft" | "published"
  tags: string[] | null
  views: number
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Banner {
  id: string
  title: string | null
  image_url: string
  link: string | null
  placement: BannerPlacement
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface KBCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  created_at: string
  article_count?: number
}

export interface KBArticle {
  id: string
  category_id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  is_published: boolean
  views: number
  created_at: string
  updated_at: string
  category?: KBCategory
}

export type TicketStatus = "open" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"

export interface Ticket {
  id: string
  user_id: string
  subject: string
  message: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  updated_at: string
  user?: Profile
  replies?: TicketReply[]
}

export interface TicketReply {
  id: string
  ticket_id: string
  user_id: string
  message: string
  created_at: string
  user?: Profile
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type CommissionStatus = "pending" | "approved" | "paid"

export interface AffiliateProfile {
  id: string
  referral_code: string
  commission_rate: number
  total_earnings: number
  total_clicks: number
  total_conversions: number
  referred_by: string | null
  created_at: string
  profile?: Profile
}

export interface AffiliateClick {
  id: string
  affiliate_id: string
  ip_address: string | null
  user_agent: string | null
  referrer_url: string | null
  product_id: string | null
  created_at: string
}

export interface AffiliateConversion {
  id: string
  click_id: string | null
  affiliate_id: string
  order_id: string
  commission_amount: number
  status: CommissionStatus
  created_at: string
  paid_at: string | null
  order?: Order
}

export type SubscriptionStatus = "active" | "expired" | "cancelled"

export interface MembershipPlan {
  id: string
  name: string
  description: string | null
  price: number
  duration_days: number
  product_limit: number
  featured_products: number
  commission_rate: number
  is_active: boolean
  features: string[]
  created_at: string
}

export type AdPlacement = "header" | "footer" | "sidebar" | "between_products"

export interface AdSpace {
  id: string
  name: string
  placement: AdPlacement
  code: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website: string | null
  is_active: boolean
  created_at: string
}

export interface VendorSubscription {
  id: string
  vendor_id: string
  plan_id: string
  status: SubscriptionStatus
  start_date: string
  end_date: string
  payment_id: string | null
  created_at: string
  updated_at: string
  plan?: MembershipPlan
  vendor?: Profile
}
