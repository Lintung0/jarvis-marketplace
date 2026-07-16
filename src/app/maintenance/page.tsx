"use client"

import { useState, useEffect } from "react"

export default function MaintenancePage() {
  const estimatedHours = process.env.NEXT_PUBLIC_MAINTENANCE_ESTIMATED_HOURS ?? "3"
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const end = Date.now() + parseInt(estimatedHours) * 60 * 60 * 1000
    function tick() {
      const diff = end - Date.now()
      if (diff <= 0) {
        setTimeLeft("Selesai")
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${h} jam ${m} menit`)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [estimatedHours])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sedang Dalam Pemeliharaan
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Kami sedang melakukan pemeliharaan terjadwal. Maaf atas ketidaknyamanannya.
          Kami akan kembali dalam waktu singkat.
        </p>

        {timeLeft && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 inline-block">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
              Perkiraan selesai
            </p>
            <p className="text-xl font-bold text-gray-900">{timeLeft}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://instagram.com/jarvis"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition-colors"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://twitter.com/jarvis"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition-colors"
            aria-label="Twitter"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
          <a
            href="https://facebook.com/jarvis"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition-colors"
            aria-label="Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Ikuti media sosial kami untuk info terbaru
        </p>
      </div>
    </div>
  )
}
