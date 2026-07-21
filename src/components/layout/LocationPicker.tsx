"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2, Search, X } from "lucide-react"

interface Location {
  name: string
  lat?: number
  lon?: number
}

const STORAGE_KEY = "jarvis-location"

const popularLocations = [
  { name: "Jakarta" }, { name: "Bandung" }, { name: "Surabaya" },
  { name: "Yogyakarta" }, { name: "Malang" }, { name: "Semarang" },
  { name: "Medan" }, { name: "Makassar" }, { name: "Bali" }, { name: "Palembang" },
]

export default function LocationPicker() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location>({ name: "Indonesia" })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCurrentLocation(JSON.parse(saved))
    } catch {}
  }, [])

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
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}&limit=7&filter=countrycode:id&format=json&lang=id`
      )
      const data = await res.json()
      if (data.results) setSuggestions(data.results)
    } catch {}
    setLoading(false)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const selectLocation = (loc: Location) => {
    setCurrentLocation(loc)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
    setOpen(false)
    setQuery("")
    setSuggestions([])
  }

  const getDisplayName = (result: any) => {
    return result.city || result.county || result.name || result.formatted?.split(",")[0] || ""
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-500 hover:text-teal-600 transition text-xs"
      >
        <MapPin className="w-3 h-3" />
        <span className="truncate max-w-[80px]">{currentLocation.name}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 w-72">
          <div className="px-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Cari kota atau daerah..."
                className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
              {loading ? (
                <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
              ) : (
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              )}
              {query && (
                <button onClick={() => { setQuery(""); setSuggestions([]) }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {query.length >= 2 && suggestions.length > 0 ? (
              suggestions.map((s, i) => {
                const name = getDisplayName(s)
                const sub = s.state || s.county || ""
                return (
                  <button
                    key={i}
                    onClick={() => selectLocation({ name, lat: s.lat, lon: s.lon })}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-700 transition flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{name}</p>
                      {sub && <p className="text-gray-400">{sub}</p>}
                    </div>
                  </button>
                )
              })
            ) : query.length >= 2 && !loading ? (
              <p className="px-3 py-2 text-xs text-gray-400">Lokasi tidak ditemukan</p>
            ) : query.length < 2 ? (
              <>
                <p className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Populer</p>
                {popularLocations.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => selectLocation(loc)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-600 transition flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    {loc.name}
                  </button>
                ))}
                <button
                  onClick={() => selectLocation({ name: "Indonesia" })}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-400 transition flex items-center gap-2 border-t border-gray-100 mt-1"
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  Semua Lokasi (Indonesia)
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
