"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
        <p className="text-4xl mb-4">📧</p>
        <h1 className="text-xl font-semibold mb-2">Cek Email Kamu</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Link reset password sudah dikirim ke <strong>{email}</strong>.
          Cek inbox atau folder spam kamu.
        </p>
        <Link href="/login" className="text-sm text-primary underline underline-offset-4">
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
      <h1 className="text-2xl font-semibold mb-1">Lupa Password</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Masukkan email kamu, kami akan kirim link reset password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {error && (
          <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>

        <p className="text-sm text-center text-muted-foreground">
          Ingat password?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
