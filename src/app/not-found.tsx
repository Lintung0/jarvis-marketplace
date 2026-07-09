import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <div className="text-8xl mb-6" role="img" aria-label="Shopping cart">🛒</div>
      <h1 className="text-6xl font-black text-gray-900 mb-3">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md gradient-brand"
        >
          Ke Beranda
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 rounded-xl font-semibold text-sm border-2 hover:bg-orange-50 transition-all"
          style={{ borderColor: "#ff6b35", color: "#ff6b35" }}
        >
          Lihat Produk
        </Link>
      </div>
    </div>
  );
}
