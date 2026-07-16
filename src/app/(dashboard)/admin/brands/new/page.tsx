import { createBrand } from "@/app/actions/brands"
import Link from "next/link"

export default function NewBrandPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/brands" className="text-sm text-teal-500 hover:text-teal-600 mb-2 inline-block">&larr; Back to Brands</Link>
        <h1 className="text-2xl font-bold text-gray-900">New Brand</h1>
        <p className="text-sm text-gray-600 mt-1">Add a new brand</p>
      </div>

      <form action={createBrand} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Brand Name</label>
            <input name="name" required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="my-brand" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input name="description" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Logo URL</label>
            <input name="logo_url" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="https://logo.clearbit.com/example.com" />
            <p className="text-xs text-gray-400">Gunakan https://logo.clearbit.com/namaperusahaan.com untuk logo otomatis</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input name="website" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="https://example.com" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/brands" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition">Cancel</Link>
          <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all">Create Brand</button>
        </div>
      </form>
    </div>
  )
}
