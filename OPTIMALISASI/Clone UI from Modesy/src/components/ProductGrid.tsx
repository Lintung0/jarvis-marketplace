import { useState } from 'react'
import { Link } from 'react-router'
import { products } from '../data/products'
import { useCart } from '../store/CartContext'

const tabs = ['Featured', 'New Arrivals', 'Best Sellers', 'On Sale']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState(0)
  const { addToCart, wishlist, toggleWishlist } = useCart()

  const displayProducts = activeTab === 3
    ? products.filter(p => p.originalPrice)
    : activeTab === 1
      ? [...products].reverse()
      : activeTab === 2
        ? [...products].sort((a, b) => b.reviews - a.reviews)
        : products

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Trending Products</h2>
          <p className="text-gray-500 text-sm mt-0.5">Handpicked items from top sellers</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={activeTab === i
                ? { background: 'white', color: '#ff6b35', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                : { color: '#6b7280' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayProducts.slice(0, 8).map(p => {
          const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null
          const wished = wishlist.includes(p.id)
          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-orange-100">
              <Link to={`/product/${p.id}`}>
                <div className="relative overflow-hidden bg-gray-50" style={{ height: 220 }}>
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: p.badgeColor! }}>{p.badge}</span>
                  )}
                  {discount && (
                    <span className="absolute top-3 right-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                  )}
                  <button onClick={e => { e.preventDefault(); toggleWishlist(p.id) }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-all hover:scale-110">
                    <svg width="15" height="15" viewBox="0 0 24 24"
                      fill={wished ? '#ff6b35' : 'none'} stroke={wished ? '#ff6b35' : '#9ca3af'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {p.location}
                </p>
                <Link to={`/product/${p.id}`}>
                  <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-orange-500 transition-colors" style={{ fontFamily: 'Poppins' }}>{p.title}</h3>
                </Link>
                <StarRating rating={p.rating} />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold" style={{ color: '#ff6b35', fontFamily: 'Poppins' }}>${p.price.toFixed(2)}</span>
                    {p.originalPrice && <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                  </div>
                  <button onClick={() => addToCart(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  </button>
                </div>
                <Link to={`/seller/${p.sellerId}`} className="block mt-2">
                  <p className="text-xs text-gray-400">by <span className="text-orange-400 font-medium hover:underline">{p.seller}</span></p>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <Link to="/listings"
          className="inline-block px-8 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-lg hover:bg-orange-500 hover:text-white"
          style={{ borderColor: '#ff6b35', color: '#ff6b35' }}>
          View All Products
        </Link>
      </div>
    </section>
  )
}
