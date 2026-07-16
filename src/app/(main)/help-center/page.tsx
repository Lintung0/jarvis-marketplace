import Link from "next/link"
import { BookOpen, TicketCheck, ChevronRight } from "lucide-react"

export default function HelpCenterPage() {
  const faqs = [
    { q: "Bagaimana cara membeli produk?", a: "Browse produk, tambahkan ke keranjang, lalu checkout dan bayar via Xendit." },
    { q: "Metode pembayaran apa yang tersedia?", a: "Kami mendukung transfer bank, e-wallet (OVO, GoPay, DANA), dan kartu kredit via Xendit." },
    { q: "Bagaimana cara menjadi vendor?", a: "Daftar akun, lalu ajukan upgrade ke role vendor melalui halaman profil kamu." },
    { q: "Apakah produk digital bisa direfund?", a: "Produk digital umumnya tidak dapat direfund setelah diunduh. Hubungi support untuk kasus khusus." },
    { q: "Berapa lama proses pengiriman?", a: "Tergantung vendor dan lokasi. Estimasi 2-7 hari kerja untuk produk fisik." },
    { q: "Bagaimana cara melacak order?", a: "Buka menu Riwayat Pembelian di akun kamu untuk melihat status order terbaru." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pusat Bantuan</h1>
        <p className="text-gray-500 text-sm">Temukan jawaban untuk pertanyaan yang sering ditanyakan.</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/help-center/kb"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-teal-200 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">Knowledge Base</h3>
              <p className="text-sm text-gray-500">Cari panduan dan tutorial lengkap</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-400 transition shrink-0" />
          </div>
        </Link>
        <Link
          href="/help-center/tickets"
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-teal-200 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
              <TicketCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">Tiket Support</h3>
              <p className="text-sm text-gray-500">Hubungi tim support kami</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-400 transition shrink-0" />
          </div>
        </Link>
      </div>

      {/* Faq */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-500">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-teal-700 mb-3">Tidak menemukan jawaban yang kamu cari?</p>
        <a href="/contact" className="inline-block bg-[#00a99d] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#00998f] transition">
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
