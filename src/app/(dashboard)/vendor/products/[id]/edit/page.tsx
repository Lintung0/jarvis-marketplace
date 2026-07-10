import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select(`id, title, slug, description, price, stock, status, category_id,
      images: product_images (id, url, alt, is_primary)`)
    .eq("id", id)
    .eq("vendor_id", user.id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update your product details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm initialData={product} categories={categories ?? []} />
      </div>
    </div>
  );
}
