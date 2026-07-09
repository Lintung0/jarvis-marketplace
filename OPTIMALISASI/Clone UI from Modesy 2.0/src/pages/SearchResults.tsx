import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import { products } from '../data/products'
import { useCart } from '../store/CartContext'

const sortOptions = ['Most Relevant', 'Lowest Price', 'Highest Price', 'Highest Rating']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const [sort, setSort] = useState('Most Relevant')

  const results = useMemo(() => {
    const lower = q.toLowerCase()
    let list = products.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some(t => t.includes(lower)) ||
      p.seller.toLowerCase().includes(lower)
    )
    if (sort === 'Lowest Price') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'Highest Price') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'Highest Rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [q, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm mb-1">Search results for</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
          "{q}"
          <span className="text-gray-400 font-normal text-lg ml-3">{results.length} results</span>
        </h1>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins' }}>No results found</h2>
          <p className="text-gray-400 mb-6">We couldn't find anything matching "{q}"</p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <p className="text-sm text-gray-500 w-full">Try searching for:</p>
            {['clothing', 'shoes', 'furniture', 'sneakers'].map(s => (
              <Link key={s} to={`/search?q=${s}`}
                className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors">
                {s}
              </Link>
            ))}
          </div>
          <Link to="/listings" className="px-6 py-3 rounded-xl text-white font-semibold text-sm inline-block"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
            Browse All Listings
          </Link>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 mb-5">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{results.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                {sortOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(p => {
              const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null
              const wished = wishlist.includes(p.id)
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-orange-100">
                  <Link to={`/product/${p.id}`}>
                    <div className="relative overflow-hidden bg-gray-50" style={{ height: 200 }}>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.badge && <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: p.badgeColor! }}>{p.badge}</span>}
                      {discount && <span className="absolute top-2 right-9 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">-{discount}%</span>}
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
                      <div>
                        <span className="font-bold text-base" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</span>
                        {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${p.originalPrice.toFixed(2)}</span>}
                      </div>
                      <button onClick={() => addToCart(p)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm hover:scale-110 transition-all"
                        style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">by <Link to={`/seller/${p.sellerId}`} className="text-orange-400 hover:underline">{p.seller}</Link></p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
