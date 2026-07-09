import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { sellers, products } from '../data/products'
import { useCart } from '../store/CartContext'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function SellerProfile() {
  const { id } = useParams()
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const seller = sellers.find(s => s.id === Number(id))
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings')

  if (!seller) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Seller not found</h2>
      <Link to="/listings" className="text-orange-500 hover:underline">Browse all listings</Link>
    </div>
  )

  const sellerProducts = products.filter(p => p.sellerId === seller.id)

  const tabs = [
    { key: 'listings', label: `Listings (${sellerProducts.length})` },
    { key: 'reviews', label: 'Reviews' },
    { key: 'about', label: 'About' },
  ] as const

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Seller header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-32 w-full" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }} />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #333)' }}>
              {seller.avatar}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{seller.name}</h1>
                {seller.verified && (
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Verified Seller
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {seller.location} · Member since {seller.joined}
              </p>
            </div>
            <button className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex-shrink-0 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              Follow Shop
            </button>
          </div>

          <div className="flex gap-8 mt-5 pt-5 border-t border-gray-100">
            {[
              { label: 'Sales', value: seller.sales.toLocaleString() },
              { label: 'Rating', value: `${seller.rating}/5.0` },
              { label: 'Listings', value: sellerProducts.length },
              { label: 'Response Rate', value: '98%' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={activeTab === t.key
              ? { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: 'white' }
              : { color: '#6b7280' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'listings' && (
        sellerProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold">No listings yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellerProducts.map(p => {
              const wished = wishlist.includes(p.id)
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-orange-100">
                  <Link to={`/product/${p.id}`}>
                    <div className="relative overflow-hidden bg-gray-50" style={{ height: 200 }}>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.badge && <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: p.badgeColor! }}>{p.badge}</span>}
                      <button onClick={e => { e.preventDefault(); toggleWishlist(p.id) }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-all">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={wished ? '#ff6b35' : 'none'} stroke={wished ? '#ff6b35' : '#9ca3af'} strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={`/product/${p.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-500 mb-2 transition-colors" style={{ fontFamily: 'Poppins' }}>{p.title}</h3>
                    </Link>
                    <StarRating rating={p.rating} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-base" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</span>
                      <button onClick={() => addToCart(p)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm hover:scale-110 transition-all"
                        style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-2xl">
          {[
            { name: 'Alex R.', rating: 5, date: 'Jul 1, 2026', comment: `${seller.name} is fantastic! Super fast shipping and item was exactly as described. The packaging was beautiful.` },
            { name: 'Monica B.', rating: 5, date: 'Jun 20, 2026', comment: "Excellent seller. Very responsive and shipped next day. Will definitely order again." },
            { name: 'David L.', rating: 4, date: 'Jun 5, 2026', comment: "Good experience overall. Product quality was great, minor delay in communication but resolved quickly." },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-xl bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: 'Poppins' }}>About {seller.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{seller.bio}</p>
          <div className="space-y-3">
            {[
              { label: 'Location', value: seller.location },
              { label: 'Member since', value: seller.joined },
              { label: 'Total sales', value: `${seller.sales.toLocaleString()} orders` },
              { label: 'Average rating', value: `${seller.rating} / 5.0` },
              { label: 'Response rate', value: '98%' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
