"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, updateProduct } from "@/app/actions/products"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { ImagePlus, X, Loader2, Link as LinkIcon } from "lucide-react"

interface ProductFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    description: string | null
    price: number
    stock: number
    status: string
    category_id?: string | null
    location?: string | null
    images?: { id: string; url: string; alt: string | null; is_primary: boolean }[]
  }
  categories?: { id: string; name: string; slug: string }[]
}

interface ImagePreview {
  type: "file" | "url"
  file?: File
  url: string
  preview: string
  uploading: boolean
}

export function ProductForm({ initialData, categories = [] }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState(initialData?.description || "")
  const existingImages: ImagePreview[] = (initialData?.images ?? []).map((img) => ({
  type: "url" as const,
  file: undefined,
  url: img.url,
  preview: img.url,
  uploading: false,
}))
const [images, setImages] = useState<ImagePreview[]>(existingImages)
  const [urlInput, setUrlInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!initialData?.id

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newImages: ImagePreview[] = Array.from(files).map((file) => ({
      type: "file",
      file,
      url: "",
      preview: URL.createObjectURL(file),
      uploading: false,
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  function handleUrlAdd() {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("Invalid URL. Must start with http:// or https://")
      return
    }
    setImages((prev) => [...prev, {
      type: "url",
      url,
      preview: url,
      uploading: false,
    }])
    setUrlInput("")
    setError(null)
  }

  function removeImage(index: number) {
    if (images[index].type === "file") {
      URL.revokeObjectURL(images[index].preview)
    }
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function uploadImage(img: ImagePreview): Promise<string> {
    if (img.type === "url") return img.url
    const formData = new FormData()
    formData.append("file", img.file!)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(err.error || "Upload failed")
    }
    const data = await res.json()
    return data.url
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSubmitting(true)
    try {
      const imageUrls: string[] = []
      for (let i = 0; i < images.length; i++) {
        if (images[i].type === "file" && !images[i].url) {
          setImages((prev) => {
            const next = [...prev]
            next[i] = { ...next[i], uploading: true }
            return next
          })
          const url = await uploadImage(images[i])
          imageUrls.push(url)
          setImages((prev) => {
            const next = [...prev]
            next[i] = { ...next[i], uploading: false, url }
            return next
          })
        } else {
          imageUrls.push(images[i].url)
        }
      }

      const redirectUrl = initialData?.id
        ? await updateProduct(initialData.id, formData, imageUrls)
        : (formData.set("image_urls", JSON.stringify(imageUrls)), await createProduct(formData))

      window.location.href = redirectUrl
      return
    } catch (e: any) {
      if (isRedirectError(e)) throw e
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Product Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Product Images</h3>

        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden group">
              {img.type === "url" && !img.uploading ? (
                <img src={img.url} alt="" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.png" }}
                />
              ) : (
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
              )}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {img.type === "url" && (
                <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[8px] px-1 rounded">
                  URL
                </span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-orange-500"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] font-medium">Upload</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={urlInputRef}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlAdd())}
              placeholder="Paste image URL..."
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-orange-400 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || submitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            Add URL
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Upload: JPG, PNG, WebP, GIF (max 10MB) &mdash; or paste an external image URL
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Product Title</label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Enter product title"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <div className="relative">
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              required
            />

          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Category</h3>

        <div className="space-y-2">
          <label htmlFor="category_id" className="text-sm font-medium text-gray-700">Product Category</label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={initialData?.category_id || ""}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location</h3>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">Product Location</label>
          <Input
            id="location"
            name="location"
            defaultValue={initialData?.location || ""}
            placeholder="e.g. Jakarta, Indonesia"
          />
          <p className="text-xs text-gray-400">Lokasi produk akan muncul di kartu produk</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Pricing & Stock</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">Price (IDR)</label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={initialData?.price?.toString() || ""}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock Quantity</label>
            <Input
              id="stock"
              name="stock"
              type="number"
              defaultValue={initialData?.stock?.toString() || ""}
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Status</h3>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">Product Status</label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status || "draft"}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
            required
          >
            <option value="draft">Draft (Save as draft)</option>
            <option value="pending">Pending (Awaiting review)</option>
            <option value="active">Active (Visible to customers)</option>
            <option value="hidden">Hidden (Not visible)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <a
          href="/vendor/products"
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {images.some((i) => i.uploading) ? "Uploading images..." : "Saving..."}
            </>
          ) : isEdit ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  )
}
