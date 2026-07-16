"use client"

import { useRouter } from "next/navigation"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>

        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-8 h-8 text-teal-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kamu Sedang Offline
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Koneksi internet terputus. Beberapa halaman mungkin tidak dapat diakses
          sampai koneksi kembali.
        </p>

        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 gradient-brand text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
