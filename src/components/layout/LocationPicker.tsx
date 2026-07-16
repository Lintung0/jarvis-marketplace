"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Search, Loader2, ChevronDown } from "lucide-react"
import { useLocation } from "@/lib/useLocation"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface GeoResult {
  formatted: string
  city: string | null
  country: string
  lat: number
  lon: number
}

export default function LocationPicker() {
  const { location, setLocation } = useLocation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  function handleInput(val: string) {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d5d7246fcd0f40449b555b02d9de6643"}&limit=6&type=city&format=json&lang=id`
        )
        const data = await res.json()
        setResults((data.results || []).map((r: any) => ({
          formatted: r.formatted,
          city: r.city || r.formatted.split(",")[0]?.trim(),
          country: r.country,
          lat: r.lat,
          lon: r.lon,
        })))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  function selectLocation(r: GeoResult) {
    const name = r.city || r.formatted.split(",")[0]?.trim() || r.formatted
    setLocation({ name, lat: r.lat, lon: r.lon })
    setOpen(false)
    setQuery("")
    setResults([])

    // Simpan ke profile kalo user login
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").update({ location: name, updated_at: new Date().toISOString() }).eq("id", user.id).then()
      }
    })

    // Filter products by this location
    if (pathname === "/products") {
      const params = new URLSearchParams(window.location.search)
      params.set("location", name)
      router.push(`/products?${params.toString()}`)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-teal-500 transition-colors text-xs"
      >
        <MapPin className="w-3 h-3" />
        <span className="max-w-[100px] truncate">{location.name}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="Cari kota/kecamatan..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-teal-400 outline-none"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto border-t border-gray-100">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => selectLocation(r)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.city || r.formatted.split(",")[0]?.trim()}</p>
                      <p className="text-xs text-gray-400">{r.formatted}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query && !loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Lokasi tidak ditemukan</p>
              <p className="text-xs mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
