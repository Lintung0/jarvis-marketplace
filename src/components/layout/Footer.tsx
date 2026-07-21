"use client"

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { NewsletterForm } from "@/components/shared/SocialLogin";

function SocialTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.048 0-2.659.76-2.659 2.222v1.749h4.3l-.583 3.667h-3.717v7.98c-3.136.495-6.155-.472-8.655-2.17z" />
    </svg>
  );
}

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function SocialYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const paymentIcons = ["Visa", "MC", "PayPal", "Apple Pay", "Stripe"];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: SocialTwitter, href: "https://x.com", label: "Twitter" },
    { icon: SocialFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: SocialInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: SocialYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  const marketplaceLinks = [
    { label: t("footer.browse_all"), href: "/products" },
    { label: t("footer.sell"), href: "/sell" },
    { label: t("footer.how_it_works"), href: "/help-center" },
    { label: t("footer.pricing_plans"), href: "/membership" },
    { label: t("footer.vendor_dashboard"), href: "/vendor" },
  ];

  const supportLinks = [
    { label: t("footer.help_center"), href: "/help-center" },
    { label: t("footer.contact_us"), href: "/contact" },
    { label: t("footer.report_problem"), href: "/contact" },
    { label: t("footer.refund_policy"), href: "/terms-conditions" },
    { label: t("footer.shipping_info"), href: "/help-center" },
  ];

  const companyLinks = [
    { label: t("footer.about_us"), href: "/about-us" },
    { label: t("footer.careers"), href: "/about-us" },
    { label: t("footer.press"), href: "/about-us" },
    { label: t("footer.blog"), href: "/blog" },
  ];

  const legalLinks = [
    { label: t("footer.privacy_policy"), href: "/privacy-policy" },
    { label: t("footer.terms_of_service"), href: "/terms-conditions" },
    { label: t("footer.cookie_policy"), href: "/privacy-policy" },
    { label: t("footer.accessibility"), href: "/terms-conditions" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-8">
      <div className="gradient-brand py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {t("footer.newsletter_title")}
            </h3>
            <p className="text-teal-100 text-sm mt-1">{t("footer.newsletter_subtitle")}</p>
          </div>
          <div className="flex w-full md:w-auto gap-2 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <Image src="/logo.svg" alt="Modesy" width={120} height={38} className="h-8 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed mb-5 text-gray-500">
              {t("footer.brand_desc")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-teal-500 hover:text-white flex items-center justify-center transition-colors text-gray-400">
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-white font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>RSS Feeds</h4>
              <div className="flex gap-4">
                <a href="/api/rss/products" className="text-xs text-gray-500 hover:text-teal-400 transition-colors" target="_blank" rel="noopener noreferrer">Products</a>
                <a href="/api/rss/blog" className="text-xs text-gray-500 hover:text-teal-400 transition-colors" target="_blank" rel="noopener noreferrer">Blog</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.marketplace")}</h4>
            <ul className="space-y-2.5">
              {marketplaceLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-sm hover:text-teal-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-sm hover:text-teal-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.company")}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-sm hover:text-teal-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.legal")}</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-sm hover:text-teal-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            {t("footer.copyright", { year: String(year) })}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 mr-1">{t("footer.accepted_payments")}</span>
            {paymentIcons.map((p) => (
              <span key={p} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
