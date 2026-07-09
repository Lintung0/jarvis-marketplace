import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { products, sellers } from '../data/products'
import { useCart } from '../store/CartContext'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

const reviews = [
  { id: 1, name: 'Sarah M.', rating: 5, date: 'Jun 28, 2026', comment: 'Absolutely love this! Quality is even better than the photos show. Fast shipping and came well-packaged. Will definitely buy from this seller again.' },
  { id: 2, name: 'James T.', rating: 4, date: 'Jun 15, 2026', comment: 'Great product, exactly as described. Minor delay in shipping but seller was responsive. Highly recommend.' },
  { id: 3, name: 'Priya K.', rating: 5, date: 'May 30, 2026', comment: "Perfect item, perfect price. Seller went above and beyond with packaging. It's clear they take pride in what they sell." },
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const product = products.find(p => p.id === Number(id))
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
      <Link to="/listings" className="text-orange-500 hover:underline">Browse all listings</Link>
    </div>
  )

  const seller = sellers.find(s => s.id === product.sellerId)
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null
  const wished = wishlist.includes(product.id)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <Link to={`/listings/${encodeURIComponent(product.category)}`} className="hover:text-orange-500">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-700 truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-orange-500' : 'border-transparent hover:border-gray-200'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50" style={{ maxHeight: 480 }}>
            <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product info */}
        <div>
          {product.badge && (
            <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: product.badgeColor! }}>
              {product.badge}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug" style={{ fontFamily: 'Poppins' }}>{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{product.condition}</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold" style={{ color: '#ff6b35', fontFamily: 'Poppins' }}>${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
            {discount && <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-semibold">{discount}% off</span>}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Size selector */}
          {product.category === 'Clothing' && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Size: <span className="text-orange-500">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${selectedSize === s ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold text-gray-700">Quantity:</p>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
              <span className="w-10 text-center font-semibold text-gray-800">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ background: added ? '#10b981' : 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button onClick={() => { handleAddToCart(); navigate('/checkout') }}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm border-2 transition-all hover:shadow-md"
              style={{ borderColor: '#ff6b35', color: '#ff6b35' }}>
              Buy Now
            </button>
            <button onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${wished ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? '#ff6b35' : 'none'} stroke={wished ? '#ff6b35' : '#9ca3af'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{tag}</span>
            ))}
          </div>

          {/* Seller card */}
          {seller && (
            <Link to={`/seller/${seller.id}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                {seller.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-800 text-sm">{seller.name}</p>
                  {seller.verified && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="white" strokeWidth="2" fill="none" /><circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.2" /></svg>
                  )}
                </div>
                <p className="text-xs text-gray-500">{seller.sales.toLocaleString()} sales · {seller.rating}★ · {seller.location}</p>
              </div>
              <span className="text-xs text-orange-500 font-medium flex-shrink-0">View Shop →</span>
            </Link>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Customer Reviews</h2>
        <div className="grid gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <StarRating rating={r.rating} size={13} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>More from {product.category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-100 group">
                <div className="h-36 overflow-hidden bg-gray-50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors" style={{ fontFamily: 'Poppins' }}>{p.title}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
