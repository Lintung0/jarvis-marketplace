export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-200 mb-2">Kebijakan Privasi</h1>
      <p className="text-gray-400 text-xs mb-8">Terakhir diperbarui: Januari 2025</p>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        {[
          { title: "1. Data yang Kami Kumpulkan", content: "Kami mengumpulkan data yang kamu berikan saat registrasi (nama, email), data transaksi, dan data penggunaan untuk meningkatkan layanan." },
          { title: "2. Penggunaan Data", content: "Data digunakan untuk memproses transaksi, mengirim notifikasi, dan meningkatkan pengalaman pengguna. Kami tidak menjual data kamu ke pihak ketiga." },
          { title: "3. Keamanan Data", content: "Kami menggunakan enkripsi SSL dan standar keamanan industri untuk melindungi data kamu. Akses data dibatasi hanya untuk karyawan yang membutuhkan." },
          { title: "4. Cookie", content: "Kami menggunakan cookie untuk menyimpan preferensi dan meningkatkan pengalaman browsing. Kamu dapat menonaktifkan cookie di browser, namun beberapa fitur mungkin tidak berfungsi." },
          { title: "5. Hak Pengguna", content: "Kamu berhak mengakses, mengubah, atau menghapus data pribadi kamu. Hubungi kami di support@modesy.com untuk permintaan terkait data." },
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
