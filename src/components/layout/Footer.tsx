"use client"

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { NewsletterForm } from "@/components/shared/SocialLogin";

const paymentIcons = ["Visa", "MC", "PayPal", "Apple Pay", "Stripe"];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

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
              {["twitter", "facebook", "instagram", "youtube"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-teal-500 flex items-center justify-center transition-colors">
                  <span className="text-gray-400 text-xs uppercase">{s.charAt(0)}</span>
                </a>
              ))}
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
              {[t("footer.browse_all"), t("footer.sell"), t("footer.how_it_works"), t("footer.pricing_plans"), t("footer.vendor_dashboard")].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              {[t("footer.help_center"), t("footer.contact_us"), t("footer.report_problem"), t("footer.refund_policy"), t("footer.shipping_info")].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.company")}</h4>
            <ul className="space-y-2.5">
              {[t("footer.about_us"), t("footer.careers"), t("footer.press"), t("footer.blog")].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>{t("footer.legal")}</h4>
            <ul className="space-y-2.5">
              {[t("footer.privacy_policy"), t("footer.terms_of_service"), t("footer.cookie_policy"), t("footer.accessibility")].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">{link}</a>
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
