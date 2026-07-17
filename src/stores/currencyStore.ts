import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Currency {
  code: string
  name: string
  symbol: string
  rate_to_idr: number
}

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convert: (amountInIdr: number) => number
  format: (amountInIdr: number) => string
}

const defaultCurrency: Currency = {
  code: "IDR",
  name: "Indonesian Rupiah",
  symbol: "Rp",
  rate_to_idr: 1,
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: defaultCurrency,
      setCurrency: (currency) => set({ currency }),
      convert: (amountInIdr) => {
        const { currency } = get()
        return amountInIdr * currency.rate_to_idr
      },
      format: (amountInIdr) => {
        const { currency } = get()
        const converted = amountInIdr * currency.rate_to_idr
        const locale = currency.code === "IDR" ? "id-ID" : "en-US"
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currency.code,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted)
      },
    }),
    {
      name: "modesy-currency",
    }
  )
)

export type { Currency }
