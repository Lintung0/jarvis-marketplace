"use client"

import { useState } from "react";
import ProductCard from "@/components/shared/ProductCard";
import type { Product } from "@/types";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const tabs = ["featured", "new_arrivals", "best_sellers", "on_sale"];

export default function FeaturedProductsClient({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const displayProducts =
    activeTab === 3
      ? products.filter((p) => p.sale_price && p.sale_price < p.price)
      : activeTab === 1
        ? [...products]
        : activeTab === 2
          ? [...products].sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0))
          : products;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("products.trending_title")}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{t("products.trending_subtitle")}</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === i
                  ? { background: "white", color: "#00a99d", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                  : { color: "#6b7280" }
              }
            >
              {t(`products.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayProducts.slice(0, 12).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block px-8 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-lg hover:bg-teal-500 hover:text-white"
          style={{ borderColor: "#00a99d", color: "#00a99d" }}
        >
          {t("products.view_all")}
        </Link>
      </div>
    </section>
  );
}
