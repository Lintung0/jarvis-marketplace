"use client"

import { useCurrencyStore } from "@/stores/currencyStore"

interface Props {
  amount: number
  className?: string
}

export default function PriceDisplay({ amount, className }: Props) {
  const formatted = useCurrencyStore((s) => s.format(amount))

  return <span className={className}>{formatted}</span>
}
