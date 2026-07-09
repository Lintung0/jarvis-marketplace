"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, updateProduct } from "@/app/actions/products"
import { generateProductDescription } from "@/app/actions/ai"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { ImagePlus, X, Loader2, Upload } from "lucide-react"

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
  }
  categories?: { id: string; name: string; slug: string }[]
}

interface ImagePreview {
  file: File
  preview: string
  uploading: boolean
  url?: string
}

export function ProductForm({ initialData, categories = [] }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [aiKeywords, setAiKeywords] = useState("")
  const [aiTone, setAiTone] = useState("professional")
  const [description, setDescription] = useState(initialData?.description || "")
  const [images, setImages] = useState<ImagePreview[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!initialData?.id

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newImages: ImagePreview[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(images[index].preview)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function uploadImage(img: ImagePreview): Promise<string> {
    const formData = new FormData()
    formData.append("file", img.file)
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
      if (isEdit) {
        await updateProduct(initialData.id, formData)
        return
      }

      // Upload images first
      const imageUrls: string[] = []
      for (let i = 0; i < images.length; i++) {
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
      }

      // Attach image URLs to form data
      formData.set("image_urls", JSON.stringify(imageUrls))
      await createProduct(formData)
    } catch (e: any) {
      if (isRedirectError(e)) throw e
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGenerateDescription() {
    const titleEl = document.getElementById("title") as HTMLInputElement
    const title = titleEl?.value || initialData?.title || ""
    if (!title) {
      setError("Please enter a product title first")
      return
    }
    setAiLoading(true)
    setError(null)
    try {
      const result = await generateProductDescription({
        title,
        keywords: aiKeywords || undefined,
        tone: aiTone,
      })
      setDescription(result)
      setShowAiDialog(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAiLoading(false)
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
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
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
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-orange-500"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] font-medium">Add Image</span>
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
        <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP, GIF. Max 10MB per image.</p>
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
            <button
              type="button"
              onClick={() => setShowAiDialog(true)}
              className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Generate with AI
            </button>
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

      {showAiDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAiDialog(false)}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-4">Generate Description with AI</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Keywords (optional)</label>
                <input
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="e.g. trendy, murah, berkualitas"
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
