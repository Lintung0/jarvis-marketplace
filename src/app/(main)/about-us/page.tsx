export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-200 mb-2">Tentang JarvisMarketplace</h1>
      <p className="text-gray-500 text-sm mb-8">Marketplace modern untuk jual beli produk fisik, digital, dan lisensi.</p>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <p>
          JarvisMarketplace adalah platform marketplace yang menghubungkan pembeli dan penjual di seluruh Indonesia.
          Kami menyediakan tempat yang aman, mudah, dan terpercaya untuk bertransaksi berbagai jenis produk.
        </p>
        <p>
          Mulai dari produk fisik seperti pakaian dan aksesoris, hingga produk digital seperti template,
          musik, dan grafis — semua bisa kamu temukan di JarvisMarketplace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {[
            { icon: "🛍️", title: "Produk Beragam", desc: "Ribuan produk dari berbagai kategori" },
            { icon: "🔒", title: "Transaksi Aman", desc: "Pembayaran diproteksi via Xendit" },
            { icon: "⚡", title: "Pengiriman Cepat", desc: "Proses order yang mudah dan cepat" },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a0a15] rounded-2xl p-5 text-center">
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="font-semibold text-gray-200 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <p>
          Bergabunglah dengan ribuan vendor dan pembeli yang sudah mempercayai JarvisMarketplace sebagai
          platform jual beli pilihan mereka.
        </p>
      </div>
    </div>
  );
}
