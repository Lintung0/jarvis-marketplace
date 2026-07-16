import Link from "next/link"

export default async function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Akun Dibanned</h1>
        <p className="text-gray-500 mb-6">
          Akun kamu telah dinonaktifkan oleh admin. Kamu tidak dapat mengakses fitur-fitur Modesy.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Jika kamu merasa ini adalah kesalahan, silakan hubungi tim support Modesy.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
