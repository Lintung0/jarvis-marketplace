"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, Loader2, Search } from "lucide-react"

const popularLocations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Bali",
  "Malang",
  "Semarang",
  "Medan",
  "Makassar",
  "Palembang",
]

export default function LocationPicker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<{ formatted: string; city: string; state: string }[]>([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const currentLocation = searchParams.get("location") || "Indonesia"

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async (text: string) => {
    if (text.length < 2) { setSuggestions([]); return }
    setLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}&limit=5&type=city&format=json&lang=id`
      )
      const data = await res.json()
      if (data.results) {
        setSuggestions(
          data.results.map((r: any) => ({
            formatted: r.formatted,
            city: r.city || r.name || "",
            state: r.state || "",
          }))
        )
      }
    } catch {}
    setLoading(false)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const selectLocation = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (name === "Indonesia") {
      params.delete("location")
    } else {
      params.set("location", name)
    }
    params.delete("page")
    router.push(`/products?${params.toString()}`)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-500 hover:text-teal-600 transition text-xs"
      >
        <MapPin className="w-3 h-3" />
        <span className="truncate max-w-[80px]">{currentLocation}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[250px]">
          {/* Search Input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Cari lokasi..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
              {loading ? (
                <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
              ) : (
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Suggestions / Popular */}
          <div className="max-h-48 overflow-y-auto">
            {query.length >= 2 && suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => selectLocation(s.city || s.formatted)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-600 transition flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{s.city || s.formatted}</p>
                    {s.state && <p className="text-gray-400">{s.state}</p>}
                  </div>
                </button>
              ))
            ) : query.length < 2 ? (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Populer</p>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => selectLocation(loc)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-600 transition flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {loc}
                  </button>
                ))}
                <button
                  onClick={() => selectLocation("Indonesia")}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-600 transition flex items-center gap-2 border-t border-gray-100 mt-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  Semua Lokasi
                </button>
              </div>
            ) : suggestions.length === 0 && query.length >= 2 ? (
              <p className="px-3 py-2 text-xs text-gray-400">Lokasi tidak ditemukan</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
