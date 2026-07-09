import { useState } from 'react'
import { Link } from 'react-router'
import { products, sellers } from '../data/products'
import { useCart } from '../store/CartContext'

const tabs = ['Orders', 'Wishlist', 'Profile', 'Notifications', 'Settings'] as const
type Tab = typeof tabs[number]

const orders = [
  { id: 'MOD-28471', date: 'Jul 3, 2026', status: 'Delivered', items: 2, total: 127.00, products: [1, 2] },
  { id: 'MOD-28103', date: 'Jun 22, 2026', status: 'Shipped', items: 1, total: 38.00, products: [1] },
  { id: 'MOD-27654', date: 'Jun 10, 2026', status: 'Processing', items: 3, total: 244.50, products: [3, 4, 5] },
  { id: 'MOD-26998', date: 'May 28, 2026', status: 'Delivered', items: 1, total: 89.00, products: [2] },
]

const statusColors: Record<string, string> = {
  Delivered: '#10b981',
  Shipped: '#3b82f6',
  Processing: '#f59e0b',
  Cancelled: '#ef4444',
}

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>('Orders')
  const { wishlist, toggleWishlist, addToCart } = useCart()
  const [profile, setProfile] = useState({ firstName: 'Alex', lastName: 'Johnson', email: 'alex.johnson@email.com', phone: '+1 (555) 987-6543', bio: 'Passionate about fashion and finding great deals.', location: 'San Francisco, CA' })
  const [saved, setSaved] = useState(false)

  const wishlistProducts = products.filter(p => wishlist.includes(p.id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Profile banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-24 w-full" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }} />
        <div className="px-6 pb-5 flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
          <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #333)' }}>
            AJ
          </div>
          <div className="flex-1 pb-1">
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-gray-500">{profile.email} · {profile.location}</p>
          </div>
          <div className="flex gap-3 pb-1">
            {[{ v: orders.length, l: 'Orders' }, { v: wishlist.length, l: 'Wishlist' }, { v: 4, l: 'Reviews' }].map(s => (
              <div key={s.l} className="text-center px-4 border-r last:border-0 border-gray-100">
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{s.v}</p>
                <p className="text-xs text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={activeTab === tab ? { background: '#fff8f5', color: '#ff6b35' } : { color: '#6b7280' }}>
                {tab === 'Orders' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>}
                {tab === 'Wishlist' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                {tab === 'Profile' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                {tab === 'Notifications' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>}
                {tab === 'Settings' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                {tab}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 overflow-x-auto w-full mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={activeTab === tab ? { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: 'white' } : { color: '#6b7280' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'Orders' && (
            <div className="space-y-3">
              {orders.map(order => {
                const orderProducts = products.filter(p => order.products.includes(p.id))
                return (
                  <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Poppins' }}>{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: statusColors[order.status] + '20', color: statusColors[order.status] }}>
                          {order.status}
                        </span>
                        <span className="font-bold text-sm" style={{ color: '#ff6b35' }}>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {orderProducts.map(p => (
                        <Link key={p.id} to={`/product/${p.id}`} className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </Link>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs text-orange-500 font-semibold hover:underline">View Details</button>
                      {order.status === 'Delivered' && <button className="text-xs text-gray-500 hover:text-gray-700">Leave Review</button>}
                      {order.status !== 'Delivered' && <button className="text-xs text-gray-500 hover:text-gray-700">Track Package</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'Wishlist' && (
            wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">💝</div>
                <p className="font-semibold text-gray-700 mb-1">Your wishlist is empty</p>
                <p className="text-sm text-gray-400 mb-4">Save items you love for later</p>
                <Link to="/listings" className="text-sm text-orange-500 font-semibold hover:underline">Browse products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                    <Link to={`/product/${p.id}`}>
                      <div className="relative overflow-hidden bg-gray-50" style={{ height: 180 }}>
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button onClick={e => { e.preventDefault(); toggleWishlist(p.id) }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-all">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff6b35" stroke="#ff6b35" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link to={`/product/${p.id}`}>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-500 transition-colors mb-2" style={{ fontFamily: 'Poppins' }}>{p.title}</p>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: '#ff6b35' }}>${p.price.toFixed(2)}</span>
                        <button onClick={() => addToCart(p)} className="text-xs text-orange-500 font-semibold border border-orange-200 px-2.5 py-1 rounded-lg hover:bg-orange-50 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'Profile' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Edit Profile</h2>
              {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">✓ Profile saved successfully!</div>}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'firstName', label: 'First Name', col: 1 },
                  { key: 'lastName', label: 'Last Name', col: 1 },
                  { key: 'email', label: 'Email Address', col: 2 },
                  { key: 'phone', label: 'Phone Number', col: 2 },
                  { key: 'location', label: 'Location', col: 2 },
                ].map(field => (
                  <div key={field.key} className={field.col === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                    <input value={profile[field.key as keyof typeof profile]}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none" />
                </div>
              </div>
              <button onClick={handleSave}
                className="mt-5 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins' }}>Notifications</h2>
              <div className="space-y-3">
                {[
                  { icon: '📦', title: 'Order #MOD-28103 has shipped!', desc: 'Your package is on its way. Estimated delivery: Jul 9, 2026', time: '2 hours ago', unread: true },
                  { icon: '💰', title: 'Price drop on your wishlist', desc: "Cozy Knit Oversized Sweater dropped from $62 to $38", time: '1 day ago', unread: true },
                  { icon: '⭐', title: 'New review from a buyer', desc: 'Sarah M. left a 5-star review for your recent purchase', time: '2 days ago', unread: false },
                  { icon: '🎉', title: 'Welcome to Modesy!', desc: "You're all set. Start exploring thousands of unique items.", time: 'Jun 1, 2026', unread: false },
                ].map((n, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-xl transition-colors ${n.unread ? 'bg-orange-50 border border-orange-100' : 'border border-gray-100 hover:bg-gray-50'}`}>
                    <span className="text-2xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="space-y-4">
              {[
                {
                  title: 'Privacy',
                  items: [
                    { label: 'Profile visibility', desc: 'Make your profile visible to other users', enabled: true },
                    { label: 'Show online status', desc: 'Let others see when you are active', enabled: false },
                  ]
                },
                {
                  title: 'Notifications',
                  items: [
                    { label: 'Email notifications', desc: 'Receive order updates via email', enabled: true },
                    { label: 'Push notifications', desc: 'Get alerts for messages and deals', enabled: true },
                    { label: 'Marketing emails', desc: 'Receive promotions and new arrivals', enabled: false },
                  ]
                },
              ].map(section => (
                <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{ fontFamily: 'Poppins' }}>{section.title}</h3>
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <ToggleRow key={i} label={item.label} desc={item.desc} defaultEnabled={item.enabled} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-red-500 mb-3 text-sm">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, defaultEnabled }: { label: string; desc: string; defaultEnabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <button onClick={() => setEnabled(e => !e)}
        className="flex-shrink-0 w-11 h-6 rounded-full transition-all relative"
        style={{ background: enabled ? '#ff6b35' : '#e5e7eb' }}>
        <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all" style={{ left: enabled ? 22 : 2 }} />
      </button>
    </div>
  )
}
