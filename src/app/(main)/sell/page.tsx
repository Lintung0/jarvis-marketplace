import Link from "next/link";

export default function SellPage() {
  const steps = [
    { num: "01", title: "Daftar Akun", desc: "Buat akun gratis dan lengkapi profil kamu." },
    { num: "02", title: "Upgrade ke Vendor", desc: "Ajukan upgrade role ke vendor melalui dashboard." },
    { num: "03", title: "Upload Produk", desc: "Tambahkan produk dengan foto, deskripsi, dan harga." },
    { num: "04", title: "Mulai Berjualan", desc: "Terima order dan kelola pengiriman dari dashboard." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Jual di JarvisMarketplace</h1>
        <p className="text-gray-500">Bergabung dengan ribuan vendor dan mulai hasilkan uang hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {steps.map((step) => (
          <div key={step.num} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-3xl font-black text-gray-300 mb-2">{step.num}</p>
            <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#ff6b35] rounded-2xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Siap Mulai Berjualan?</h2>
        <p className="text-orange-100 text-sm mb-6">Gratis daftar, komisi kompetitif, support 24/7.</p>
        <Link
          href="/register"
          className="inline-block bg-white text-orange-500 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
