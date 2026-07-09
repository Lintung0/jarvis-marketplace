import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { products, categories } from '../data/products'
import { useCart } from '../store/CartContext'

const sortOptions = ['Most Recent', 'Lowest Price', 'Highest Price', 'Highest Rating']
const conditions = ['All', 'New', 'Like New', 'Good']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductListing() {
  const { category } = useParams()
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const [sort, setSort] = useState('Most Recent')
  const [condition, setCondition] = useState('All')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    let list = [...products]
    if (category) list = list.filter(p => p.category === category)
    if (condition !== 'All') list = list.filter(p => p.condition === condition)
    if (priceMin) list = list.filter(p => p.price >= parseFloat(priceMin))
    if (priceMax) list = list.filter(p => p.price <= parseFloat(priceMax))
    if (sort === 'Lowest Price') list.sort((a, b) => a.price - b.price)
    else if (sort === 'Highest Price') list.sort((a, b) => b.price - a.price)
    else if (sort === 'Highest Rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [category, sort, condition, priceMin, priceMax])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <Link to="/listings" className="hover:text-orange-500">Listings</Link>
        {category && <><span>/</span><span className="text-gray-800 font-medium">{category}</span></>}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins' }}>Filters</h3>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
              <div className="space-y-1.5">
                <Link to="/listings" className={`block text-sm py-1 px-2 rounded-lg transition-colors ${!category ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-500'}`}>
                  All Categories
                </Link>
                {categories.map(c => (
                  <Link key={c} to={`/listings/${encodeURIComponent(c)}`}
                    className={`block text-sm py-1 px-2 rounded-lg transition-colors ${category === c ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-500'}`}>
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
                <span className="text-gray-400 text-sm">–</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Condition</p>
              <div className="space-y-1.5">
                {conditions.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className={`w-full text-left text-sm py-1 px-2 rounded-lg transition-colors ${condition === c ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-500'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setCondition('All'); setPriceMin(''); setPriceMax('') }}
              className="w-full text-sm text-gray-500 hover:text-orange-500 transition-colors mt-2">
              Clear all filters
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filtered.length}</span> items found
              {category && <span> in <span className="text-orange-500 font-medium">{category}</span></span>}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                  {sortOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-1 border border-gray-200 rounded-lg p-0.5">
                {(['grid', 'list'] as const).map(m => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === m ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                    {m === 'grid'
                      ? <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold text-gray-600 mb-1">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => {
                const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null
                const wished = wishlist.includes(p.id)
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-orange-100">
                    <Link to={`/product/${p.id}`}>
                      <div className="relative overflow-hidden bg-gray-50" style={{ height: 200 }}>
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {p.badge && (
                          <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: p.badgeColor! }}>{p.badge}</span>
                        )}
                        {discount && (
                          <span className="absolute top-2 right-9 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">-{discount}%</span>
                        )}
                        <button onClick={e => { e.preventDefault(); toggleWishlist(p.id) }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-all">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill={wished ? '#ff6b35' : 'none'} stroke={wished ? '#ff6b35' : '#9ca3af'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>
                    </Link>
                    <div className="p-3">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        {p.location}
                      </p>
                      <Link to={`/product/${p.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-orange-500 transition-colors" style={{ fontFamily: 'Poppins' }}>{p.title}</h3>
                      </Link>
                      <StarRating rating={p.rating} />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-base" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</span>
                          {p.originalPrice && <span className="text-xs text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                        </div>
                        <button onClick={() => addToCart(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-all shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(p => {
                const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null
                const wished = wishlist.includes(p.id)
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex gap-4 p-4">
                    <Link to={`/product/${p.id}`} className="flex-shrink-0">
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-50">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={`/product/${p.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-orange-500 transition-colors" style={{ fontFamily: 'Poppins' }}>{p.title}</h3>
                        </Link>
                        <button onClick={() => toggleWishlist(p.id)} className="flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? '#ff6b35' : 'none'} stroke={wished ? '#ff6b35' : '#9ca3af'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <StarRating rating={p.rating} />
                        <span className="text-xs text-gray-400">({p.reviews})</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.condition}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</span>
                          {p.originalPrice && <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                          {discount && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-semibold">-{discount}%</span>}
                        </div>
                        <button onClick={() => addToCart(p)}
                          className="px-4 py-1.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                          style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
