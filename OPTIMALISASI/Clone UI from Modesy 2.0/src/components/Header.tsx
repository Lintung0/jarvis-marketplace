import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../store/CartContext'

const navCategories = [
  { label: 'Clothing', path: 'Clothing' },
  { label: 'Shoes', path: 'Shoes' },
  { label: 'Home & Living', path: 'Home & Living' },
  { label: 'Jewelry & Accessories', path: 'Jewelry' },
  { label: 'Toys & Entertainment', path: 'Toys' },
  { label: 'Graphics & Photos', path: 'Graphics & Photos' },
  { label: 'Video & Audio', path: 'Video & Audio' },
  { label: 'Web Templates & Code', path: 'Web Templates & Code' },
]

const profileMenuItems = [
  {
    label: 'Profile',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Wallet',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Orders',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      </svg>
    ),
  },
  {
    label: 'My Coupons',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: 'Messages',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Profile Settings',
    path: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { count, wishlist } = useCart()
  const navigate = useNavigate()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white sticky top-0 z-50" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

      {/* ── Top utility bar ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-xs text-gray-500">
          {/* Left */}
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
            <span className="text-gray-200">|</span>
            <Link to="/listings" className="hover:text-gray-700 transition-colors">Sell on Modesy</Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Location */}
            <button className="hidden sm:flex items-center gap-1 hover:text-gray-700 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Location
            </button>

            {/* Currency */}
            <button className="hidden sm:flex items-center gap-1 hover:text-gray-700 transition-colors">
              USD ($)
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {/* Language */}
            <button className="hidden sm:flex items-center gap-1 hover:text-gray-700 transition-colors">
              <span className="text-base leading-none">🇺🇸</span>
              English
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {/* Profile dropdown trigger */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-1.5 hover:text-gray-700 transition-colors font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Jesse Joyce
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="transition-transform duration-200"
                  style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl py-1 z-50"
                  style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0' }}
                >
                  {profileMenuItems.map(item => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  {/* Divider + Logout */}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      <span className="text-gray-400">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                      </span>
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main header row ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins', color: '#1a1a2e' }}>
            Modesy
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
          <input
            type="text"
            placeholder="Search for products, categories or brands"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-200 border-r-0 rounded-l-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 border border-gray-200 rounded-r-lg bg-white hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Cart */}
        <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors relative">
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span
              className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-white text-xs font-bold flex items-center justify-center px-1"
              style={{ background: '#ff6b35', fontSize: 10 }}
            >
              {count}
            </span>
          </div>
          <span className="hidden sm:inline text-sm font-medium">Cart</span>
        </Link>

        {/* Wishlist */}
        <Link to="/account" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlist.length > 0 && (
              <span
                className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-white text-xs font-bold flex items-center justify-center px-1"
                style={{ background: '#ff6b35', fontSize: 10 }}
              >
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{wishlist.length}</span>
        </Link>

        {/* Mobile menu toggle */}
        <button className="lg:hidden text-gray-600 ml-1" onClick={() => setMobileMenuOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── Category nav bar ── */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex overflow-x-auto">
            {navCategories.map((cat, i) => (
              <li key={cat.label}>
                <Link
                  to={`/listings/${encodeURIComponent(cat.path)}`}
                  className="flex items-center px-3 py-3 text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap border-b-2 border-transparent hover:border-orange-500 transition-all"
                  style={i === 0 ? { color: '#ff6b35', borderBottomColor: '#ff6b35' } : {}}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="py-2">
            {navCategories.map(cat => (
              <Link
                key={cat.label}
                to={`/listings/${encodeURIComponent(cat.path)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              {profileMenuItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
