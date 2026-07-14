"use client"

import { useEffect, useState } from "react"
import { useCurrency } from "@/lib/useCurrency"

interface Props {
  amount: number
  className?: string
}

export default function PriceDisplay({ amount, className }: Props) {
  const { currency, formatCurrency } = useCurrency()
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((d) => setRate(d.rate))
      .catch(() => setRate(16250))
  }, [])

  if (rate === null) {
    return <span className={className}>Rp{amount.toLocaleString()}</span>
  }

  const converted = currency === "USD" ? Math.round(amount / rate) : amount

  return <span className={className}>{formatCurrency(converted)}</span>
}
