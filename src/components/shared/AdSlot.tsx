import { createAdminClient } from "@/lib/supabase/server"

interface AdSlotProps {
  placement: string
}

export default async function AdSlot({ placement }: AdSlotProps) {
  const supabase = createAdminClient()

  const { data: ads } = await supabase
    .from("ad_spaces")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (!ads || ads.length === 0) return null

  return (
    <div className="ad-slot" data-placement={placement}>
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="my-2"
          dangerouslySetInnerHTML={{ __html: ad.code }}
        />
      ))}
    </div>
  )
}
