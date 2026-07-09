"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { CurrencyCode } from "./currency"
import { formatCurrency as fc, convertPrice as cp } from "./currency"

const DEFAULT_CURRENCY: CurrencyCode = "IDR"
const CURRENCY_COOKIE = "jarvis-currency"

function getInitialCurrency(): CurrencyCode {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${CURRENCY_COOKIE}=([^;]+)`));
    if (match) return match[2] as CurrencyCode;
  }
  return DEFAULT_CURRENCY;
}

let currentCurrency: CurrencyCode = getInitialCurrency()
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return currentCurrency
}

export function setCurrency(currency: CurrencyCode) {
  currentCurrency = currency
  if (typeof document !== "undefined") {
    document.cookie = `${CURRENCY_COOKIE}=${currency};path=/;max-age=31536000`
  }
  listeners.forEach((l) => l())
}

export function useCurrency() {
  const currency = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_CURRENCY)

  const convertPrice = useCallback(
    async (amountIDR: number) => cp(amountIDR, currency),
    [currency],
  )

  const formatCurrency = useCallback(
    (amount: number) => fc(amount, currency),
    [currency],
  )

  return { currency, setCurrency, convertPrice, formatCurrency }
}
