"use client"

import { useEffect, useState } from "react"
import { useCurrencyStore, type Currency } from "@/stores/currencyStore"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown } from "lucide-react"

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from("currency_rates").select("*").order("code")
      if (data) setCurrencies(data as Currency[])
    }
    load()
  }, [])

  if (currencies.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-teal-600 transition px-2 py-1 rounded-lg hover:bg-gray-100"
      >
        <span className="font-semibold">{currency.symbol}</span>
        <span>{currency.code}</span>
        <ChevronDown className={`w-3 h-3 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  currency.code === c.code ? "text-teal-600 bg-teal-50 font-semibold" : "text-gray-700"
                }`}
              >
                <span className="w-6 text-center">{c.symbol}</span>
                <span>{c.code}</span>
                <span className="text-gray-400 text-xs ml-auto">{c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
