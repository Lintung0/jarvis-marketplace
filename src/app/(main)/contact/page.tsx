import { ContactForm } from "./ContactForm"

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-200 mb-2">Hubungi Kami</h1>
      <p className="text-gray-500 text-sm mb-8">Ada pertanyaan? Kami siap membantu kamu.</p>

      <ContactForm />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-500">
        <div className="bg-[#0a0a15] rounded-2xl p-4 border border-[#2a2a4a]">
          <p className="text-2xl mb-2">📧</p>
          <p className="font-medium text-gray-300">Email</p>
          <p>support@modesy.com</p>
        </div>
        <div className="bg-[#0a0a15] rounded-2xl p-4 border border-[#2a2a4a]">
          <p className="text-2xl mb-2">💬</p>
          <p className="font-medium text-gray-300">Live Chat</p>
          <p>Senin–Jumat, 09.00–17.00</p>
        </div>
        <div className="bg-[#0a0a15] rounded-2xl p-4 border border-[#2a2a4a]">
          <p className="text-2xl mb-2">📍</p>
          <p className="font-medium text-gray-300">Lokasi</p>
          <p>Indonesia</p>
        </div>
      </div>
    </div>
  )
}
