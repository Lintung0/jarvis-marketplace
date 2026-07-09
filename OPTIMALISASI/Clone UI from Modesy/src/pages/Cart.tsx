import { Link, useNavigate } from 'react-router'
import { useCart } from '../store/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛍️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins' }}>Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/listings" className="px-6 py-3 rounded-xl text-white font-semibold inline-block hover:opacity-90 transition-all"
        style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
        Browse Products
      </Link>
    </div>
  )

  const shipping = total >= 50 ? 0 : 5.99
  const tax = total * 0.08
  const grandTotal = total + shipping + tax

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
          Shopping Cart <span className="text-gray-400 text-lg">({items.length} items)</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product: p, quantity, size }) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
              <Link to={`/product/${p.id}`} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-semibold text-gray-800 text-sm hover:text-orange-500 transition-colors line-clamp-2" style={{ fontFamily: 'Poppins' }}>{p.title}</h3>
                  </Link>
                  <button onClick={() => removeFromCart(p.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {size && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Size: {size}</span>}
                  <span className="text-xs text-gray-400">{p.condition}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(p.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button onClick={() => updateQty(p.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">+</button>
                  </div>
                  <span className="font-bold text-base" style={{ color: '#ff6b35', fontFamily: 'Poppins' }}>
                    ${(p.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 text-lg" style={{ fontFamily: 'Poppins' }}>Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-orange-500">Add ${(50 - total).toFixed(2)} more for free shipping</p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-100">
                <span>Total</span>
                <span style={{ color: '#ff6b35' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Coupon code" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              <button className="px-3 py-2 text-sm font-medium text-orange-500 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">Apply</button>
            </div>

            <button onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              Proceed to Checkout →
            </button>
            <Link to="/listings" className="block text-center text-sm text-gray-500 hover:text-orange-500 mt-3 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
