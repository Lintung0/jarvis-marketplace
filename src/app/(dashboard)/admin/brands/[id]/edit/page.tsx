"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { updateBrand } from "@/app/actions/brands"
import { createClient } from "@/lib/supabase/client"

interface PageProps {
  params: { id: string }
}

export default function EditBrandPage({ params }: PageProps) {
  const router = useRouter()
  const [brand, setBrand] = useState<any>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("brands")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()
      if (data) setBrand(data)
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let logoUrl = formData.get("logo_url") as string
    const logoFile = formData.get("logo_file") as File | null

    if (logoFile && logoFile.size > 0) {
      const supabase = createClient()
      const fileExt = logoFile.name.split(".").pop()
      const fileName = `${formData.get("slug")}-${Date.now()}.${fileExt}`
      const filePath = `brand-logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("brand-logos")
        .upload(filePath, logoFile, { upsert: true })

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("brand-logos")
          .getPublicUrl(filePath)
        logoUrl = publicUrl
      }
    }

    await updateBrand(params.id, {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
      logo_url: logoUrl || undefined,
      website: (formData.get("website") as string) || undefined,
    })

    router.push("/admin/brands")
    router.refresh()
  }

  if (loading) return <div className="max-w-2xl"><p className="text-gray-500">Loading...</p></div>
  if (!brand) return <div className="max-w-2xl"><p className="text-red-500">Brand not found</p></div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/brands" className="text-sm text-teal-500 hover:text-teal-600 mb-2 inline-block">&larr; Back to Brands</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
        <p className="text-sm text-gray-500 mt-1">{brand.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Brand Name</label>
            <input name="name" defaultValue={brand.name} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" defaultValue={brand.slug} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input name="description" defaultValue={brand.description ?? ""} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Logo</label>
          <div className="flex items-center gap-4">
            {(logoPreview || brand.logo_url) && (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-2">
                <img
                  src={logoPreview || brand.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="logo_file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setLogoPreview(URL.createObjectURL(file))
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100"
              />
              <input type="hidden" name="logo_url" defaultValue={brand.logo_url ?? ""} />
              <p className="text-xs text-gray-400 mt-1">Upload logo baru atau biarkan kosong.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Website</label>
          <input name="website" defaultValue={brand.website ?? ""} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="https://example.com" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/brands" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition">Cancel</Link>
          <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all">Save Changes</button>
        </div>
      </form>
    </div>
  )
}
