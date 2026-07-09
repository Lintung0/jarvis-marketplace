export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "JarvisMarketplace"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const ROLES = {
  ADMIN: "admin",
  VENDOR: "vendor",
  BUYER: "buyer",
} as const

export const PRODUCT_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  HIDDEN: "hidden",
  DRAFT: "draft",
  REJECTED: "rejected",
} as const

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const

export const PRODUCT_TYPES = {
  PHYSICAL: "physical",
  DIGITAL: "digital",
  LICENSE_KEY: "license_key",
} as const

export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_COMMISSION_RATE = 10

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
]

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Help Center", href: "/help-center" },
    { label: "Terms of Service", href: "/terms-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  sell: [
    { label: "Sell on JarvisMarketplace", href: "/sell" },
    { label: "Vendor Dashboard", href: "/vendor" },
  ],
}
