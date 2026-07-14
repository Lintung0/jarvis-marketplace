"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { GoogleLoginButton } from "@/components/shared/SocialLogin";
import { useTranslation } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(t("auth.fill_all_fields"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if user is banned
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned")
        .eq("id", data.user.id)
        .single()

      if (profile?.is_banned) {
        await supabase.auth.signOut()
        setError("Akun kamu telah diban. Silakan hubungi admin.")
        setLoading(false)
        return
      }
    }

    router.refresh();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-brand">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1a1a2e]">
              Mode<span className="text-orange-500">sy</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t("auth.welcome_back")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("auth.sign_in_to_continue")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("auth.email")}</label>
              <input
                name="email"
                type="email"
                placeholder="you@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              {/* <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-gray-600">{t("auth.password")}</label>
                <a href="#" className="text-xs text-orange-500 hover:text-orange-600">{t("auth.forgot_password")}</a>
              </div> */}
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60 gradient-brand"
            >
              {loading ? t("auth.signing_in") : t("auth.sign_in")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{t("auth.or_continue_with")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleLoginButton />

          <p className="text-center text-sm text-gray-500 mt-5">
            {t("auth.no_account")}{" "}
            <Link href="/register" className="text-orange-500 font-semibold hover:text-orange-600">{t("auth.sign_up_free")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
