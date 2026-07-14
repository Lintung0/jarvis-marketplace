"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateExchangeRate(formData: FormData) {
  const rate = parseFloat(formData.get("rate") as string)
  if (isNaN(rate) || rate <= 0) {
    throw new Error("Rate harus angka positif")
  }

  const admin = createAdminClient()
  const { error } = await admin.from("exchange_rates").upsert({
    currency_code: "USD",
    rate_to_idr: rate,
    updated_at: new Date().toISOString(),
  })

  if (error) throw new Error("Gagal menyimpan: " + error.message)

  revalidatePath("/admin/exchange")
}
