import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../store/CartContext'
import { categories } from '../data/products'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { count, wishlist } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-800 text-gray-300 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Free shipping on orders over $50</span>
          <div className="flex gap-4">
            <Link to="/listings" className="hover:text-white transition-colors">Sell on Modesy</Link>
            <Link to="/account" className="hover:text-white transition-colors">Help</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Poppins', color: '#1a1a2e' }}>
            Mode<span style={{ color: '#ff6b35' }}>sy</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center">
          <select
            className="border border-gray-200 rounded-l-lg px-3 py-2.5 text-sm text-gray-600 bg-gray-50 focus:outline-none cursor-pointer border-r-0"
            onChange={e => e.target.value && navigate(`/listings/${encodeURIComponent(e.target.value)}`)}
            defaultValue=""
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 rounded-l-lg md:rounded-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-white rounded-r-lg flex items-center gap-2 text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/account" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-orange-500 transition-colors">
            <div className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-xs">Wishlist</span>
          </Link>

          <Link to="/cart" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-orange-500 transition-colors">
            <div className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </div>
            <span className="text-xs">Cart</span>
          </Link>

          <Link to="/account" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-orange-500 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs">Account</span>
          </Link>

          <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex overflow-x-auto">
            {categories.map((cat, i) => (
              <li key={cat}>
                <Link
                  to={`/listings/${encodeURIComponent(cat)}`}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-500 whitespace-nowrap border-b-2 border-transparent hover:border-orange-500 transition-all"
                  style={i === 0 ? { color: '#ff6b35', borderBottomColor: '#ff6b35' } : {}}
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link to="/listings" className="flex items-center px-4 py-3 text-sm font-medium text-orange-500 whitespace-nowrap">
                + Sell Something
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/listings/${encodeURIComponent(cat)}`}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
          <hr className="my-2 border-gray-100" />
          <Link to="/login" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          <Link to="/account" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
        </div>
      )}
    </header>
  )
}
