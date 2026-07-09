"use client"

import { useCurrency } from "@/lib/useCurrency";
import { CURRENCY_SYMBOLS } from "@/lib/currency";

const currencies = ["IDR", "USD"] as const;

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "IDR" | "USD";
    setCurrency(val);
    // Reload to apply currency to server components
    window.location.reload();
  };

  return (
    <select
      value={currency}
      onChange={handleChange}
      className="bg-transparent text-gray-300 text-xs focus:outline-none cursor-pointer hover:text-white transition-colors"
    >
      {currencies.map((c) => (
        <option key={c} value={c} className="text-gray-800">
          {CURRENCY_SYMBOLS[c]} {c}
        </option>
      ))}
    </select>
  );
}
