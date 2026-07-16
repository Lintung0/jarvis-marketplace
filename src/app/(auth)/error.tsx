"use client";

import Link from "next/link";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">🔐</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Auth</h1>
        <p className="text-gray-500 text-sm mb-6">
          Terjadi kesalahan. Silakan coba lagi.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg, #00a99d, #00b3a1)" }}
          >
            Coba Lagi
          </button>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
