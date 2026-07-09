import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h1 className="text-6xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Page not found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/" className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md"
          style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
          Go Home
        </Link>
        <Link to="/listings" className="px-6 py-3 rounded-xl font-semibold text-sm border-2 hover:bg-orange-50 transition-all"
          style={{ borderColor: '#ff6b35', color: '#ff6b35' }}>
          Browse Listings
        </Link>
      </div>
    </div>
  )
}
