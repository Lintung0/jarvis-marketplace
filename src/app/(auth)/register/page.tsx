"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Mail, RefreshCw } from "lucide-react";

function getReferralCode(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)referral_code=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function RegisterPage() {
  const router = useRouter();
  const { t: tr } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"buyer" | "seller">("buyer");
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const full_name = formData.get("full_name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    if (!full_name || !username || !email || !password || !confirm_password) {
      setError(tr("auth.fill_all_fields"));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (password !== confirm_password) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Hanya huruf kecil, angka, dan underscore");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, username, role: type === "seller" ? "vendor" : "member" },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Link referral if cookie exists
    const refCode = getReferralCode()
    if (refCode && signUpData?.user) {
      try {
        const { setReferredBy } = await import("@/app/actions/affiliates")
        await setReferredBy(refCode)
      } catch {}
      document.cookie = "referral_code=; max-age=0; path=/"
    }

    setRegisteredEmail(email)
    setLoading(false);
  }

  async function handleResend() {
    if (!registeredEmail) return
    setResending(true)
    setResendSent(false)
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: registeredEmail,
    })
    if (error) {
      setError(error.message)
    } else {
      setResendSent(true)
    }
    setResending(false)
  }

  if (registeredEmail) {
    return (
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Cek Inbox Kamu</h1>
          <p className="text-sm text-gray-500 mb-1">
            Kami sudah mengirim link verifikasi ke
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-6">{registeredEmail}</p>

          <button
            onClick={handleResend}
            disabled={resending || resendSent}
            className="inline-flex items-center gap-2 gradient-brand text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Mengirim ulang..." : resendSent ? "Terkirim!" : "Kirim Ulang"}
          </button>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl mt-4">{error}</p>
          )}

          {resendSent && (
            <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-xl mt-4">
              Email verifikasi berhasil dikirim ulang
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Tidak menerima email? Cek folder spam.</p>
            <Link href="/login" className="text-sm text-orange-500 font-semibold hover:text-orange-600">
              Ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-brand">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1a1a2e]">
              Mode<span className="text-orange-500">sy</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{tr("auth.create_account")}</h1>
          <p className="text-gray-500 text-sm mt-1">{tr("auth.join_us")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            {(["buyer", "seller"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setType(item)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={type === item ? { background: "white", color: "#ff6b35", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } : { color: "#6b7280" }}
              >
                {item === "buyer" ? "🛍️ " : "🏪 "}{item === "buyer" ? tr("auth.buyer") : tr("auth.seller")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap</label>
                <input name="full_name" placeholder="John Doe" required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username</label>
                <input name="username" placeholder="johndoe" required pattern="[a-z0-9_]+"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input name="email" type="email" placeholder="kamu@email.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input name="password" type="password" placeholder="Min. 6 karakter" required minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Konfirmasi Password</label>
              <input name="confirm_password" type="password" placeholder="Ulangi password" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60 gradient-brand"
            >
              {loading ? tr("auth.creating_account") : tr("auth.create_account")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {tr("auth.already_have_account")}{" "}
            <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-600">{tr("auth.sign_in_link")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
