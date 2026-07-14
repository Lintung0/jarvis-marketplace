export type CurrencyCode = "IDR" | "USD"

interface ExchangeRateResponse {
  base: string
  rates: Record<string, number>
  date: string
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  IDR: "Rp",
  USD: "$",
}

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  IDR: "id-ID",
  USD: "en-US",
}

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  IDR: 16250,
}

let cachedRates: Record<string, number> | null = null
let lastFetch = 0
const CACHE_TTL = 3_600_000

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") return ""
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now()
  if (cachedRates && now - lastFetch < CACHE_TTL) return cachedRates

  try {
    const base = getApiBaseUrl()
    const res = await fetch(`${base}/api/exchange-rate`)
    if (res.ok) {
      const data = await res.json()
      cachedRates = { USD: 1, IDR: data.rate }
      lastFetch = now
      return cachedRates
    }
    throw new Error("Failed to fetch from own API")
  } catch {
    try {
      const res = await fetch("https://api.frankfurter.dev/latest?base=USD")
      if (!res.ok) throw new Error("Failed to fetch rates")
      const data: ExchangeRateResponse = await res.json()
      cachedRates = { ...data.rates, USD: 1 }
      lastFetch = now
      return cachedRates
    } catch {
      cachedRates = FALLBACK_RATES
      lastFetch = now
      return FALLBACK_RATES
    }
  }
}

export async function convertPrice(amountIDR: number, to: CurrencyCode): Promise<number> {
  if (to === "IDR") return Math.round(amountIDR)
  const rates = await getExchangeRates()
  const idrRate = rates["IDR"] ?? FALLBACK_RATES["IDR"] ?? 16250
  return Math.round(amountIDR / idrRate)
}

export function formatCurrency(amount: number, currency: CurrencyCode = "IDR"): string {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString()}`
  }
}

export { CURRENCY_SYMBOLS, CURRENCY_LOCALES }
