import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new product</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm categories={categories ?? []} />
      </div>
    </div>
  );
}
