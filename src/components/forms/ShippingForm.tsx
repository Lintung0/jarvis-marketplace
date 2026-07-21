"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface ShippingAddress {
  full_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

interface Props {
  value: ShippingAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange?: (updates: Partial<ShippingAddress>) => void;
}

interface GeoSuggestion {
  formatted: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  address_line1: string;
}

export function LocationAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  queryType = "city",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (suggestion: GeoSuggestion) => void;
  placeholder?: string;
  queryType?: string;
}) {
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (text: string) => {
    if (text.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}&limit=7&filter=countrycode:id&format=json&lang=id${queryType ? `&type=${queryType}` : ''}`
      );
      const data = await res.json();
      if (data.results) {
        setSuggestions(data.results);
        setOpen(true);
      }
    } catch {}
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pr-9"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelect(s);
                setSuggestions([]);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 hover:text-teal-700 transition flex items-start gap-2 border-b border-gray-100 last:border-0"
            >
              <MapPin className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
              <span>{s.formatted}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShippingForm({ value, onChange, onAddressChange }: Props) {
  const handleAddressSelect = (s: GeoSuggestion) => {
    if (onAddressChange) {
      onAddressChange({
        city: s.city || "",
        state: s.state || "",
        postal_code: s.postcode || "",
        country: s.country || "Indonesia",
        address: s.address_line1 || value.address,
      });
    }
  };

  const handleCitySelect = (s: GeoSuggestion) => {
    if (onAddressChange) {
      onAddressChange({
        city: s.city || s.formatted?.split(",")[0] || "",
        state: s.state || "",
        postal_code: s.postcode || "",
        country: s.country || "Indonesia",
      });
    }
  };

  const handleStateSelect = (s: GeoSuggestion) => {
    if (onAddressChange) {
      onAddressChange({
        state: s.state || s.formatted?.split(",")[0] || "",
        country: s.country || "Indonesia",
      });
    }
  };

  const makeChangeHandler = (field: keyof ShippingAddress) =>
    (val: string) => {
      const syntheticEvent = {
        target: { name: field, value: val },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Nama Lengkap */}
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input
          type="text"
          name="full_name"
          value={value.full_name}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      {/* No. HP */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
        <input
          type="text"
          name="phone"
          value={value.phone}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {/* Negara */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Negara</label>
        <input
          type="text"
          name="country"
          value={value.country}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Alamat dengan autocomplete */}
      <div className="sm:col-span-2">
        <LocationAutocomplete
          label="Alamat"
          value={value.address}
          onChange={makeChangeHandler("address")}
          onSelect={handleAddressSelect}
          placeholder="Cari alamat..."
          queryType="street"
        />
      </div>

      {/* Kota dengan autocomplete */}
      <LocationAutocomplete
        label="Kota"
        value={value.city}
        onChange={makeChangeHandler("city")}
        onSelect={handleCitySelect}
        placeholder="Cari kota..."
        queryType="city"
      />

      {/* Provinsi dengan autocomplete */}
      <LocationAutocomplete
        label="Provinsi"
        value={value.state}
        onChange={makeChangeHandler("state")}
        onSelect={handleStateSelect}
        placeholder="Cari provinsi..."
        queryType="state"
      />

      {/* Kode Pos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
        <input
          type="text"
          name="postal_code"
          value={value.postal_code}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="12345"
        />
      </div>
    </div>
  );
}
