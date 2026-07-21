"use client"

import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function TrustBadgesSection() {
  const badges = [
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      subtitle: "Worldwide shipping on all orders",
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Payment",
      subtitle: "Protected by escrow & encryption",
    },
    {
      icon: RefreshCw,
      title: "Money Back Guarantee",
      subtitle: "30-day easy return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Dedicated Support",
      subtitle: "Friendly customer service team",
    },
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-teal-50/40 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-teal-600 bg-teal-50">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{badge.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
