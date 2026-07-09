"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function VerifyContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const email = searchParams.get("email")

  return (
    <div className="text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h1>
            <p className="text-sm text-gray-500 mb-6">
              {error === "missing_hash"
                ? "Link verifikasi tidak valid. Coba daftar ulang."
                : "Terjadi kesalahan saat memverifikasi email kamu."}
            </p>
            <Link
              href="/login"
              className="inline-block gradient-brand text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              Ke Halaman Login
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Email Berhasil Diverifikasi!</h1>
            <p className="text-sm text-gray-500 mb-2">
              Akun kamu sudah aktif. Sekarang kamu bisa login dan mulai berbelanja.
            </p>
            {email && (
              <p className="text-xs text-gray-400 mb-6">
                Email: <span className="text-gray-600 font-medium">{email}</span>
              </p>
            )}
            <Link
              href="/login"
              className="inline-block gradient-brand text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              Login Sekarang
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
