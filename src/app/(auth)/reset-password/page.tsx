"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
        <p className="text-4xl mb-4">✅</p>
        <h1 className="text-xl font-semibold mb-2">Password Berhasil Diubah</h1>
        <p className="text-sm text-gray-500 mb-6">Kamu akan dialihkan ke halaman login...</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
        <p className="text-4xl mb-4">🔗</p>
        <h1 className="text-xl font-semibold mb-2">Memverifikasi Link...</h1>
        <p className="text-sm text-gray-500">Silakan tunggu sebentar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-semibold mb-1">Reset Password</h1>
      <p className="text-sm text-gray-500 mb-6">Masukkan password baru kamu.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Password Baru</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Konfirmasi Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Masukkan password lagi"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #00a99d, #00b3a1)" }}
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>

        <p className="text-sm text-center text-gray-500">
          <Link href="/login" className="text-teal-500 hover:text-teal-600 underline underline-offset-4">
            Kembali ke Login
          </Link>
        </p>
      </form>
    </div>
  );
}
