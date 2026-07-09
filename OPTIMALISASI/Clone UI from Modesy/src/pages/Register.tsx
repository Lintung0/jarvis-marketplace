import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', type: 'buyer' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/account') }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Poppins', color: '#1a1a2e' }}>
              Mode<span style={{ color: '#ff6b35' }}>sy</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of buyers and sellers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Account type toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            {['buyer', 'seller'].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={form.type === t ? { background: 'white', color: '#ff6b35', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { color: '#6b7280' }}>
                {t === 'buyer' ? '🛍️ Buyer' : '🏪 Seller'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="Alex" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Johnson" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter your password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
            </div>

            <p className="text-xs text-gray-400">
              By creating an account you agree to our{' '}
              <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
