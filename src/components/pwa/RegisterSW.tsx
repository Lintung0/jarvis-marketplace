"use client"

import { useEffect, useState } from "react"
import { X, RefreshCw } from "lucide-react"

export default function RegisterSW() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js")

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true)
              setWaitingWorker(newWorker)
            }
          })
        })
      } catch {
        // service worker registration failed silently
      }
    }

    registerSW()

    let refreshing = false
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    }
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            Update tersedia
          </p>
          <p className="text-xs text-gray-500">
            Versi baru JarvisMarketplace siap diinstal
          </p>
        </div>
        <button
          onClick={handleUpdate}
          className="shrink-0 gradient-brand text-white text-xs font-semibold px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all"
        >
          Update
        </button>
        <button
          onClick={() => setUpdateAvailable(false)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
