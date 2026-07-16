import { createAdminClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function EditBrandPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createAdminClient()
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", params.id)
    .maybeSingle()

  if (!brand) notFound()

  async function updateBrand(formData: FormData) {
    "use server"
    const admin = createAdminClient()
    const { error } = await admin
      .from("brands")
      .update({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: (formData.get("description") as string) || null,
        logo_url: (formData.get("logo_url") as string) || null,
        website: (formData.get("website") as string) || null,
      })
      .eq("id", params.id)

    if (error) throw new Error(error.message)
    revalidatePath("/admin/brands")
    revalidatePath(`/admin/brands/${params.id}/edit`)
    redirect("/admin/brands")
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <a href="/admin/brands" className="text-sm text-teal-500 hover:text-teal-600 mb-2 inline-block">&larr; Back to Brands</a>
        <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
        <p className="text-sm text-gray-500 mt-1">{brand.name}</p>
      </div>

      <form action={updateBrand} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Logo URL</label>
            <input name="logo_url" defaultValue={brand.logo_url ?? ""} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="https://logo.clearbit.com/example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input name="website" defaultValue={brand.website ?? ""} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" placeholder="https://example.com" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <a href="/admin/brands" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition">Cancel</a>
          <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all">Save Changes</button>
        </div>
      </form>
    </div>
  )
}
