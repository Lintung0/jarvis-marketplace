"use client"

import { useState } from "react"
import { subscribe } from "@/app/actions/membership"
import { Loader2 } from "lucide-react"

interface Props {
  planId: string
  planName: string
  isLoggedIn: boolean
}

export default function SubscribeButton({ planId, planName, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn) {
    return (
      <a
        href={`/login?redirectTo=/membership`}
        className="block w-full text-center py-3 rounded-xl text-sm font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition"
      >
        Login to Subscribe
      </a>
    )
  }

  async function handleClick() {
    setLoading(true)
    try {
      await subscribe(planId)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
        planName === "Pro"
          ? "gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25"
          : "border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : planName === "Free" ? (
        "Activate Free"
      ) : (
        "Choose Plan"
      )}
    </button>
  )
}
