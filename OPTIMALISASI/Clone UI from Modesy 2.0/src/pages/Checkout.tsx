import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../store/CartContext'

const steps = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState(false)

  const [shipping, setShipping] = useState({ firstName: 'Jordan', lastName: 'Smith', email: 'jordan.smith@email.com', phone: '+1 (555) 234-5678', address: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', zip: '62701', country: 'United States' })
  const [payment, setPayment] = useState({ cardNumber: '4111 1111 1111 1111', cardName: 'Jordan Smith', expiry: '09/28', cvv: '123', method: 'card' })

  const shippingFee = total >= 50 ? 0 : 5.99
  const tax = total * 0.08
  const grandTotal = total + shippingFee + tax

  if (items.length === 0 && !placed) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
      <Link to="/listings" className="text-orange-500 hover:underline">Browse products</Link>
    </div>
  )

  if (placed) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Order Placed!</h1>
      <p className="text-gray-500 mb-2">Thank you, {shipping.firstName}! Your order has been confirmed.</p>
      <p className="text-gray-400 text-sm mb-8">Order #MOD-{Math.floor(Math.random() * 90000 + 10000)} · Confirmation sent to {shipping.email}</p>
      <div className="flex gap-3 justify-center">
        <Link to="/account" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>Track Order</Link>
        <Link to="/" className="px-6 py-3 rounded-xl font-semibold text-sm border-2" style={{ borderColor: '#ff6b35', color: '#ff6b35' }}>Continue Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins' }}>Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={i <= step ? { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: 'white' } : { background: '#f3f4f6', color: '#9ca3af' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:inline" style={{ color: i <= step ? '#ff6b35' : '#9ca3af' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-3" style={{ background: i < step ? '#ff6b35' : '#e5e7eb' }} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'firstName', label: 'First Name', col: 1 },
                  { key: 'lastName', label: 'Last Name', col: 1 },
                  { key: 'email', label: 'Email Address', col: 2 },
                  { key: 'phone', label: 'Phone Number', col: 2 },
                  { key: 'address', label: 'Street Address', col: 2 },
                  { key: 'city', label: 'City', col: 1 },
                  { key: 'state', label: 'State', col: 1 },
                  { key: 'zip', label: 'ZIP Code', col: 1 },
                  { key: 'country', label: 'Country', col: 1 },
                ].map(field => (
                  <div key={field.key} className={field.col === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                    <input
                      value={shipping[field.key as keyof typeof shipping]}
                      onChange={e => setShipping(s => ({ ...s, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)}
                className="mt-6 w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Payment Method</h2>
              <div className="flex gap-3 mb-5">
                {[
                  { key: 'card', label: 'Credit Card' },
                  { key: 'paypal', label: 'PayPal' },
                  { key: 'apple', label: 'Apple Pay' },
                ].map(m => (
                  <button key={m.key} onClick={() => setPayment(p => ({ ...p, method: m.key }))}
                    className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={payment.method === m.key ? { borderColor: '#ff6b35', color: '#ff6b35', background: '#fff8f5' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                    {m.label}
                  </button>
                ))}
              </div>
              {payment.method === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
                    <input value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
                    <input value={payment.cardName} onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date</label>
                      <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                      <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} type="password"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                  </div>
                </div>
              )}
              {payment.method !== 'card' && (
                <div className="py-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">{payment.method === 'paypal' ? '🅿️' : '🍎'}</div>
                  <p className="text-sm">You'll be redirected to complete payment</p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border-2 font-semibold text-sm text-gray-600 border-gray-200 hover:border-gray-300 transition-all">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Review Your Order</h2>
              <div className="space-y-3 mb-5">
                {items.map(({ product: p, quantity }) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-400">Qty: {quantity}</p>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: '#ff6b35' }}>${(p.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm space-y-1">
                <div className="flex justify-between text-gray-600"><span>Ship to:</span><span>{shipping.address}, {shipping.city}, {shipping.state}</span></div>
                <div className="flex justify-between text-gray-600"><span>Pay with:</span><span>{payment.method === 'card' ? `••••${payment.cardNumber.slice(-4)}` : payment.method}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border-2 font-semibold text-sm text-gray-600 border-gray-200 hover:border-gray-300 transition-all">← Back</button>
                <button onClick={() => { clearCart(); setPlaced(true) }}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md"
                  style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                  Place Order · ${grandTotal.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-100">
              <span>Total</span><span style={{ color: '#ff6b35' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Secure checkout with SSL encryption
          </div>
        </div>
      </div>
    </div>
  )
}
