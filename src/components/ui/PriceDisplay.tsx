"use client"

import { useCurrency } from "@/lib/useCurrency"

const IDR_RATE = 16250

interface Props {
  amount: number
  className?: string
}

export default function PriceDisplay({ amount, className }: Props) {
  const { currency, formatCurrency } = useCurrency()

  const converted = currency === "USD" ? Math.round(amount / IDR_RATE) : amount

  return <span className={className}>{formatCurrency(converted)}</span>
}
