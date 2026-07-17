"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"

const popularLocations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Bali",
]

export default function LocationPicker() {
  return (
    <Link
      href="/products"
      className="flex items-center gap-1 text-gray-500 hover:text-teal-600 transition text-xs"
    >
      <MapPin className="w-3 h-3" />
      <span>Indonesia</span>
    </Link>
  )
}
