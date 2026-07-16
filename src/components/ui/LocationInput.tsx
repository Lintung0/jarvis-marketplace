"use client"

import { useState, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"

interface GeoResult {
  formatted: string
  city: string | null
  lat: number
  lon: number
}

interface Props {
  defaultValue?: string
  name?: string
  placeholder?: string
}

export default function LocationInput({ defaultValue = "", name = "location", placeholder = "Cari kota..." }: Props) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<GeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(!!defaultValue)
  const hiddenRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function handleInput(val: string) {
    setQuery(val)
    setSelected(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d5d7246fcd0f40449b555b02d9de6643"}&limit=5&type=city&format=json&lang=id`
        )
        const data = await res.json()
        setResults((data.results || []).map((r: any) => ({
          formatted: r.formatted,
          city: r.city || r.formatted.split(",")[0]?.trim(),
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
    setQuery(name)
    setResults([])
    setSelected(true)
    if (hiddenRef.current) {
      hiddenRef.current.value = name
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-9 pr-9 py-2 text-sm focus:border-teal-400 outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />

      {results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
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

      {query && !selected && !loading && results.length === 0 && (
        <p className="text-xs text-red-500 mt-1">Lokasi tidak ditemukan, coba kata kunci lain</p>
      )}
    </div>
  )
}
