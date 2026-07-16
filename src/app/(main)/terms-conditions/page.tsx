export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-200 mb-2">Syarat & Ketentuan</h1>
      <p className="text-gray-400 text-xs mb-8">Terakhir diperbarui: Januari 2025</p>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        {[
          { title: "1. Penerimaan Syarat", content: "Dengan menggunakan layanan Modesy, kamu menyetujui syarat dan ketentuan ini. Jika tidak setuju, harap tidak menggunakan layanan kami." },
          { title: "2. Akun Pengguna", content: "Kamu bertanggung jawab atas keamanan akun dan semua aktivitas yang terjadi. Jangan bagikan password kamu kepada siapapun." },
          { title: "3. Transaksi", content: "Semua transaksi diproses melalui Xendit. Modesy tidak menyimpan informasi kartu kredit kamu." },
          { title: "4. Konten Pengguna", content: "Kamu bertanggung jawab atas konten yang kamu upload. Konten yang melanggar hukum atau hak cipta akan dihapus." },
          { title: "5. Kebijakan Refund", content: "Refund dapat diajukan dalam 7 hari untuk produk fisik yang tidak sesuai deskripsi. Produk digital tidak dapat direfund setelah diunduh." },
          { title: "6. Perubahan Layanan", content: "Modesy berhak mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya." },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold text-gray-200 mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
