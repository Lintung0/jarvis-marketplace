"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapPin, Plus, Home, Briefcase, Building, Star, Trash2, Pencil } from "lucide-react"
import { LocationAutocomplete } from "@/components/forms/ShippingForm"
import { toast } from "sonner"

interface Address {
  id: string
  label: string
  full_name: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

interface Props {
  onSelect: (address: Address) => void
}

const LABEL_ICONS: Record<string, any> = {
  rumah: Home,
  kantor: Briefcase,
  kos: Building,
  kost: Building,
  lainnya: Plus,
}

const LABEL_PRESETS = ["Rumah", "Kantor", "Kos", "Lainnya"]

export default function SavedAddresses({ onSelect }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Indonesia",
  })
  const [customLabel, setCustomLabel] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleAddressSelect = (s: any) => {
    setFormData(prev => ({
      ...prev,
      city: s.city || prev.city,
      state: s.state || prev.state,
      postal_code: s.postcode || prev.postal_code,
      country: s.country || "Indonesia",
      address: s.address_line1 || prev.address,
    }))
  }

  const handleCitySelect = (s: any) => {
    setFormData(prev => ({
      ...prev,
      city: s.city || s.formatted?.split(",")[0] || "",
      state: s.state || prev.state,
      postal_code: s.postcode || prev.postal_code,
      country: s.country || "Indonesia",
    }))
  }

  const handleStateSelect = (s: any) => {
    setFormData(prev => ({
      ...prev,
      state: s.state || s.formatted?.split(",")[0] || "",
      country: s.country || "Indonesia",
    }))
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    const supabase = createClient()
    const { data } = await supabase
      .from("user_addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
    if (data) setAddresses(data as Address[])
    setLoading(false)
  }

  async function handleSubmit() {
    const label = formData.label === "Lainnya" ? customLabel : formData.label
    if (!label || !formData.full_name || !formData.phone || !formData.address || !formData.city) {
      toast.error("Lengkapi semua field yang wajib")
      return
    }

    setSubmitting(true)
    const supabase = createClient()

      const payload = { ...formData }
      if (editingId) {
        await supabase
          .from("user_addresses")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editingId)
        toast.success("Alamat diupdate")
      } else {
        await supabase
          .from("user_addresses")
          .insert([{ ...payload }])
        toast.success("Alamat ditambahkan")
      }

    setSubmitting(false)
    setShowForm(false)
    setEditingId(null)
    resetForm()
    loadAddresses()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus alamat ini?")) return
    const supabase = createClient()
    await supabase.from("user_addresses").delete().eq("id", id)
    loadAddresses()
  }

  async function handleSetDefault(id: string) {
    const supabase = createClient()
    await supabase.from("user_addresses").update({ is_default: false }).neq("id", id)
    await supabase.from("user_addresses").update({ is_default: true }).eq("id", id)
    loadAddresses()
  }

  function editAddress(addr: Address) {
    setFormData({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
    })
    setEditingId(addr.id)
    setShowForm(true)
  }

  function resetForm() {
    setFormData({ label: "", full_name: "", phone: "", address: "", city: "", state: "", postal_code: "", country: "Indonesia" })
    setCustomLabel("")
  }

  function getLabelIcon(label: string) {
    const icon = LABEL_ICONS[label.toLowerCase()]
    return icon || MapPin
  }

  if (loading) return <div className="text-center py-4 text-gray-400 text-sm">Memuat alamat...</div>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Alamat Tersimpan</h3>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); resetForm() }}
          className="text-xs text-teal-500 hover:text-teal-600 font-medium flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Tambah Baru
        </button>
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 text-center py-4">Belum ada alamat tersimpan. Tambah alamat baru untuk checkout lebih cepat.</p>
      )}

      <div className="space-y-2">
        {addresses.map((addr) => {
          const Icon = getLabelIcon(addr.label)
          return (
            <div
              key={addr.id}
              className="relative group bg-white border border-gray-200 rounded-xl p-3 hover:border-teal-300 transition cursor-pointer"
              onClick={() => { onSelect(addr); toast.success(`Menggunakan alamat: ${addr.label}`) }}
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{addr.label}</span>
                    {addr.is_default && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{addr.full_name} - {addr.phone}</p>
                  <p className="text-xs text-gray-500 truncate">{addr.address}, {addr.city}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); editAddress(addr) }}
                  className="p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {!addr.is_default && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id) }}
                    className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded"
                    title="Jadikan utama"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(addr.id) }}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? "Edit Alamat" : "Alamat Baru"}
            </h2>
            <div className="space-y-3">
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <div className="flex flex-wrap gap-2">
                  {LABEL_PRESETS.map((preset) => {
                    const Icon = getLabelIcon(preset)
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({ ...formData, label: preset })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          formData.label === preset
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {preset}
                      </button>
                    )
                  })}
                </div>
                {formData.label === "Lainnya" && (
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Nama label (contoh: Toko)"
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                )}
              </div>

              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Nama Lengkap *" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="No. HP *" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              <div className="sm:col-span-2">
                <LocationAutocomplete
                  label="Alamat"
                  value={formData.address}
                  onChange={(val) => setFormData(prev => ({ ...prev, address: val }))}
                  onSelect={handleAddressSelect}
                  placeholder="Cari alamat..."
                  queryType="street"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <LocationAutocomplete
                  label="Kota"
                  value={formData.city}
                  onChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                  onSelect={handleCitySelect}
                  placeholder="Cari kota..."
                  queryType="city"
                />
                <LocationAutocomplete
                  label="Provinsi"
                  value={formData.state}
                  onChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                  onSelect={handleStateSelect}
                  placeholder="Cari provinsi..."
                  queryType="state"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} placeholder="Kode Pos" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Negara" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null) }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
